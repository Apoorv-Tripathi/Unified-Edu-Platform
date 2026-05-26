import React from 'react';
import {
  ArrowLeft, MapPin, Award, Users, Building2, BookOpen, TrendingUp,
  Edit2, Trash2, Calendar, Hash, Star, CheckCircle, Briefcase
} from 'lucide-react';

const InstitutionProfile = ({ institution, onBack, onEdit, onDelete, userRole }) => {
  if (!institution) return null;

  const getRatingColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };
  const getComplianceVariant = (score) => {
    const value = Number(score) || 0;

    if (value >= 85) return "success";   // green
    if (value >= 70) return "warning";   // orange
    return "danger";                     // red
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .profile-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .profile-logo {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          color: #10b981;
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
            <div className="profile-logo">
              {institution.shortName || institution.name?.substring(0, 3).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h3 className="fw-bold mb-1">{institution.name}</h3>
              <p className="mb-2 opacity-90">
                <MapPin size={16} className="me-2" />
                {institution.location}
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-white text-success badge-custom">
                  <Hash size={14} /> {institution.aisheCode}
                </span>
                <span className="badge bg-white text-success badge-custom">
                  <Award size={14} /> {institution.accreditation}
                </span>
                <span className="badge bg-white text-success badge-custom">
                  {institution.type}
                </span>
                <span className="badge bg-white text-success badge-custom">
                  <Star size={14} /> NIRF {institution.nirfScore}
                </span>
              </div>
            </div>
            {userRole === 'admin' && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => onEdit(institution)}
                >
                  <Edit2 size={18} className="me-2" />Edit
                </button>
                <button
                  className="btn btn-outline-light text-white"
                  onClick={() => onDelete('institution', institution._id, institution.name)}
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
          {/* Statistics Overview */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <TrendingUp size={20} className="me-2 text-success" />
                Institution Statistics
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Users size={32} className="text-primary mb-2" />
                      <h3 className="fw-bold mb-1">
                        {((institution.students || 0) / 1000).toFixed(1)}K
                      </h3>
                      <p className="text-muted mb-0 small">Students</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Users size={32} className="text-success mb-2" />
                      <h3 className="fw-bold mb-1">{institution.faculty || 0}</h3>
                      <p className="text-muted mb-0 small">Faculty</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Building2 size={32} className="text-warning mb-2" />
                      <h3 className="fw-bold mb-1">{institution.departments || 0}</h3>
                      <p className="text-muted mb-0 small">Departments</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <Briefcase size={32} className="text-info mb-2" />
                      <h3 className="fw-bold mb-1">{institution.placement || 0}%</h3>
                      <p className="text-muted mb-0 small">Placement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rankings & Scores */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Award size={20} className="me-2 text-warning" />
                Rankings & Accreditation
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="display-4 fw-bold text-success mb-2">
                      #{institution.ranking}
                    </div>
                    <p className="text-muted mb-0">National Ranking</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="display-4 fw-bold text-primary mb-2">
                      {institution.nirfScore}
                    </div>
                    <p className="text-muted mb-0">NIRF Score</p>
                    <div className="progress mt-2" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar bg-${getRatingColor(institution.nirfScore)}`}
                        style={{ width: `${institution.nirfScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="display-4 fw-bold text-warning mb-2">
                      {institution.compliance || 0}%
                    </div>
                    <p className="text-muted mb-0">Compliance</p>
                    <div className="progress mt-2" style={{ height: '8px' }}>
                      <div className={`progress-bar bg-${getComplianceVariant(institution.compliance)}`}
                        style={{ width: `${Number(institution.compliance) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row">
                <div className="col-12">
                  <h6 className="fw-bold mb-3">Accreditation Details</h6>
                  <span className="badge bg-success me-2 p-2">
                    <CheckCircle size={14} className="me-1" />
                    {institution.accreditation}
                  </span>
                  <span className="badge bg-primary p-2">
                    {institution.type} Institution
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty-Student Ratio */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Faculty-Student Ratio</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold mb-0">
                    1:{Math.round((institution.students || 0) / (institution.faculty || 1))}
                  </h4>
                  <small className="text-muted">Students per Faculty</small>
                </div>
                <div className="text-end">
                  <Users size={48} className="text-muted opacity-25" />
                </div>
              </div>
            </div>
          </div>
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
                <small className="text-muted d-block">AISHE Code</small>
                <strong>{institution.aisheCode}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Location</small>
                <strong>{institution.location}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Type</small>
                <strong>{institution.type}</strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Established</small>
                <strong>
                  <Calendar size={14} className="me-1" />
                  {institution.established}
                </strong>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Accreditation</small>
                <strong>{institution.accreditation}</strong>
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

          {/* Key Highlights */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Key Highlights</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">NIRF Ranking</span>
                    <span className="badge bg-primary">#{institution.ranking}</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Placement Rate</span>
                    <span className="badge bg-success">{institution.placement}%</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Compliance Score</span>
                    <span className="badge bg-warning text-dark">{institution.compliance}%</span>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Total Departments</span>
                    <span className="badge bg-info">{institution.departments}</span>
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

export default InstitutionProfile;