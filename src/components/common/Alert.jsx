import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const alertConfig = {
  success: {
    bg: 'bg-emerald-950/50 border-emerald-800 text-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  },
  error: {
    bg: 'bg-rose-950/50 border-rose-800 text-rose-200',
    icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
  },
  info: {
    bg: 'bg-blue-950/50 border-blue-800 text-blue-200',
    icon: <Info className="w-4 h-4 text-blue-400" />,
  },
};

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;
  const config = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-lg border text-xs leading-relaxed ${config.bg}`}
    >
      <div className="flex items-center gap-2.5">
        {config.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-0.5 rounded transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

