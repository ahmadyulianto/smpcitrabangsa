import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "school-content.json");
const SOCIAL_PATH = path.join(process.cwd(), "data", "social-cache.json");

export async function GET() {
  try {
    let content = {};
    let activities = [];

    if (fs.existsSync(CONTENT_PATH)) {
      content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
    }

    if (fs.existsSync(SOCIAL_PATH)) {
      activities = JSON.parse(fs.readFileSync(SOCIAL_PATH, "utf-8"));
    }

    // Disable caching for this route so it always returns the latest disk updates
    const response = NextResponse.json({ success: true, content, activities });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Get data error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
