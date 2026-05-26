import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading...", size = 40 }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <RefreshCw size={size} className="text-primary spinner mb-3" />
      <p className="text-muted">{text}</p>
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;