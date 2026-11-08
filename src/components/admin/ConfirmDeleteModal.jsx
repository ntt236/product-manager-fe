export default function ConfirmDeleteModal({
  isOpen,
  title = 'Xác nhận xóa',
  message,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-2xl text-center">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3 pt-3">
          <button onClick={onClose} className="btn-secondary !py-2 text-xs">
            Hủy bỏ
          </button>
          <button onClick={onConfirm} className="btn-danger !py-2 text-xs">
            Đồng ý Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

