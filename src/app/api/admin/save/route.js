import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "school-content.json");
const SOCIAL_PATH = path.join(process.cwd(), "data", "social-cache.json");

export async function POST(request) {
  try {
    const body = await request.json();
    const { password, type, data } = body;

    // Simple security validation
    if (password !== "trabas123") {
      return NextResponse.json(
        { success: false, error: "Password admin salah!" },
        { status: 401 }
      );
    }

    if (type === "content") {
      fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Konten website berhasil disimpan!" });
    } else if (type === "activities") {
      fs.writeFileSync(SOCIAL_PATH, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true, message: "Daftar kegiatan berhasil disimpan!" });
    } else {
      return NextResponse.json({ success: false, error: "Tipe data tidak dikenal" }, { status: 400 });
    }
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
