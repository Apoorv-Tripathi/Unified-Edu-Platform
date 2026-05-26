import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

const DeleteModal = ({ show, deleteTarget, onConfirm, onClose, loading }) => {
  if (!show) return null;

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
          max-width: 400px;
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
        <div className="modal-header p-3 border-bottom">
          <h5 className="mb-0 fw-bold text-danger">Confirm Delete</h5>
        </div>
        <div className="modal-body p-4 text-center">
          <Trash2 size={48} className="text-danger mb-3" />
          <p>
            Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
          </p>
          <p className="text-muted small">This action cannot be undone.</p>
        </div>
        <div className="modal-footer p-3 border-top d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="spinner" /> : <Trash2 size={16} />}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;