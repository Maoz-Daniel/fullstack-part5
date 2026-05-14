import { createPortal } from 'react-dom'

function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return createPortal(
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="confirm-dialog__backdrop" onClick={onCancel} />

      <div className="confirm-dialog__panel">
        <p className="confirm-dialog__eyebrow">Confirm action</p>
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p className="confirm-dialog__message">{message}</p>

        <div className="button-row confirm-dialog__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="button confirm-dialog__confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export { ConfirmDialog }
