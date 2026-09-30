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
      <div className="relative bg-surface rounded-xl shadow-xl border border-line w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
        <p className="text-muted text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-ink bg-raised hover:bg-raised rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-accent text-canvas hover:bg-accent-hover'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
