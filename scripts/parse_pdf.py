"""
GS1 PDF Parser — Extracts product codes and categories from the Arabic GS1 PDF.
The PDF stores text in reversed visual order — this parser handles that.
Outputs structured JSON to data/gs1_data.json
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

import pdfplumber
import re
import json
import os
import unicodedata

PDF_PATH = os.path.join(os.path.dirname(__file__), '..', 'اكود-المنظومه-الضريبيه-كل-اكود-موقع-gs1-بالعربي (1).pdf')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'gs1_data.json')

ARABIC_DIGITS = str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789')

def arabic_to_english_nums(s: str) -> str:
    return s.translate(ARABIC_DIGITS)

def reverse_line(line: str) -> str:
    """
    Reverse the visual order of text while keeping number sequences intact.
    The PDF stores Arabic text in visual (reversed) order.
    """
    # Simple full reversal works for the Arabic text
    reversed_text = line[::-1]
    
    # Now fix the Arabic numbers that got reversed too
    # Find all Arabic digit sequences and reverse them back
    def fix_arabic_nums(match):
        return match.group(0)[::-1]
    
    # Fix Arabic numeral sequences (٠-٩)
    reversed_text = re.sub(r'[٠-٩]+', fix_arabic_nums, reversed_text)
    # Fix Latin digit sequences 
    reversed_text = re.sub(r'[0-9]+', fix_arabic_nums, reversed_text)
    
    return reversed_text

def is_noise_line(line: str) -> bool:
    if not line.strip():
        return True
    if 'alliedforlegal' in line.lower():
        return True
    if 'https://' in line.lower():
        return True
    if 'gpc' in line.lower() or 'cpg' in line.lower():
        if 'اكواد' in line or 'داوﻛا' in line or 'الاصناف' in line or 'فﺎﻧﺻﻻا' in line:
            return True
    return False

def extract_lines_from_pdf(pdf_path: str) -> list[str]:
    print(f"Reading PDF: {pdf_path}")
    pdf = pdfplumber.open(pdf_path)
    print(f"Total pages: {len(pdf.pages)}")
    
    all_lines = []
    for page in pdf.pages:
        text = page.extract_text() or ''
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            # Reverse the line to get proper reading order
            fixed_line = reverse_line(line)
            if not is_noise_line(fixed_line):
                all_lines.append(fixed_line)
    
    pdf.close()
    return all_lines

def parse_lines(lines: list[str]) -> dict:
    categories = []
    all_items = []
    current_category = None
    current_subcategory = None
    seen_codes = set()
    pending_category_code = None
    
    item_id = 0
    cat_id = 0
    subcat_id = 0
    
    for i, line in enumerate(lines):
        converted = arabic_to_english_nums(line)
        
        # Check if this is a standalone number (category code)
        if re.match(r'^\d{5,}$', converted.strip()):
            pending_category_code = converted.strip()
            continue
        
        # Check if this line has a code + name
        # After reversal: name comes first, then number at the end
        # OR: number at the start, then name
        m_start = re.match(r'^(\d{4,})\s+(.+)', converted)  # number at start
        m_end = re.search(r'(.+?)\s+(\d{4,})$', converted)  # number at end
        
        code = None
        name = None
        
        if m_start:
            code = m_start.group(1)
            # Get original arabic text after the number
            parts = line.split(None, 1)
            name = parts[1].strip() if len(parts) == 2 else None
        elif m_end:
            code = m_end.group(2)
            # Get original arabic text before the number
            parts = line.rsplit(None, 1)
            name = parts[0].strip() if len(parts) == 2 else None
        
        if code and name:
            # Skip header lines
            if 'التبويب' in name and 'البريك' in name:
                continue
            if 'كود' in name and ('بريك' in name or 'تبويب' in name):
                continue
                
            if code not in seen_codes:
                seen_codes.add(code)
                item_id += 1
                
                cat_path = []
                if current_category:
                    cat_path.append(current_category['name'])
                if current_subcategory:
                    cat_path.append(current_subcategory['name'])
                
                item = {
                    'id': f'item_{item_id}',
                    'code': code,
                    'name': name,
                    'categoryPath': cat_path,
                    'searchText': f"{name} {' '.join(cat_path)}"
                }
                
                all_items.append(item)
                
                if current_subcategory is not None:
                    current_subcategory['items'].append(item)
                elif current_category is not None:
                    current_category.setdefault('items', []).append(item)
            
            pending_category_code = None
            continue
        
        # No code found — this is a category/subcategory name
        name = line.strip()
        if not name or len(name) < 2:
            pending_category_code = None
            continue
        
        if name in ('(فارغ)', '(غراف)'):
            pending_category_code = None
            continue
        
        if pending_category_code:
            cat_id += 1
            current_category = {
                'id': f'cat_{cat_id}',
                'name': name,
                'code': pending_category_code,
                'subcategories': [],
                'items': []
            }
            categories.append(current_category)
            current_subcategory = None
            pending_category_code = None
        else:
            if current_category:
                if name == current_category['name']:
                    continue
                if current_subcategory and name == current_subcategory['name']:
                    continue
                
                subcat_id += 1
                current_subcategory = {
                    'id': f'subcat_{subcat_id}',
                    'name': name,
                    'items': []
                }
                current_category['subcategories'].append(current_subcategory)
            else:
                cat_id += 1
                current_category = {
                    'id': f'cat_{cat_id}',
                    'name': name,
                    'code': '',
                    'subcategories': [],
                    'items': []
                }
                categories.append(current_category)
                current_subcategory = None
    
    # Clean up
    cleaned_categories = []
    for cat in categories:
        cat['subcategories'] = [sub for sub in cat['subcategories'] if sub.get('items')]
        if cat.get('items') or cat.get('subcategories'):
            cleaned_categories.append(cat)
    
    return {
        'categories': cleaned_categories,
        'allItems': all_items,
        'stats': {
            'totalItems': len(all_items),
            'totalCategories': len(cleaned_categories),
            'totalSubcategories': sum(len(c['subcategories']) for c in cleaned_categories)
        }
    }


def main():
    lines = extract_lines_from_pdf(PDF_PATH)
    print(f"Extracted {len(lines)} meaningful lines")
    
    data = parse_lines(lines)
    
    print(f"\n=== Results ===")
    print(f"Total items: {data['stats']['totalItems']}")
    print(f"Total categories: {data['stats']['totalCategories']}")
    print(f"Total subcategories: {data['stats']['totalSubcategories']}")
    
    print(f"\nSample items:")
    for item in data['allItems'][:10]:
        print(f"  [{item['code']}] {item['name']}")
        print(f"    Path: {' > '.join(item['categoryPath'])}")
    
    print(f"\nSample categories:")
    for cat in data['categories'][:5]:
        sub_count = len(cat['subcategories'])
        item_count = len(cat.get('items', []))
        print(f"  [{cat['code']}] {cat['name']} — {sub_count} subcats, {item_count} items")
        for sub in cat['subcategories'][:2]:
            print(f"    └─ {sub['name']} ({len(sub['items'])} items)")
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Data written to {OUTPUT_PATH}")
    print(f"  File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")


if __name__ == '__main__':
    main()
