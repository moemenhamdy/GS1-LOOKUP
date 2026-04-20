import { NextResponse } from "next/server";
import { loadData } from "@/lib/data-loader";

export async function GET() {
  try {
    const data = loadData();

    return NextResponse.json({
      categories: data.categories,
      stats: data.stats,
    });
  } catch (error) {
    console.error("Browse error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحميل البيانات" },
      { status: 500 }
    );
  }
}
