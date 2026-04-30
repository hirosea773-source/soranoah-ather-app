/**
 * ZIP生成 & ダウンロード処理
 */

import JSZip from "jszip";

export async function exportAsZip(blobs: Blob[], filenames: string[]) {
  const zip = new JSZip();

  blobs.forEach((blob, i) => {
    zip.file(filenames[i], blob);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(content);
  const a = document.createElement("a");

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  a.href = url;
  a.download = `resized_images_${date}.zip`;
  a.click();

  URL.revokeObjectURL(url);
}
