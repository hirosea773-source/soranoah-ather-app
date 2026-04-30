/**
 * Web WorkerとReactをつなぐフック
 * - 非同期処理管理
 * - 進捗管理
 */

import { useState, useRef } from "react";
import { ResizeSettings } from "@/components/ResizeOptions";

export function useImageProcessor() {
  const workersRef = useRef<Worker[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const initWorkers = (count: number) => {
    if (workersRef.current.length === 0) {
      for (let i = 0; i < count; i++) {
        workersRef.current.push(
          new Worker(new URL("../workers/resizeWorker.ts", import.meta.url)),
        );
      }
    }
  };

  const processImages = async (files: File[], settings: ResizeSettings) => {
    const workerCount = Math.min(4, files.length);
    initWorkers(workerCount);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsProcessing(true);
    setProgress(0);

    const results: Blob[] = new Array(files.length);
    let completed = 0;

    const processFile = async (file: File, index: number, worker: Worker) => {
      if (signal.aborted) throw new Error("Cancelled");

      const bitmap = await createImageBitmap(file);

      return new Promise<Blob>((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          if (signal.aborted) {
            reject(new Error("Cancelled"));
            worker.removeEventListener("message", handleMessage);
            return;
          }

          if (e.data.error) {
            reject(e.data.error);
          } else {
            resolve(e.data.blob);
          }
          worker.removeEventListener("message", handleMessage);
        };

        worker.addEventListener("message", handleMessage);

        worker.postMessage({
          imageBitmap: bitmap,
          settings,
          id: index,
        });
      });
    };

    const promises = files.map((file, index) => {
      const workerIndex = index % workerCount;
      const worker = workersRef.current[workerIndex];
      return processFile(file, index, worker).then((blob) => {
        results[index] = blob;
        completed++;
        setProgress((completed / files.length) * 100);
      });
    });

    await Promise.all(promises);

    if (signal.aborted) throw new Error("Cancelled");

    setIsProcessing(false);
    return results;
  };

  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    processImages,
    cancel,
    progress,
    isProcessing,
  };
}
