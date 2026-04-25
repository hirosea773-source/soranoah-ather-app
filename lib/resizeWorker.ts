/**
 * Web Worker
 * - Canvasでリサイズ処理
 * - メインスレッドをブロックしない
 */

self.onmessage = async (e: MessageEvent) => {
  const { imageBitmap, settings } = e.data;

  try {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas初期化失敗");

    let targetWidth = imageBitmap.width;
    let targetHeight = imageBitmap.height;

    if (settings.mode === "percentage") {
      targetWidth *= settings.percentage / 100;
      targetHeight *= settings.percentage / 100;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    const blob = await canvas.convertToBlob({
      type: `image/${settings.format === "original" ? "png" : settings.format}`,
      quality: settings.quality / 100,
    });

    self.postMessage({ blob });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};
