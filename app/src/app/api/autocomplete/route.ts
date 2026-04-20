import { NextRequest, NextResponse } from "next/server";
import { autocompleteSearch } from "@/lib/search-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = autocompleteSearch(query, 8);

    return NextResponse.json({
      suggestions: suggestions.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        categoryPath: item.categoryPath,
      })),
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
