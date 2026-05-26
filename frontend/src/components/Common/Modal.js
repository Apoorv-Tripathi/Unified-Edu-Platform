import React from 'react';
import { X, Save, RefreshCw } from 'lucide-react';

const Modal = ({ show, onClose, title, children, onSave, saving, size = 'md' }) => {
  if (!show) return null;

  const sizeClass = {
    sm: 'max-width: 400px',
    md: 'max-width: 600px',
    lg: 'max-width: 800px',
    xl: 'max-width: 1000px'
  }[size];

  return (
    <>
      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1040;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-custom {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1050;
          width: 90%;
          ${sizeClass};
          max-height: 90vh;
          overflow-y: auto;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translate(-50%, -60%); opacity: 0; }
          to { transform: translate(-50%, -50%); opacity: 1; }
        }
      `}</style>
      <div className="modal-backdrop-custom" onClick={onClose}></div>
      <div className="modal-custom bg-white rounded-3 shadow-lg">
        <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{title}</h5>
          <button className="btn btn-link text-muted p-0" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body p-3">{children}</div>
        {onSave && (
          <div className="modal-footer p-3 border-top d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onSave} disabled={saving}>
              {saving ? <RefreshCw size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;