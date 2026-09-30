import clsx from 'clsx';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  danger = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
        <p className="text-stone-600 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={clsx(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-stone-800 hover:bg-stone-900'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
