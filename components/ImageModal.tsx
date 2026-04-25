"use client";

/**
 * 画像拡大モーダル
 */

type Props = {
  src: string;
  onClose: () => void;
};

export function ImageModal({ src, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <img
        src={src}
        className="max-w-[90%] max-h-[90%] rounded"
        alt="preview"
      />
    </div>
  );
}
