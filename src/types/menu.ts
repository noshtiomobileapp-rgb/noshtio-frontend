export interface OcrDraftItem {
  id: string;
  name: string;
  price?: number;
  category?: string;
  confidence?: number; // 0–1 from OCR
}
