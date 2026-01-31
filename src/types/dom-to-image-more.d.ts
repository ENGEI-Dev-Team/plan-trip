// src/types/dom-to-image-more.d.ts
declare module 'dom-to-image-more' {
  export interface Options {
    width?: number;
    height?: number;
    style?: Record<string, string>;
    quality?: number;
    bgcolor?: string;
    cacheBust?: boolean;
    imagePlaceholder?: string;
    filter?: (node: Node) => boolean;
  }

  export function toPng(
    node: HTMLElement,
    options?: Options
  ): Promise<string>;

  export function toJpeg(
    node: HTMLElement,
    options?: Options
  ): Promise<string>;

  export function toBlob(
    node: HTMLElement,
    options?: Options
  ): Promise<Blob>;

  export function toPixelData(
    node: HTMLElement,
    options?: Options
  ): Promise<Uint8ClampedArray>;

  export function toSvg(
    node: HTMLElement,
    options?: Options
  ): Promise<string>;
}