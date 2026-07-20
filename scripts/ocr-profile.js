const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createWorker } = require("tesseract.js");

const pages = [
  "207a3f4dc9621eb18595179e147cf627.webp",
  "733778760839876e40844378aa4183c8.webp",
  "fc31b7c21f381041572eae959d1b6254.webp",
  "ebb593538e7092177edf1ce41cbcbfb7.webp",
  "e06d54b7a319102a6004afa2ee4e9842.webp",
  "c30315787194455b7003a016d8aaff50.webp",
  "49cd05e15c14b1b6bd46c06ef8b2eabd.webp",
  "d2772b3ffcda386d242685c23199c42a.webp",
  "79b40b94b080f0069ca669ca2bd27db0.webp",
  "ebc0c78f1e69b9d22b5c4af29fd47ef4.webp",
  "0f8efd6b94ed627e1d0131488e4c1f18.webp",
  "7679aaa731f46e0a500d211224ea0335.webp",
  "390d7068fcac4037c18480a507f86015.webp",
  "75bc558a95a25a437c001b50716e5bed.webp",
  "5e61685e6520ace441f04975eda6d01f.webp",
  "4b231797a55d9e1d011ac46fedf1adcd.webp"
];

const baseUrl = "https://online.fliphtml5.com/btxuw/uyjn/files/large/";
const tempDir = path.join(__dirname, "temp_pages");
const outputFile = path.join(__dirname, "../data/extracted_profile.txt");

async function runOCR() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log("Memulai pengunduhan dan OCR profil sekolah...");
  const worker = await createWorker("ind+eng");

  let fullText = "";

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    const filename = pages[i];
    const url = `${baseUrl}${filename}`;
    const localPath = path.join(tempDir, `page-${pageNum}.webp`);

    console.log(`[Page ${pageNum}/${pages.length}] Mengunduh ${url}...`);
    try {
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(localPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      console.log(`[Page ${pageNum}/${pages.length}] Melakukan OCR pada ${localPath}...`);
      const { data: { text } } = await worker.recognize(localPath);
      
      const pageSeparator = `\n\n==================== HALAMAN ${pageNum} ====================\n\n`;
      fullText += pageSeparator + text;
      
      // Append text incrementally to output file
      fs.writeFileSync(outputFile, fullText);
      console.log(`[Page ${pageNum}/${pages.length}] Selesai! Text berhasil ditambahkan.`);
    } catch (err) {
      console.error(`Gagal memproses halaman ${pageNum}:`, err.message);
    }
  }

  await worker.terminate();
  console.log(`OCR selesai! Seluruh hasil disimpan di: ${outputFile}`);
}

runOCR();
