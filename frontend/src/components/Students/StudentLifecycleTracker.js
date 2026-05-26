import React, { useState, useEffect } from 'react';
import {
  UserPlus, BookOpen, Briefcase, TrendingUp, Award, GraduationCap,
  CheckCircle, Clock, AlertCircle, Upload, FileText, Plus, Edit2, Eye, X, Save, AlertTriangle
} from 'lucide-react';
import LifecycleEditRequestModal from './LifecycleEditRequestModal';
import { getVerificationStatus } from '../../services/api';

const StudentLifecycleTracker = ({ studentId, studentData }) => {
  const [lifecycle, setLifecycle] = useState([]);
  const [currentStage, setCurrentStage] = useState('Enrollment');
  const [showAddStage, setShowAddStage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editStageData, setEditStageData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestEditModal, setShowRequestEditModal] = useState(false);
  const [requestEditStage, setRequestEditStage] = useState(null);

  const [formData, setFormData] = useState({
    stage: '',
    status: 'In Progress',
    notes: '',
    details: {}
  });

  const stageConfig = {
    'Schooling': {
      icon: GraduationCap,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      fields: ['School Name', 'Board', 'Percentage / GPA', 'Passing Year']
    },

    'Enrollment': {
      icon: UserPlus,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      fields: ['Enrollment Number', 'Enrollment Date', 'Course', 'Batch']
    },

    'Academic Progress': {
      icon: BookOpen,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      fields: ['Current Semester', 'CGPA', 'Attendance', 'Credits Completed']
    },

    'Internship': {
      icon: Briefcase,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      fields: ['Company Name', 'Duration', 'Role', 'Stipend']
    },

    'Placement': {
      icon: TrendingUp,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      fields: ['Company Name', 'Package', 'Role', 'Joining Date']
    },

    'Higher Studies': {
      icon: GraduationCap,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      fields: ['Institution Name', 'Course', 'Start Date', 'Location']
    },

    'Alumni': {
      icon: Award,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      fields: ['Graduation Date', 'Current Position', 'Organization', 'LinkedIn']
    }
  };

  useEffect(() => {
    if (studentId) loadLifecycle();
  }, [studentId]);
  const fetchPendingRequests = async () => {
    try {
      const result = await getVerificationStatus(studentId);
      if (result.success && Array.isArray(result.data)) {
        setPendingRequests(result.data.filter(r => r.status === 'pending'));
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadLifecycle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${studentId}/lifecycle`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setLifecycle(data.data.lifecycle || []);
        setCurrentStage(data.data.currentStage || 'Enrollment');
      }
    } catch (err) {
      console.error('Failed to load lifecycle', err);
      setError('Failed to load lifecycle data');
    }
    setLoading(false);
  };
  useEffect(() => {
    if (studentId) {
      fetchPendingRequests();
    }
  }, [studentId]);
  const handleAddStage = () => {
    setFormData({
      stage: '',
      status: 'In Progress',
      notes: '',
      details: {}
    });
    setShowAddStage(true);
  };

  const handleEditStage = (stage) => {
    setSelectedStage(stage);
    setFormData({
      stage: stage.stage,
      status: stage.status,
      notes: stage.notes || '',
      details: stage.details || {}
    });
    setShowEditModal(true);
  };
  const handleRequestEdit = (stage) => {
    setRequestEditStage(stage);
    setShowRequestEditModal(true);
  };

  const handleDetailChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  const handleSaveStage = async () => {
    if (!formData.stage) {
      setError('Please select a stage');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = showEditModal
        ? `${process.env.REACT_APP_API_URL}/students/${studentId}/lifecycle/${selectedStage._id}`
        : `${process.env.REACT_APP_API_URL}/students/${studentId}/lifecycle`;

      const response = await fetch(url, {
        method: showEditModal ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(showEditModal ? 'Stage updated successfully!' : 'Stage added successfully!');
        setShowAddStage(false);
        setShowEditModal(false);
        loadLifecycle();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save stage');
    }

    setSaving(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={20} className="text-success" />;
      case 'In Progress': return <Clock size={20} className="text-primary" />;
      case 'Pending': return <AlertCircle size={20} className="text-warning" />;
      default: return <Clock size={20} className="text-muted" />;
    }
  };

  const getStageIndex = (stageName) => {
    const stages = Object.keys(stageConfig);
    return stages.indexOf(stageName);
  };

  return (
    <div className="lifecycle-tracker">
      <style>{`
        .lifecycle-tracker { position: relative; }
        .timeline-container { position: relative; padding-left: 50px; }
        .timeline-line {
          position: absolute; left: 24px; top: 40px; bottom: 40px; width: 3px;
          background: linear-gradient(to bottom, #e2e8f0, #cbd5e1);
        }
        .timeline-item { position: relative; margin-bottom: 32px; animation: slideIn 0.3s ease; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .timeline-icon {
          position: absolute; left: -38px; width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 2;
        }
        .timeline-icon.completed { box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }
        .timeline-icon.active {
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6); }
        }
        .stage-card {
          background: white; border-radius: 16px; padding: 20px; border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .stage-card:hover {
          border-color: #667eea; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .stage-card.active {
          border-color: #667eea;
          background: linear-gradient(to right, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }
        .stage-card.completed { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
        .stage-progress {
          display: flex; justify-content: center; gap: 16px; margin-bottom: 32px;
          overflow-x: auto; padding: 20px 0;
        }
        .stage-step {
          display: flex; flex-direction: column; align-items: center; min-width: 120px;
          cursor: pointer; transition: all 0.2s ease;
        }
        .stage-step:hover { transform: translateY(-4px); }
        .stage-step-icon {
          width: 60px; height: 60px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; margin-bottom: 8px; color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); position: relative;
        }
        .stage-step.completed .stage-step-icon { box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); }
        .stage-step.active .stage-step-icon {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5); transform: scale(1.1);
        }
        .stage-step-label {
          font-size: 12px; font-weight: 600; text-align: center; color: #64748b;
        }
        .stage-step.active .stage-step-label { color: #3b82f6; }
        .stage-step.completed .stage-step-label { color: #10b981; }
        .check-badge {
          position: absolute; bottom: -4px; right: -4px; width: 24px; height: 24px;
          background: #10b981; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; border: 3px solid white;
        }
        .document-item {
          padding: 12px; background: #f8fafc; border-radius: 8px; display: flex;
          align-items: center; gap: 12px; margin-bottom: 8px; transition: all 0.2s ease;
        }
        .document-item:hover { background: #f1f5f9; transform: translateX(4px); }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1040;
          display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 90%; max-width: 600px;
          max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success mb-3 d-flex align-items-center">
          <CheckCircle size={20} className="me-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger mb-3 d-flex align-items-center">
          <AlertCircle size={20} className="me-2" />
          {error}
        </div>
      )}
      {pendingRequests.length > 0 && (
        <div className="alert alert-warning mb-4 d-flex align-items-center">
          <AlertTriangle size={20} className="me-2" />
          <strong>
            You have {pendingRequests.length} lifecycle change request(s) pending admin approval.
          </strong>
        </div>
      )}
      {/* Stage Progress Overview */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-4">Student Journey Progress</h5>
          <div className="stage-progress">
            {Object.entries(stageConfig).map(([stageName, config]) => {
              const Icon = config.icon;
              const stageData = lifecycle.find(s => s.stage === stageName);
              const isCompleted = stageData?.status === 'Completed';
              const isActive = currentStage === stageName;

              return (
                <div
                  key={stageName}
                  className={`stage-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedStage(stageName)}
                >
                  <div
                    className="stage-step-icon"
                    style={{ background: isCompleted || isActive ? config.gradient : '#94a3b8' }}
                  >
                    <Icon size={28} />
                    {isCompleted && (
                      <div className="check-badge">
                        <CheckCircle size={16} color="white" />
                      </div>
                    )}
                  </div>
                  <span className="stage-step-label">{stageName}</span>
                  {stageData && (
                    <span className="badge bg-light text-dark mt-1" style={{ fontSize: '10px' }}>
                      {new Date(stageData.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Lifecycle Timeline</h5>
            <button className="btn btn-primary btn-sm" onClick={handleAddStage}>
              <Plus size={16} className="me-2" />Add Stage
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading lifecycle data...</p>
            </div>
          ) : lifecycle.length === 0 ? (
            <div className="text-center py-5">
              <BookOpen size={48} className="text-muted mb-3" />
              <p className="text-muted">No lifecycle stages recorded yet</p>
              <button className="btn btn-primary mt-2" onClick={handleAddStage}>
                <Plus size={16} className="me-2" />Add First Stage
              </button>
            </div>
          ) : (
            <div className="timeline-container">
              <div className="timeline-line"></div>
              {lifecycle.map((stage) => {
                const config = stageConfig[stage.stage];
                const Icon = config?.icon || BookOpen;
                const isActive = stage.stage === currentStage;

                return (
                  <div key={stage._id} className="timeline-item">
                    <div
                      className={`timeline-icon ${stage.status === 'Completed' ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                      style={{ background: config?.gradient || '#94a3b8' }}
                    >
                      <Icon size={24} />
                    </div>

                    <div className={`stage-card ${isActive ? 'active' : ''} ${stage.status === 'Completed' ? 'completed' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">{stage.stage}</h6>
                          <small className="text-muted">
                            {new Date(stage.date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {getStatusIcon(stage.status)}
                          <span className={`badge ${stage.status === 'Completed' ? 'bg-success' :
                            stage.status === 'In Progress' ? 'bg-primary' : 'bg-warning'
                            }`}>
                            {stage.status}
                          </span>
                        </div>
                      </div>

                      {stage.details && Object.keys(stage.details).length > 0 && (
                        <div className="mb-3">
                          <div className="row g-2">
                            {Object.entries(stage.details).map(([key, value]) => (
                              <div key={key} className="col-md-6">
                                <div className="bg-light rounded p-2">
                                  <small className="text-muted d-block">{key}</small>
                                  <strong className="small">{value}</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {stage.notes && (
                        <div className="alert alert-info mb-3">
                          <small><strong>Notes:</strong> {stage.notes}</small>
                        </div>
                      )}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditStage(stage)}
                        >
                          <Edit2 size={14} className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleRequestEdit(stage)}
                        >
                          Request Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Stage Modal */}
      {(showAddStage || showEditModal) && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowAddStage(false);
            setShowEditModal(false);
          }
        }}>
          <div className="modal-content">
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  {showEditModal ? 'Edit Stage' : 'Add New Stage'}
                </h5>
                <button
                  className="btn btn-link text-dark p-0"
                  onClick={() => {
                    setShowAddStage(false);
                    setShowEditModal(false);
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Stage</label>
                <select
                  className="form-select"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  disabled={showEditModal}
                >
                  <option value="">Select Stage...</option>
                  {Object.keys(stageConfig).map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {formData.stage && stageConfig[formData.stage]?.fields && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Details</label>
                  {stageConfig[formData.stage].fields.map(field => (
                    <div key={field} className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={field}
                        value={formData.details[field] || ''}
                        onChange={(e) => handleDetailChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={handleSaveStage}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="me-2" />
                      {showEditModal ? 'Update Stage' : 'Add Stage'}
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowAddStage(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Request Edit Modal */}
      <LifecycleEditRequestModal
        show={showRequestEditModal}
        onClose={() => setShowRequestEditModal(false)}
        editData={requestEditStage}
        studentId={studentId}
        onSubmit={() => {
          fetchPendingRequests();
          setShowRequestEditModal(false);
        }}
      />
      {/* Summary Card */}
      <div className="card border-0 shadow-sm" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="card-body text-white">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h6 className="fw-bold mb-2">Current Stage: {currentStage}</h6>
              <p className="mb-0 opacity-90 small">
                {lifecycle.length} lifecycle stages recorded •
                {lifecycle.filter(s => s.status === 'Completed').length} completed •
                Profile {studentData?.profileCompleteness || 0}% complete
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Award size={48} className="opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLifecycleTracker;