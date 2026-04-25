"use client";

/**
 * Before / After 比較（クリックで拡大）
 */

type Props = {
  before: string;
  after?: string;
  onClick?: () => void;
};

export function ComparePreview({ before, after, onClick }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 cursor-pointer" onClick={onClick}>
      <div>
        <p className="text-xs text-gray-500">Before</p>
        <img src={before} className="w-full rounded" />
      </div>
      <div>
        <p className="text-xs text-gray-500">After</p>
        {after ? (
          <img src={after} className="w-full rounded" />
        ) : (
          <div className="h-[100px] flex items-center justify-center text-xs text-gray-400">
            処理中...
          </div>
        )}
      </div>
    </div>
  );
}
