import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "logo", "hero", or "activity"
    const password = formData.get("password");

    // Simple security check
    if (password !== "trabas123") {
      return NextResponse.json(
        { success: false, error: "Password admin salah!" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let filename = "";
    if (type === "logo") {
      filename = "logo.jpg";
      const publicPath = path.join(process.cwd(), "public", filename);
      fs.writeFileSync(publicPath, buffer);
      return NextResponse.json({ 
        success: true, 
        message: "Gambar Logo berhasil diperbarui!" 
      });
    } else if (type === "hero") {
      filename = "hero-bg.jpg";
      const publicPath = path.join(process.cwd(), "public", filename);
      fs.writeFileSync(publicPath, buffer);
      return NextResponse.json({ 
        success: true, 
        message: "Gambar Latar Belakang Hero berhasil diperbarui!" 
      });
    } else if (type === "activity") {
      // Create a unique safe filename
      const ext = file.name.split('.').pop() || 'jpg';
      filename = `activity-${Date.now()}.${ext}`;
      
      const activitiesDir = path.join(process.cwd(), "public", "activities");
      if (!fs.existsSync(activitiesDir)) {
        fs.mkdirSync(activitiesDir, { recursive: true });
      }
      
      const publicPath = path.join(activitiesDir, filename);
      fs.writeFileSync(publicPath, buffer);
      
      return NextResponse.json({ 
        success: true, 
        url: `/activities/${filename}`,
        message: "Gambar Berita berhasil diunggah!" 
      });
    } else {
      return NextResponse.json({ success: false, error: "Tipe unggahan tidak dikenal" }, { status: 400 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
