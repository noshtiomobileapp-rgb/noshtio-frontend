// app/api/menu/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempPath = `/tmp/${Date.now()}-${file.name}`;
    await writeFile(tempPath, buffer);

    // dynamic import - avoids top-level import type problems in TS
    const tesseract = await import("tesseract.js");
    // if the module uses default export, try both
    const createWorker = tesseract.createWorker ?? (tesseract.default?.createWorker);

    if (!createWorker) {
      throw new Error("Failed to load createWorker from tesseract.js");
    }

    const worker: any = createWorker({
      // logger: m => console.log(m) // optional progress logger
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    // you can pass { tessedit_pageseg_mode: '...' } in recognize options if needed
    const { data } = await worker.recognize(tempPath);
    await worker.terminate();

    const text = data?.text ?? "";

    // TODO: replace with your parser
    const parseMenuText = (raw: string) => {
      const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
      const items: any[] = [];
      for (const line of lines) {
        const m = line.match(/(.+?)\s+(\d{2,4})$/);
        if (m) items.push({ name: m[1].trim(), price: Number(m[2]), category: "Uncategorized" });
      }
      return items;
    };

    const items = parseMenuText(text);

    return NextResponse.json({
      success: true,
      extractedText: text,
      items,
    });
  } catch (err: any) {
    console.error("OCR error:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
