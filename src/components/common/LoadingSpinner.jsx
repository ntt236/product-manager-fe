export default function LoadingSpinner({ text = 'Đang tải dữ liệu...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="w-6 h-6 border-2 border-neutral-700 border-t-neutral-200 rounded-full animate-spin" />
      <span className="text-xs text-neutral-400 font-mono tracking-wider">{text}</span>
    </div>
  );
}

