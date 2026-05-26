import React from 'react';
import {
  ArrowLeft, Mail, Award, BookOpen, TrendingUp, Star,
  Edit2, Trash2, Hash, Briefcase, GraduationCap, CheckCircle
} from 'lucide-react';

const TeacherProfile = ({ teacher, onBack, onEdit, onDelete, userRole }) => {
  if (!teacher) return null;

  const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3) || 'NA';

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .profile-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          color: #f59e0b;
          border: 4px solid white;
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .badge-custom {
          padding: 8px 16px;
          font-size: 14px;
        }
      `}</style>

      {/* Back Button */}
      <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
        <ArrowLeft size={18} className="me-2" />Back to List
      </button>

      {/* Profile Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="profile-header text-white p-4">
          <div className="d-flex align-items-center gap-4">
            <div className="profile-avatar">
              {getInitials(teacher.name)}
            </div>
            <div className="flex-grow-1">
              <h3 className="fw-bold mb-1">{teacher.name}</h3>
              <p className="mb-2 opacity-90">
                <Mail size={16} className="me-2" />
                {teacher.email}
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-warning badge-custom">
                  <Hash size={14} /> {teacher.aparId}
                </span>
                <span className="badge bg-white text-warning badge-custom">
                  <Briefcase size={14} /> {teacher.designation}
                </span>
                <span className="badge bg-white text-warning badge-custom">
                  <GraduationCap size={14} /> {teacher.department}
                </span>
                <span className="badge bg-white text-warning badge-custom">
                  <Star size={14} /> {teacher.rating?.toFixed(1)} Rating
                </span>
              </div>
            </div>
            {userRole === 'admin' && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => onEdit(teacher)}
                >
                  <Edit2 size={18} className="me-2" />Edit
                </button>
                <button
                  className="btn btn-outline-light text-white"
                  onClick={() => onDelete('teacher', teacher._id, teacher.name)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Academic Achievements */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Award size={20} className="me-2 text-warning" />
                Academic Achievements
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <BookOpen size={32} className="text-primary mb-2" />
                      <h3 className="fw-bold mb-1">{teacher.publications || 0}</h3>
                      <p className="text-muted mb-0 small">Publications</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Briefcase size={32} className="text-success mb-2" />
                      <h3 className="fw-bold mb-1">{teacher.projects || 0}</h3>
                      <p className="text-muted mb-0 small">Projects</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <TrendingUp size={32} className="text-warning mb-2" />
                      <h3 className="fw-bold mb-1">{teacher.hIndex || 0}</h3>
                      <p className="text-muted mb-0 small">H-Index</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Star size={32} className="text-info mb-2" />
                      <h3 className="fw-bold mb-1">{teacher.rating?.toFixed(1)}</h3>
                      <p className="text-muted mb-0 small">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Performance */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <TrendingUp size={20} className="me-2 text-primary" />
                Experience & Performance
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <h6 className="text-muted mb-2">Teaching Experience</h6>
                      <h3 className="fw-bold text-primary mb-0">
                        {teacher.experience || 0} Years
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <h6 className="text-muted mb-2">Student Rating</h6>
                      <div className="d-flex align-items-center gap-2">
                        <h3 className="fw-bold text-warning mb-0">
                          {teacher.rating?.toFixed(1)}
                        </h3>
                        <div className="flex-grow-1">
                          <div className="progress" style={{ height: '10px' }}>
                            <div
                              className="progress-bar bg-warning"
                              style={{ width: `${(teacher.rating || 0) * 20}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-muted small">/ 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              {/* Research Metrics */}
              <h6 className="fw-bold mb-3">Research Metrics</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 p-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <BookOpen size={24} className="text-primary" />
                      </div>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0">{teacher.publications || 0}</h5>
                      <small className="text-muted">Publications</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="rounded-circle bg-success bg-opacity-10 p-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <TrendingUp size={24} className="text-success" />
                      </div>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0">{teacher.hIndex || 0}</h5>
                      <small className="text-muted">H-Index</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="rounded-circle bg-warning bg-opacity-10 p-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <Briefcase size={24} className="text-warning" />
                      </div>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0">{teacher.projects || 0}</h5>
                      <small className="text-muted">Active Projects</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          {teacher.specializations && teacher.specializations.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <GraduationCap size={20} className="me-2 text-success" />
                  Areas of Specialization
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  {teacher.specializations.map((spec, index) => (
                    <span key={index} className="badge bg-primary p-2">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Quick Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Quick Information</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted d-block">APAR ID</small>
                <strong>{teacher.aparId}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Email</small>
                <strong className="small">{teacher.email}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Department</small>
                <strong>{teacher.department}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Designation</small>
                <strong>{teacher.designation}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Experience</small>
                <strong>{teacher.experience} Years</strong>
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

          {/* Performance Summary */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Performance Summary</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Student Rating</span>
                    <span className="badge bg-warning text-dark">
                      ⭐ {teacher.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Publications</span>
                    <span className="badge bg-primary">{teacher.publications || 0}</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Active Projects</span>
                    <span className="badge bg-success">{teacher.projects || 0}</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">H-Index</span>
                    <span className="badge bg-info">{teacher.hIndex || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;