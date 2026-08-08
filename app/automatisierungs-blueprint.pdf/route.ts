import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const PDF_SIZE = 1_500_000;
const headers = {
  "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
  "Content-Disposition":
    'attachment; filename="Westmonks-Automatisierungs-Blueprint.pdf"',
  "Content-Length": String(PDF_SIZE),
  "Content-Type": "application/pdf",
  "X-Content-Type-Options": "nosniff",
};

async function getBlueprint() {
  const assetDirectory = path.join(process.cwd(), "assets");
  const chunks = await Promise.all([
    readFile(path.join(assetDirectory, "blueprint.part-01.bin")),
    readFile(path.join(assetDirectory, "blueprint.part-02.bin")),
    readFile(path.join(assetDirectory, "blueprint.part-03.bin")),
  ]);
  const pdf = Buffer.concat(chunks);

  if (pdf.byteLength !== PDF_SIZE) {
    throw new Error(`Invalid blueprint size: ${pdf.byteLength}`);
  }

  return pdf;
}

export async function GET() {
  const pdf = await getBlueprint();
  return new Response(new Uint8Array(pdf), { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}
