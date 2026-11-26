export type ParsedReceipt = {
  merchant: string;
  date: string;
  category: string;
  items: { id: string; name: string; cents: number }[];
  recognizedTotal: number | null;
};

type OcrBlock = { text: string; boundingBox: { x: number; y: number; width: number; height: number } };

// Vision may return the item name and price as separate blocks on the same row.
export function receiptTextFromBlocks(blocks: OcrBlock[], fallback: string): string {
  if (!blocks.length) return fallback;
  const rows: { y: number; height: number; blocks: OcrBlock[] }[] = [];
  const sorted = [...blocks].sort((a, b) => a.boundingBox.y - b.boundingBox.y);
  for (const block of sorted) {
    const box = block.boundingBox;
    const center = box.y + box.height / 2;
    const row = rows.find(candidate => Math.abs(candidate.y - center) <= Math.max(candidate.height, box.height) * 0.65);
    if (row) {
      row.blocks.push(block);
      row.height = Math.max(row.height, box.height);
    } else rows.push({ y: center, height: box.height, blocks: [block] });
  }
  return rows.sort((a, b) => a.y - b.y).map(row => row.blocks.sort((a, b) => a.boundingBox.x - b.boundingBox.x).map(block => block.text).join(' ')).join('\n');
}

// OCR is imperfect: preserve uncertain fields for the user to review instead of inventing values.
export function parseReceipt(text: string): ParsedReceipt {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const merchant = lines.find(line => /[a-z]/i.test(line) && !/receipt|invoice|tax|tel|phone|www\.|date|cashier|order|sample/i.test(line)) ?? '';
  const date = lines.map(line => line.match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/i)?.[0]).find(Boolean) ?? '';
  const items: ParsedReceipt['items'] = [];
  let receiptTotal: number | null = null;
  for (const line of lines) {
    const match = line.match(/^(.*?)\s+(?:\$|£|€|Rs\.?|LKR)?\s*(\d{1,6}[.,]\d{2})\s*$/i);
    if (!match) continue;
    const name = match[1].replace(/^\s*\d+\s*[x×]\s*/i, '').trim();
    const [whole, fraction] = match[2].replace(',', '.').split('.');
    const cents = Number(whole) * 100 + Number(fraction);
    if (/^(?:grand\s+)?total\b|amount\s+due|balance\s+due/i.test(name)) { receiptTotal = cents; continue; }
    if (!/[a-z]/i.test(name) || /subtotal|sub total|tax|vat|discount|change|cash|card|payment|tender|balance/i.test(name)) continue;
    items.push({ id: `ocr-${items.length}`, name, cents });
  }
  if (!items.length && receiptTotal !== null) items.push({ id: 'ocr-total', name: 'Receipt total', cents: receiptTotal });
  const category = /cafe|coffee|restaurant|dining|bakery|bistro/i.test(merchant) ? 'Food & Dining' : /supermarket|grocery|grocer/i.test(merchant) ? 'Groceries' : 'Other';
  return { merchant, date, category, items, recognizedTotal: receiptTotal };
}
