import type { TextOptionsLight } from 'jspdf';
import { assetUrl } from './asset';

export const PDF_MARGIN_X = 48;

// Includes Arabic + Arabic presentation forms (some PDFs export with presentation forms)
const isArabicText = (value: string): boolean => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(value);

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

// Lazy-load jsPDF only when needed (saves ~385KB from initial bundle)
let jsPDFModule: typeof import('jspdf') | null = null;

const getJsPDF = async (): Promise<typeof import('jspdf').jsPDF> => {
  if (!jsPDFModule) {
    jsPDFModule = await import('jspdf');
  }
  return jsPDFModule.jsPDF;
};

type JsPDFInstance = InstanceType<Awaited<ReturnType<typeof getJsPDF>>>;

const ensurePdfFonts = async (doc: JsPDFInstance): Promise<boolean> => {
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
 * Note: jsPDF is lazy-loaded on first call to reduce initial bundle size.
 */
export type CreatePdfDocOptions = {
  orientation?: 'p' | 'l';
  format?: 'a4' | [number, number];
};

export const createPdfDoc = async (options: CreatePdfDocOptions = {}): Promise<JsPDFInstance> => {
  const jsPDF = await getJsPDF();
  const { orientation = 'p', format = 'a4' } = options;
  const doc = new jsPDF({ orientation, unit: 'pt', format, putOnlyUsedFonts: true });
  const fontReady = await ensurePdfFonts(doc);
  doc.setFont(fontReady ? 'Cairo' : 'helvetica', 'bold');
  return doc;
};

/**
 * Writes text with automatic wrapping and returns the next Y position.
 */
export const writePdfText = (
  doc: JsPDFInstance,
  text: string,
  x: number,
  y: number,
  options?: (TextOptionsLight & { lineHeight?: number; maxWidth?: number }),
): number => {
  const pageW = doc.internal.pageSize.getWidth();

  const isArabic = isArabicText(text);
  const targetX = isArabic ? pageW - x : x;

  const { lineHeight, maxWidth, ...rawOptions } = options ?? {};
  const finalOptions: TextOptionsLight = isArabic ? { ...rtlBaseOptions, ...rawOptions } : rawOptions;

  // Wrap lines
  const wrapWidth = Math.max(120, maxWidth ?? pageW - x * 2);
  const lines = doc.splitTextToSize(text, wrapWidth);

  // Line height is interpreted as absolute points (pt). When omitted, derive it from the current font size.
  const fontSize = doc.getFontSize?.() ?? 12;
  const computedLineHeight = Math.max(12, fontSize * 1.35);
  const resolvedLineHeight = Math.max(10, lineHeight ?? computedLineHeight);

  let cursorY = y;
  for (const line of lines) {
    doc.text(String(line), targetX, cursorY, finalOptions);
    cursorY += resolvedLineHeight;
  }

  return cursorY;
};
