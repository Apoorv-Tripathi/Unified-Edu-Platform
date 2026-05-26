import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, User } from 'lucide-react';

const AdminLifecycleVerifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/students/lifecycle/pending-verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (verificationId, status) => {
    const comment = prompt(`Comment for ${status}:`);

    setProcessing(verificationId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/students/lifecycle/verify/${verificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminComment: comment || '' })
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Request ${status} successfully!`);
        fetchPendingRequests();
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to process request');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <style>{`
        .verification-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .verification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .change-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 12px;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <AlertTriangle size={28} className="text-warning me-2" />
          Lifecycle Verification Requests
        </h2>
        <span className="badge bg-danger fs-6">
          {requests.length} Pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <CheckCircle size={64} className="text-success mb-3" />
            <h5 className="text-muted">No pending verification requests</h5>
            <p className="text-muted">All lifecycle changes have been processed</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => (
            <div key={req._id} className="col-12">
              <div className="card border-0 shadow-sm verification-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1 d-flex align-items-center">
                        <User size={20} className="me-2 text-primary" />
                        {req.studentId?.name}
                      </h5>
                      <small className="text-muted d-flex align-items-center gap-2">
                        <span>{req.studentId?.email}</span>
                        <span className="badge bg-light text-dark">{req.apaarId}</span>
                        <span className="badge bg-light text-dark">{req.studentId?.course}</span>
                        {req.studentId?.semester && (
                          <span className="badge bg-light text-dark">Sem {req.studentId.semester}</span>
                        )}
                      </small>
                    </div>
                    <span className={`change-badge ${req.changeType === 'add' ? 'bg-success text-white' :
                        req.changeType === 'update' ? 'bg-primary text-white' :
                          'bg-danger text-white'
                      }`}>
                      {req.changeType.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-light rounded p-3 mb-3">
                    <h6 className="mb-2 fw-bold">
                      <Clock size={16} className="me-1" />
                      Stage Details:
                    </h6>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Stage</small>
                        <strong>{req.stageData.stage}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Status</small>
                        <span className="badge bg-info">{req.stageData.status}</span>
                      </div>
                      {req.stageData.notes && (
                        <div className="col-12">
                          <small className="text-muted d-block">Notes</small>
                          <p className="mb-0">{req.stageData.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {req.previousData && (
                    <div className="alert alert-warning mb-3">
                      <small className="fw-bold d-block mb-1">Previous Data:</small>
                      <small className="font-monospace">
                        Stage: {req.previousData.stage}, Status: {req.previousData.status}
                      </small>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <Clock size={14} className="me-1" />
                      Requested: {new Date(req.createdAt).toLocaleString()}
                    </small>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleVerification(req._id, 'approved')}
                        className="btn btn-success btn-sm"
                        disabled={processing === req._id}
                      >
                        <CheckCircle size={16} className="me-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerification(req._id, 'rejected')}
                        className="btn btn-danger btn-sm"
                        disabled={processing === req._id}
                      >
                        <XCircle size={16} className="me-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLifecycleVerifications;