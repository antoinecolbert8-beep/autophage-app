declare module "pdf-parse" {
  interface PDFInfo {
    Author?: string;
    Creator?: string;
    Producer?: string;
    Title?: string;
    CreationDate?: string;
    ModDate?: string;
    [key: string]: unknown;
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata?: unknown;
    version: string;
    text: string;
  }

  export default function pdf(buffer: Buffer): Promise<PDFData>;
}






