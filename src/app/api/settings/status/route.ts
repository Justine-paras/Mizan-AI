import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isLocalDev = process.env.NODE_ENV === "development";
    
    // Check if the required environment variables are defined and not dummy placeholders
    const geminiConfigured = !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith("dummy");
    
    const supabaseConfigured = 
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy") &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("dummy") &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy");

    return NextResponse.json({
      geminiConfigured,
      supabaseConfigured,
      isLocalDev
    });
  } catch (error: any) {
    console.error("GET settings/status error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
