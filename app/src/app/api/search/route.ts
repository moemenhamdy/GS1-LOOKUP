import { NextRequest, NextResponse } from "next/server";
import { semanticSearch } from "@/lib/search-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, topK = 10 } = body;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json(
        { error: "يجب إدخال كلمة بحث لا تقل عن حرفين" },
        { status: 400 }
      );
    }

    if (topK < 1 || topK > 50) {
      return NextResponse.json(
        { error: "عدد النتائج يجب أن يكون بين 1 و 50" },
        { status: 400 }
      );
    }

    const { results, queryTimeMs } = await semanticSearch(
      query.trim(),
      Math.min(topK, 50)
    );

    return NextResponse.json({
      results,
      queryTimeMs,
      totalResults: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
