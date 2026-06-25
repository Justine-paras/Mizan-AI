import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const isLocalDev = process.env.NODE_ENV === "development";
    if (!isLocalDev) {
      return NextResponse.json({ success: true, written: false, message: "Read-only production filesystem. Skipping disk write." });
    }

    const body = await request.json();
    const { geminiApiKey, supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } = body;

    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    const updates: Record<string, string> = {
      GEMINI_API_KEY: geminiApiKey || "",
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl || "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey || "",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey || "",
    };

    const lines = envContent.split(/\r?\n/);
    const updatedLines: string[] = [];
    const writtenKeys = new Set<string>();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        updatedLines.push(line);
        continue;
      }

      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        if (key in updates) {
          updatedLines.push(`${key}=${updates[key]}`);
          writtenKeys.add(key);
        } else {
          updatedLines.push(line);
        }
      } else {
        updatedLines.push(line);
      }
    }

    // Append any keys that weren't already present in .env.local
    for (const key of Object.keys(updates)) {
      if (!writtenKeys.has(key)) {
        // If file doesn't end with a newline and we are adding the first key, insert one
        if (updatedLines.length > 0 && updatedLines[updatedLines.length - 1].trim() !== "") {
          updatedLines.push("");
        }
        updatedLines.push(`${key}=${updates[key]}`);
      }
    }

    fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");

    console.log("Successfully updated variables inside .env.local");

    return NextResponse.json({
      success: true,
      written: true,
      message: "Configurations saved to .env.local on disk."
    });
  } catch (error: any) {
    console.error("POST settings/save-env error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
