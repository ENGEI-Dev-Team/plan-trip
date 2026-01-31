
export type ImageExportOption = 'front' | 'back' | 'both';

export interface ImageExportSettings {
  option: ImageExportOption;
  fileName: string;
  quality: number; // 0.0 - 1.0
  scale: number; // 2 or 3 for Retina
}

export interface ImageExportResult {
  success: boolean;
  error?: string;
}