import React, { useState } from 'react';
import {
  ArrowLeft, Mail, BookOpen, Award, TrendingUp, CheckCircle,
  AlertCircle, Edit2, Trash2, Calendar, Hash, Shield, Activity
} from 'lucide-react';
import AadhaarVerification from './AadhaarVerification';
import StudentLifecycleTracker from './StudentLifecycleTracker';

const StudentProfile = ({ student, onBack, onEdit, onDelete, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);

  if (!student) return null;

  const getPerformanceColor = (value) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'danger';
  };

  const handleAadhaarVerificationComplete = () => {
    setShowAadhaarModal(false);
    window.location.reload();
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .profile-avatar {
          width: 120px; height: 120px; background: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; font-weight: bold; color: #667eea; border: 4px solid white;
        }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); }
        .tab-btn {
          padding: 12px 24px; border: none; background: transparent;
          border-bottom: 3px solid transparent; font-weight: 600; color: #64748b;
          transition: all 0.2s ease; cursor: pointer;
        }
        .tab-btn:hover { color: #667eea; }
        .tab-btn.active { color: #667eea; border-bottom-color: #667eea; }
        
        /* Enhanced Badge Styling */
        .profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .profile-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .badge-white {
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 2px solid;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .verification-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .verification-badge.verified {
          background: #10b981;
          border-color: #059669;
          color: white;
          cursor: default;
        }
        .verification-badge.not-verified {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
          color: #ef4444;
        }
        .verification-badge.not-verified:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>

      {/* Back Button */}
      <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
        <ArrowLeft size={18} className="me-2" />Back to List
      </button>

      {/* Profile Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="profile-header text-white p-4">
          <div className="d-flex align-items-start gap-4 flex-wrap">
            <div className="profile-avatar">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h3 className="fw-bold mb-2">{student.name}</h3>
              <p className="mb-3 opacity-90 d-flex align-items-center">
                <Mail size={16} className="me-2" />
                {student.email}
              </p>

              {/* Synchronized Badges */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="profile-badge badge-white">
                  <Hash size={14} /> {student.apaarId}
                </span>
                <span className="profile-badge badge-white">
                  <BookOpen size={14} /> {student.course}
                </span>
                <span className="profile-badge badge-white">
                  <Calendar size={14} /> Semester {student.semester}
                </span>

                {/* Aadhaar Verification Badge */}
                {student.aadhaarVerified ? (
                  <span className="verification-badge verified">
                    <Shield size={14} />
                    Aadhaar Verified
                  </span>
                ) : (
                  <button
                    className="verification-badge not-verified"
                    onClick={() => setShowAadhaarModal(true)}
                  >
                    <AlertCircle size={14} />
                    Verify Aadhaar
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {(userRole === 'admin' || userRole === 'institution') && (
              <div className="d-flex gap-2 flex-shrink-0">
                <button className="btn btn-light" onClick={() => onEdit(student)}>
                  <Edit2 size={18} className="me-2" />Edit
                </button>
                {userRole === 'admin' && (
                  <button
                    className="btn btn-outline-light text-white"
                    onClick={() => onDelete('student', student._id, student.name)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="p-3 bg-light border-top">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-semibold">Profile Completeness</small>
            <small className="fw-bold text-primary">{student.profileCompleteness || 0}%</small>
          </div>
          <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
            <div
              className="progress-bar bg-primary"
              style={{
                width: `${student.profileCompleteness || 0}%`,
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="d-flex border-bottom overflow-auto">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={18} className="me-2" />
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
              onClick={() => setActiveTab('lifecycle')}
            >
              <Activity size={18} className="me-2" />
              Lifecycle
            </button>
            <button
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Award size={18} className="me-2" />
              Achievements
            </button>
            <button
              className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
              onClick={() => setActiveTab('schemes')}
            >
              <CheckCircle size={18} className="me-2" />
              Schemes
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Academic Performance */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <TrendingUp size={20} className="me-2 text-primary" />
                  Academic Performance
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="stat-card card border-0 bg-light h-100">
                      <div className="card-body text-center">
                        <h2 className="fw-bold text-primary mb-1">
                          {student.cgpa?.toFixed(2)}
                        </h2>
                        <p className="text-muted mb-2">Current CGPA</p>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${(student.cgpa || 0) * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-card card border-0 bg-light h-100">
                      <div className="card-body text-center">
                        <h2 className="fw-bold text-success mb-1">
                          {student.attendance || 0}%
                        </h2>
                        <p className="text-muted mb-2">Attendance</p>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar bg-${getPerformanceColor(student.attendance)}`}
                            style={{ width: `${student.attendance || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-card card border-0 bg-light h-100">
                      <div className="card-body text-center">
                        <h2 className="fw-bold text-warning mb-1">
                          {student.assignments || 0}%
                        </h2>
                        <p className="text-muted mb-2">Assignment Completion</p>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar bg-${getPerformanceColor(student.assignments)}`}
                            style={{ width: `${student.assignments || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="stat-card card border-0 bg-light h-100">
                      <div className="card-body text-center">
                        <h2 className="fw-bold text-info mb-1">
                          {student.semester || 0}
                        </h2>
                        <p className="text-muted mb-2">Current Semester</p>
                        <Calendar size={32} className="text-info opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Quick Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">Quick Information</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted d-block">APAAR ID</small>
                  <strong>{student.apaarId}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Email</small>
                  <strong className="small">{student.email}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Course</small>
                  <strong>{student.course}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Semester</small>
                  <strong>{student.semester}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Enrollment Date</small>
                  <strong>{new Date(student.enrollmentDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Status</small>
                  <span className="badge bg-success">
                    <CheckCircle size={12} className="me-1" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Alert */}
            {(student.attendance < 75 || student.assignments < 60) && (
              <div className="alert alert-warning" role="alert">
                <AlertCircle size={20} className="me-2" />
                <strong>Attention Required!</strong>
                <p className="mb-0 small mt-2">
                  {student.attendance < 75 && 'Low attendance detected. '}
                  {student.assignments < 60 && 'Assignment completion needs improvement.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <StudentLifecycleTracker studentId={student._id} studentData={student} />
      )}

      {activeTab === 'achievements' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">
              <Award size={20} className="me-2 text-warning" />
              Achievements
            </h5>
          </div>
          <div className="card-body">
            {student.achievements && student.achievements.length > 0 ? (
              <div className="list-group list-group-flush">
                {student.achievements.map((achievement, index) => (
                  <div key={index} className="list-group-item border-0 d-flex align-items-center">
                    <CheckCircle size={20} className="text-success me-3" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No achievements recorded yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'schemes' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h6 className="mb-0 fw-bold">Enrolled Schemes & Benefits</h6>
          </div>
          <div className="card-body">
            {student.schemes && student.schemes.length > 0 ? (
              student.schemes.map((scheme, index) => (
                <div key={index} className="mb-2">
                  <span className="badge bg-success w-100 text-start p-2">
                    <CheckCircle size={14} className="me-2" />
                    {scheme}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-4">No schemes enrolled yet</p>
            )}
          </div>
        </div>
      )}

      {/* Aadhaar Verification Modal */}
      {showAadhaarModal && (
        <>
          <div
            className="modal-backdrop-custom"
            onClick={() => setShowAadhaarModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1040
            }}
          ></div>
          <div
            className="modal-custom bg-white rounded-3 shadow-lg"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1050,
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="p-4">
              <AadhaarVerification
                studentId={student._id}
                onVerificationComplete={handleAadhaarVerificationComplete}
                onClose={() => setShowAadhaarModal(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentProfile;