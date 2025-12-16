import { jsPDF } from 'jspdf';
import type { TextOptionsLight } from 'jspdf';

import { assetUrl } from './asset';

export const PDF_MARGIN_X = 48;

// Includes Arabic + Arabic presentation forms (some PDFs export with presentation forms)
const isArabicText = (value: string) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(value);

const rtlBaseOptions: TextOptionsLight = {
  align: 'right',
  isInputRtl: true,
  isOutputRtl: true,
  isInputVisual: false,
  isSymmetricSwapping: true,
};

type FontAsset = {
  url: string;
  vfsName: string;
  fontName: string;
  fontStyle: 'normal' | 'bold';
  data?: string;
};

// Font cache - loaded once, reused across all PDF generations
// IMPORTANT: use relative URLs (no leading slash) so it works under GitHub Pages sub-path.
const arabicFonts: FontAsset[] = [
  { url: 'fonts/Cairo-Regular.ttf', vfsName: 'Cairo-Regular.ttf', fontName: 'Cairo', fontStyle: 'normal' },
  { url: 'fonts/Cairo-Bold.ttf', vfsName: 'Cairo-Bold.ttf', fontName: 'Cairo', fontStyle: 'bold' },
];

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const ensurePdfFonts = async (doc: jsPDF): Promise<boolean> => {
  try {
    for (const font of arabicFonts) {
      if (!font.data) {
        const response = await fetch(assetUrl(font.url));
        if (!response.ok) throw new Error(`Failed to load PDF font: ${font.url}`);
        const buffer = await response.arrayBuffer();
        font.data = arrayBufferToBase64(buffer);
      }
      doc.addFileToVFS(font.vfsName, font.data);
      doc.addFont(font.vfsName, font.fontName, font.fontStyle);
    }
    doc.setFont('Cairo', 'normal');
    return true;
  } catch (error) {
    console.error('Failed to load Arabic PDF font', error);
    return false;
  }
};

/**
 * Creates an A4 PDF doc with embedded Cairo font (Arabic-friendly). Works under GitHub Pages.
 */
export const createPdfDoc = async (): Promise<jsPDF> => {
  const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4', putOnlyUsedFonts: true });
  const fontReady = await ensurePdfFonts(doc);
  doc.setFont(fontReady ? 'Cairo' : 'helvetica', 'bold');
  return doc;
};

/**
 * Writes text with automatic wrapping and returns the next Y position.
 */
export const writePdfText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: (TextOptionsLight & { lineHeight?: number }),
): number => {
  const pageW = doc.internal.pageSize.getWidth();
  const maxWidth = Math.max(120, pageW - x * 2);

  const isArabic = isArabicText(text);
  const targetX = isArabic ? pageW - x : x;

  // Allow a custom line height multiplier without polluting jsPDF TextOptions
  const { lineHeight: lineHeightMul = 1.35, ...rawOptions } = (options ?? {}) as any;
  const finalOptions = isArabic ? { ...rtlBaseOptions, ...rawOptions } : (rawOptions as TextOptionsLight);

  // Wrap lines
  const lines = doc.splitTextToSize(text, maxWidth);

  // Estimate line height (in pt)
  const fontSize = (doc as any).internal?.getFontSize ? (doc as any).internal.getFontSize() : 12;
  const lineHeight = Math.max(12, fontSize * lineHeightMul);

  let cursorY = y;
  for (const line of lines) {
    doc.text(String(line), targetX, cursorY, finalOptions);
    cursorY += lineHeight;
  }

  return cursorY;
};
