/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      logging?: boolean;
      dpi?: number;
      width?: number;
      height?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: 'portrait' | 'landscape';
    };
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  }

  interface Html2PdfWorker {
    from(element: HTMLElement | string): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    to(target: string): Html2PdfWorker;
    output(type: string, options?: any): any;
    outputPdf(type?: string): any;
    save(filename?: string): Promise<void>;
    get(key: string): any;
    then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any): Promise<any>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2PdfWorker;

  export = html2pdf;
}