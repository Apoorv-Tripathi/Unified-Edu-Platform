import React, { useState } from 'react';

const LifecycleEditRequestModal = ({ show, onClose, editData, studentId, onSubmit }) => {
  const [formData, setFormData] = useState(editData || {
    stage: '',
    status: 'In Progress',
    notes: '',
    details: {}
  });
  const [loading, setLoading] = useState(false);

  const stages = [
    'Schooling', 'Enrollment', 'Academic Progress',
    'Internship', 'Placement', 'Higher Studies', 'Alumni'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/students/${studentId}/lifecycle/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          changeType: editData ? 'update' : 'add',
          stageData: formData,
          previousData: editData || null
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Request submitted! Waiting for admin approval.');
        onSubmit();
        onClose();
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop show"
        onClick={onClose}
        style={{ zIndex: 1050 }}
      ></div>
      <div
        className="modal show d-block"
        style={{ zIndex: 1051 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editData ? 'Request Edit' : 'Add'} Lifecycle Stage
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Stage *</label>
                  <select
                    className="form-select"
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    required
                    disabled={!!editData}
                  >
                    <option value="">Select Stage</option>
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional details..."
                  />
                </div>

                <div className="alert alert-warning">
                  <small>
                    ⚠️ This change requires admin approval before becoming visible in your profile.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LifecycleEditRequestModal;