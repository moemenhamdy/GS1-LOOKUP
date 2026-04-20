import pandas as pd
import json
import os
import requests
import time
from dotenv import load_dotenv
import math

# Load env to get JINA_API_KEY
load_dotenv('app/.env.local')
JINA_API_KEY = os.environ.get('JINA_API_KEY')
if not JINA_API_KEY:
    print("No JINA_API_KEY found in app/.env.local !")
    exit(1)

JINA_API_URL = "https://api.jina.ai/v1/embeddings"
JINA_MODEL = "jina-embeddings-v5-text-small"
DIMENSIONS = 1024

print("Loading Excel file...")
df = pd.read_excel('AR_GPC as of November 2025 v20251127 GB.xlsx')
df.fillna('', inplace=True)

categories_dict = {}
all_items = []

cat_counter = 1
subcat_counter = 1
item_counter = 1

print("Building data structure...")
for index, row in df.iterrows():
    seg_code = str(row['SegmentCode']).split('.')[0] if isinstance(row['SegmentCode'], float) else str(row['SegmentCode'])
    
    if seg_code not in categories_dict:
        categories_dict[seg_code] = {
            "id": f"cat_{cat_counter}",
            "name": row['SegmentTitle_AR'] if row['SegmentTitle_AR'] else row['SegmentTitle'],
            "name_en": row['SegmentTitle'],
            "code": seg_code,
            "subcategories": {},
            "items": []
        }
        cat_counter += 1
    
    cat_obj = categories_dict[seg_code]
    
    class_code = str(row['ClassCode']).split('.')[0] if isinstance(row['ClassCode'], float) else str(row['ClassCode'])
    if class_code not in cat_obj["subcategories"]:
        cat_obj["subcategories"][class_code] = {
            "id": f"subcat_{subcat_counter}",
            "name": row['ClassTitle_AR'] if row['ClassTitle_AR'] else row['ClassTitle'],
            "name_en": row['ClassTitle'],
            "items": []
        }
        subcat_counter += 1
        
    subcat_obj = cat_obj["subcategories"][class_code]
    
    brick_code = str(row['BrickCode']).split('.')[0] if isinstance(row['BrickCode'], float) else str(row['BrickCode'])
    
    item_ar = row['BrickTitle_AR'] if row['BrickTitle_AR'] else row['BrickTitle']
    item_en = row['BrickTitle']
    
    fam_ar = row['FamilyTitle_AR'] if row['FamilyTitle_AR'] else row['FamilyTitle']
    fam_en = row['FamilyTitle']

    class_ar = row['ClassTitle_AR'] if row['ClassTitle_AR'] else row['ClassTitle']
    class_en = row['ClassTitle']

    seg_ar = row['SegmentTitle_AR'] if row['SegmentTitle_AR'] else row['SegmentTitle']
    seg_en = row['SegmentTitle']
    
    cat_path_list = [cat_obj['name'], fam_ar, subcat_obj['name']]
    
    searchText = f"{seg_ar} {seg_en} {fam_ar} {fam_en} {class_ar} {class_en} {item_ar} {item_en}"
    # Standardize spaces
    searchText = " ".join(searchText.split())
    
    item = {
        "id": f"item_{item_counter}",
        "code": brick_code,
        "name": item_ar,
        "categoryPath": cat_path_list,
        "searchText": searchText
    }
    item_counter += 1
    
    subcat_obj["items"].append(item)
    all_items.append(item)

# Convert dicts to lists
categories = []
for cat_code, cat_obj in categories_dict.items():
    del cat_obj['name_en']
    
    cat_subcats = []
    for subcat_code, subcat_obj in cat_obj['subcategories'].items():
        del subcat_obj['name_en']
        cat_subcats.append(subcat_obj)
        
    cat_obj['subcategories'] = cat_subcats
    categories.append(cat_obj)

gs1_data = {
    "categories": categories,
    "allItems": all_items,
    "stats": {
        "totalItems": len(all_items),
        "totalCategories": len(categories),
        "totalSubcategories": sum(len(c["subcategories"]) for c in categories)
    }
}

print(f"Data built. Categories: {len(categories)}, Subcategories: {gs1_data['stats']['totalSubcategories']}, Items: {len(all_items)}")

inputs = [item['searchText'] for item in all_items]
print(f"Total inputs for embedding: {len(inputs)}")

def get_embeddings_in_batches(texts, batch_size=800):
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        print(f"Processing batch {i} to {i+len(batch)} of {len(texts)}...")
        
        retries = 5
        while retries > 0:
            try:
                resp = requests.post(
                    JINA_API_URL,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {JINA_API_KEY}"
                    },
                    json={
                        "model": JINA_MODEL,
                        "input": batch,
                        "embedding_type": "float"
                    }
                )
                
                if resp.status_code == 200:
                    data = resp.json()
                    for emb_obj in data['data']:
                        all_embeddings.append(emb_obj['embedding'])
                    break
                elif resp.status_code == 429:
                    print(f"Rate limit exceeded. Waiting 65 seconds... {resp.text}")
                    time.sleep(65)
                else:
                    print(f"Error {resp.status_code}: {resp.text}")
                    retries -= 1
                    time.sleep(5)
            except Exception as e:
                print(f"Request exception: {e}")
                retries -= 1
                time.sleep(2)
                
        if retries == 0:
            print("Failed to get embeddings for batch. Exiting.")
            exit(1)
            
    return all_embeddings

print("Starting to embed...")
embeddings_list = get_embeddings_in_batches(inputs, batch_size=800)

gs1_embeddings = {
    "model": JINA_MODEL,
    "dimensions": DIMENSIONS,
    "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "items": []
}

for i, item in enumerate(all_items):
    gs1_embeddings['items'].append({
        "id": item['id'],
        "embedding": embeddings_list[i]
    })

print("Writing app/data/gs1_data.json...")
with open('app/data/gs1_data.json', 'w', encoding='utf-8') as f:
    json.dump(gs1_data, f, ensure_ascii=False, indent=2)

print("Writing app/data/gs1_embeddings.json...")
with open('app/data/gs1_embeddings.json', 'w', encoding='utf-8') as f:
    json.dump(gs1_embeddings, f, ensure_ascii=False)

print("Finished successfully.")
