import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Building, AlertCircle, BookOpen, GraduationCap, Target } from 'lucide-react';

const InstitutionAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('Fetching institution analytics for userId:', userId);

      if (!userId || !token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/institutions/${userId}/analytics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <AlertCircle size={24} className="me-2" />
        <strong>Error:</strong> {error}
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={loadAnalytics}>
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="alert alert-warning" role="alert">
        <AlertCircle size={24} className="me-2" />
        No analytics data available
      </div>
    );
  }

  const { institution, stats, rankings, trends, departments } = analytics;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="card mb-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2">{institution.name}</h2>
              <p className="mb-3 opacity-90">
                {institution.location} • Established: {institution.established}
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-light text-dark px-3 py-2">
                  {institution.type}
                </span>
                <span className="badge bg-light text-dark px-3 py-2">
                  NAAC: {institution.naacGrade}
                </span>
                <span className="badge bg-light text-dark px-3 py-2">
                  NIRF Rank: #{institution.nirfRank}
                </span>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="bg-white bg-opacity-20 rounded p-3">
                <div className="small opacity-90">Overall Rating</div>
                <h1 className="display-3 fw-bold mb-0">{institution.rating}</h1>
                <small className="opacity-75">Out of 5.0</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#3b82f6', color: 'white' }}>
              <Users size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{stats.totalStudents}</h1>
              <p className="mb-0 fs-5">Total Students</p>
              <small className="opacity-75">Enrolled</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#10b981', color: 'white' }}>
              <GraduationCap size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{stats.totalFaculty}</h1>
              <p className="mb-0 fs-5">Faculty Members</p>
              <small className="opacity-75">Teaching staff</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#f59e0b', color: 'white' }}>
              <Target size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{stats.placementRate}%</h1>
              <p className="mb-0 fs-5">Placement Rate</p>
              <small className="opacity-75">Last year</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#8b5cf6', color: 'white' }}>
              <Award size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{stats.avgCGPA}</h1>
              <p className="mb-0 fs-5">Average CGPA</p>
              <small className="opacity-75">Institution-wide</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Ranking & Accreditation */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Award size={20} className="me-2" />
                Rankings & Accreditation
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="p-4 bg-primary bg-opacity-10 rounded">
                    <h2 className="text-primary mb-2">#{rankings.nirfRank}</h2>
                    <p className="mb-0 fw-semibold">NIRF Ranking</p>
                    <small className="text-muted">National</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-4 bg-success bg-opacity-10 rounded">
                    <h2 className="text-success mb-2">{rankings.naacScore}</h2>
                    <p className="mb-0 fw-semibold">NAAC Score</p>
                    <small className="text-muted">Grade: {rankings.naacGrade}</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-4 bg-warning bg-opacity-10 rounded">
                    <h2 className="text-warning mb-2">{rankings.complianceScore}%</h2>
                    <p className="mb-0 fw-semibold">Compliance</p>
                    <small className="text-muted">Score</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <TrendingUp size={20} className="me-2" />
                Performance Trends (Last 4 Years)
              </h5>
            </div>
            <div className="card-body">
              {trends && trends.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Students</th>
                        <th>Avg CGPA</th>
                        <th>Placement %</th>
                        <th>Research Papers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.map((trend, idx) => (
                        <tr key={idx}>
                          <td><strong>{trend.year}</strong></td>
                          <td>{trend.students}</td>
                          <td>
                            <span className="badge bg-primary">{trend.avgCGPA}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{trend.placementRate}%</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{trend.researchPapers}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">No trend data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Department-wise Stats */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Building size={20} className="me-2" />
                Department Overview
              </h5>
            </div>
            <div className="card-body">
              {departments && departments.length > 0 ? (
                <div>
                  {departments.map((dept, idx) => (
                    <div key={idx} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <p className="mb-1 fw-semibold">{dept.name}</p>
                          <small className="text-muted">{dept.students} students</small>
                        </div>
                        <span className="badge bg-primary">{dept.faculty} faculty</span>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        <small className="badge bg-success">Avg CGPA: {dept.avgCGPA}</small>
                        <small className="badge bg-info">Placement: {dept.placementRate}%</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No department data</p>
              )}
            </div>
          </div>

          {/* Key Achievements */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Award size={20} className="me-2" />
                Key Achievements
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="rounded-circle bg-success p-2 me-3">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{stats.researchPublications}</p>
                    <small className="text-muted">Research Publications</small>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="rounded-circle bg-primary p-2 me-3">
                    <Award size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{stats.patents}</p>
                    <small className="text-muted">Patents Filed</small>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="rounded-circle bg-warning p-2 me-3">
                    <Target size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{stats.collaborations}</p>
                    <small className="text-muted">Industry Collaborations</small>
                  </div>
                </div>
              </div>

              <div>
                <div className="d-flex align-items-center mb-2">
                  <div className="rounded-circle bg-info p-2 me-3">
                    <Users size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{stats.alumniNetwork}</p>
                    <small className="text-muted">Alumni Network</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Quality Indicators</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small>Student Satisfaction</small>
                  <strong>{stats.studentSatisfaction}%</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${stats.studentSatisfaction}%` }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small>Faculty-Student Ratio</small>
                  <strong>1:{stats.facultyStudentRatio}</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${Math.min((1 / stats.facultyStudentRatio) * 100 * 20, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-2">
                  <small>Infrastructure Score</small>
                  <strong>{stats.infrastructureScore}/10</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${stats.infrastructureScore * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="card mt-4 border-0 bg-light">
        <div className="card-body">
          <small className="text-muted">
            <strong>Debug Info:</strong> UserID: {localStorage.getItem('userId')} |
            Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAnalytics;