import React from 'react';
import '../styles/CustomModal.css';

// Supports three modes:
// 1️⃣ Informational: onClose only → single OK button
// 2️⃣ Confirmation: onConfirm and onCancel (or onClose) → Confirm + Cancel buttons
const CustomModal = ({
  isOpen,
  message,
  onClose,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>

        {onConfirm ? (
          <div className="modal-actions">
            <button className="btn-primary" onClick={onConfirm}>
              {confirmText}
            </button>
                 <button className="btn-secondary" onClick={handleCancel}>
              {cancelText}
            </button>
          </div>
        ) : (
          <div className="modal-actions">
            <button className="btn-primary" onClick={onClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
