import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaExclamationTriangle,
  FaSignOutAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import "../style/ConfirmDialog.css";

const icons = {
  danger: <FaTrash />,
  warning: <FaExclamationTriangle />,
  logout: <FaSignOutAlt />,
};

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  busyLabel = "Working…",
  variant = "danger",
  onConfirm,
  onClose,
  children,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    const focusTimer = window.setTimeout(() => confirmRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.clearTimeout(focusTimer);
    };
  }, [busy, onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      className="confirm-dialog-backdrop"
      onMouseDown={() => !busy && onClose()}
    >
      <section
        className={`confirm-dialog ${variant}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="confirm-dialog-close"
          onClick={onClose}
          disabled={busy}
          aria-label="Close confirmation"
        >
          <FaTimes />
        </button>
        <span className="confirm-dialog-icon">{icons[variant] || icons.warning}</span>
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        {children}
        <div className="confirm-dialog-actions">
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <><span className="spinner-border spinner-border-sm" /> {busyLabel}</>
            ) : (
              <>{icons[variant] || icons.warning} {confirmLabel}</>
            )}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
