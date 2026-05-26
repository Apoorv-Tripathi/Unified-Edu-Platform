import React, { useState, useEffect } from 'react';
import {
  User, Mail, BookOpen, Award, TrendingUp, CheckCircle, AlertCircle,
  Calendar, Hash, Shield, Activity, Target, Clock, GraduationCap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import StudentLifecycleTracker from '../Students/StudentLifecycleTracker';
import AadhaarVerification from '../Students/AadhaarVerification';


const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');

      const response = await fetch(`http://localhost:5001/api/students/my-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStudent(data.data);
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Load profile error:', err);
      setError('Failed to load your profile');
    }
    setLoading(false);
  };

  const getPerformanceColor = (value) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'danger';
  };

  const performanceData = [
    { semester: 'Sem 1', cgpa: 7.2 },
    { semester: 'Sem 2', cgpa: 7.5 },
    { semester: 'Sem 3', cgpa: 7.8 },
    { semester: 'Sem 4', cgpa: 8.2 },
    { semester: 'Sem 5', cgpa: student?.cgpa || 8.5 },
  ];

  const radarData = [
    { subject: 'Academics', value: (student?.cgpa || 8) * 10 },
    { subject: 'Attendance', value: student?.attendance || 85 },
    { subject: 'Assignments', value: student?.assignments || 88 },
    { subject: 'Projects', value: 90 },
    { subject: 'Extra-curricular', value: 75 },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading your profile..." />;
  }

  if (error || !student) {
    return (
      <div className="text-center py-5">
        <AlertCircle size={64} className="text-danger mx-auto mb-3" />
        <h4 className="text-danger mb-3">Profile Not Found</h4>
        <p className="text-muted mb-4">
          {error || 'Your student profile is not set up yet. Please contact your institution.'}
        </p>
      </div>
    );
  }

  return (
    <div className="student-dashboard animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .profile-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .profile-avatar {
          width: 100px; height: 100px; background: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; font-weight: bold; color: #667eea; border: 4px solid white;
        }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        .tab-btn {
          padding: 12px 24px; border: none; background: transparent;
          border-bottom: 3px solid transparent; font-weight: 600; color: #64748b;
          transition: all 0.2s ease; cursor: pointer;
        }
        .tab-btn:hover { color: #667eea; }
        .tab-btn.active { color: #667eea; border-bottom-color: #667eea; }
        .metric-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px; padding: 16px; transition: all 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Welcome Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="profile-header text-white p-4">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div className="profile-avatar">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h3 className="fw-bold mb-2">Welcome, {student.name}!</h3>
              <p className="mb-2 opacity-90 d-flex align-items-center">
                <Mail size={16} className="me-2" />{student.email}
              </p>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="badge bg-white text-primary px-3 py-2">
                  <Hash size={14} /> {student.apaarId}
                </span>
                <span className="badge bg-white text-primary px-3 py-2">
                  <BookOpen size={14} /> {student.course}
                </span>
                <span className="badge bg-white text-primary px-3 py-2">
                  <Calendar size={14} /> Semester {student.semester}
                </span>
                {student.aadhaarVerified ? (
                  <span className="badge bg-success text-white px-3 py-2">
                    <Shield size={14} /> Aadhaar Verified
                  </span>
                ) : (
                  <button
                    className="badge bg-warning text-dark px-3 py-2"
                    style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowAadhaarModal(true)}
                  >
                    <AlertCircle size={14} /> Verify Aadhaar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card card border-0 shadow-sm h-100 bg-primary text-white">
            <div className="card-body text-center">
              <h2 className="fw-bold mb-1">{student.cgpa?.toFixed(2)}</h2>
              <p className="mb-2 opacity-90">Current CGPA</p>
              <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                <div className="progress-bar bg-white" style={{ width: `${(student.cgpa || 0) * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card card border-0 shadow-sm h-100 bg-success text-white">
            <div className="card-body text-center">
              <h2 className="fw-bold mb-1">{student.attendance || 0}%</h2>
              <p className="mb-2 opacity-90">Attendance</p>
              <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                <div className="progress-bar bg-white" style={{ width: `${student.attendance || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card card border-0 shadow-sm h-100 bg-warning text-white">
            <div className="card-body text-center">
              <h2 className="fw-bold mb-1">{student.assignments || 0}%</h2>
              <p className="mb-2 opacity-90">Assignments</p>
              <div className="progress bg-white bg-opacity-25" style={{ height: '6px' }}>
                <div className="progress-bar bg-white" style={{ width: `${student.assignments || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card card border-0 shadow-sm h-100 bg-info text-white">
            <div className="card-body text-center">
              <h2 className="fw-bold mb-1">{student.semester}</h2>
              <p className="mb-2 opacity-90">Current Semester</p>
              <Calendar size={32} className="opacity-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="d-flex border-bottom overflow-auto">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <TrendingUp size={18} className="me-2" />Overview
            </button>
            <button className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`} onClick={() => setActiveTab('lifecycle')}>
              <Activity size={18} className="me-2" />My Journey
            </button>
            <button className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
              <Award size={18} className="me-2" />Achievements
            </button>
            <button className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`} onClick={() => setActiveTab('schemes')}>
              <CheckCircle size={18} className="me-2" />Schemes
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Performance Chart */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">Academic Progress</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cgpa" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">Performance Metrics</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Quick Metrics */}
            <div className="row g-3 mb-4">
              <div className="col-12">
                <div className="metric-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <Target size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="h6 fw-bold mb-0">Profile {student.profileCompleteness || 0}%</div>
                      <small className="text-muted">Complete</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="metric-card">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                      <Clock size={24} className="text-success" />
                    </div>
                    <div>
                      <div className="h6 fw-bold mb-0">{student.currentStage || 'Enrollment'}</div>
                      <small className="text-muted">Current Stage</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="fw-bold mb-0">Profile Details</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted d-block">Enrollment Number</small>
                  <strong>{student.enrollmentNumber || 'N/A'}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Batch</small>
                  <strong>{student.batch || 'N/A'}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Enrollment Date</small>
                  <strong>{new Date(student.enrollmentDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Status</small>
                  <span className="badge bg-success">
                    <CheckCircle size={12} className="me-1" />Active
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {(student.attendance < 75 || student.assignments < 60) && (
              <div className="alert alert-warning">
                <AlertCircle size={20} className="me-2" />
                <strong>Action Required!</strong>
                <p className="mb-0 small mt-2">
                  {student.attendance < 75 && 'Your attendance is below 75%. '}
                  {student.assignments < 60 && 'Complete pending assignments.'}
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
            <h5 className="fw-bold mb-0">My Achievements</h5>
          </div>
          <div className="card-body">
            {student.achievements?.length > 0 ? (
              student.achievements.map((a, i) => (
                <div key={i} className="d-flex align-items-center mb-3">
                  <CheckCircle size={20} className="text-success me-3" />
                  <span>{a}</span>
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-4">No achievements recorded yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'schemes' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="fw-bold mb-0">My Schemes & Benefits</h5>
          </div>
          <div className="card-body">
            {student.schemes?.length > 0 ? (
              student.schemes.map((s, i) => (
                <div key={i} className="mb-2">
                  <span className="badge bg-success w-100 text-start p-3">
                    <CheckCircle size={14} className="me-2" />{s}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-4">No schemes enrolled yet</p>
            )}
          </div>
        </div>
      )}

      {/* Aadhaar Modal */}
      {showAadhaarModal && (
        <>
          <div
            onClick={() => setShowAadhaarModal(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040
            }}
          ></div>
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 1050, width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }} className="bg-white rounded-3 shadow-lg p-4">
            <AadhaarVerification
              studentId={student._id}
              onVerificationComplete={() => {
                setShowAadhaarModal(false);
                loadStudentProfile();
              }}
              onClose={() => setShowAadhaarModal(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;