"use client";

/**
 * 進捗バー
 */

type Props = {
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  return (
    <div className="w-full bg-gray-200 rounded h-4 animate-pulse">
      <div
        className="bg-blue-500 h-4 rounded transition-all"
        style={{ width: `${progress}%` }}
        aria-label="処理進捗"
      />
    </div>
  );
}
