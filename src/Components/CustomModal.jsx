import React from 'react';
import '../styles/CustomModal.css';

const CustomModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomModal;