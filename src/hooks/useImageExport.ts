// インストール:
// pnpm add dom-to-image-more

"use client";

import { useCallback } from "react";
import domtoimage from "dom-to-image-more";
import { ImageExportOption } from "@/types/imageExport";

export const useImageExport = () => {
  const exportElementAsImage = useCallback(
    async (
      element: HTMLElement,
      fileName: string,
      options: {
        scale?: number;
        quality?: number;
      } = {},
    ) => {
      const { scale = 2, quality = 0.92 } = options;

      try {
        // dom-to-imageでPNGに変換
        const dataUrl = await domtoimage.toPng(element, {
          width: element.scrollWidth * scale,
          height: element.scrollHeight * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${element.scrollWidth}px`,
            height: `${element.scrollHeight}px`,
          },
          quality: quality,
        });

        // ダウンロード実行
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { success: true };
      } catch (error) {
        console.error("Image export failed:", error);
        return { success: false, error: String(error) };
      }
    },
    [],
  );

  const exportPrintPages = useCallback(
    async (option: ImageExportOption, baseFileName: string) => {
      const frontPage = document.querySelector(".print-front") as HTMLElement;
      const backPage = document.querySelector(".print-back") as HTMLElement;

      if (!frontPage || !backPage) {
        throw new Error("Print pages not found");
      }

      const exportOptions = {
        scale: 2,
        quality: 0.92,
      };

      try {
        if (option === "both") {
          await exportElementAsImage(
            frontPage,
            `${baseFileName}_表面`,
            exportOptions,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
          await exportElementAsImage(
            backPage,
            `${baseFileName}_裏面`,
            exportOptions,
          );
        } else if (option === "front") {
          await exportElementAsImage(
            frontPage,
            `${baseFileName}_表面`,
            exportOptions,
          );
        } else if (option === "back") {
          await exportElementAsImage(
            backPage,
            `${baseFileName}_裏面`,
            exportOptions,
          );
        }

        return { success: true };
      } catch (error) {
        console.error("Export failed:", error);
        throw error;
      }
    },
    [exportElementAsImage],
  );

  return {
    exportElementAsImage,
    exportPrintPages,
  };
};
