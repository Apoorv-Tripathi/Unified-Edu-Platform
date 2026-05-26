import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Users, BookOpen, AlertCircle } from 'lucide-react';

const StudentPersonalAnalytics = () => {
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
      const stored = JSON.parse(localStorage.getItem("eduUser"));

      if (!stored || !stored.userId || !stored.token) {
        throw new Error("Not authenticated");
      }

      const studentId = stored.userId;

      console.log("Fetching analytics for studentId:", studentId);

      const response = await fetch(`http://localhost:5001/api/students/${studentId}/analytics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stored.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Analytics response:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to load analytics");
      }

      setAnalytics(data.data);

    } catch (err) {
      console.error("Analytics error:", err);
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

  const { student, performanceTrend, risk, recommendations } = analytics;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="card mb-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="card-body p-4">
          <h2 className="mb-2">{student.name}</h2>
          <p className="mb-3 opacity-90">
            {student.course} • Semester {student.semester} • {student.apaarId}
          </p>
          <div className="d-flex gap-2">
            <span className="badge bg-light text-dark px-3 py-2">
              Risk: {risk.level}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#3b82f6', color: 'white' }}>
              <Award size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{student.cgpa.toFixed(2)}</h1>
              <p className="mb-0 fs-5">CGPA</p>
              <small className="opacity-75">Out of 10.0</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#10b981', color: 'white' }}>
              <Users size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{student.attendance}%</h1>
              <p className="mb-0 fs-5">Attendance</p>
              <small className="opacity-75">
                {student.attendance >= 75 ? '✓ Good Standing' : '⚠ Below Requirement'}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#f59e0b', color: 'white' }}>
              <BookOpen size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{student.assignments}%</h1>
              <p className="mb-0 fs-5">Assignments</p>
              <small className="opacity-75">Completion Rate</small>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend & Risk */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <TrendingUp size={20} className="me-2" />
                Performance Trend
              </h5>
            </div>
            <div className="card-body">
              {performanceTrend && performanceTrend.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Semester</th>
                        <th>CGPA</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceTrend.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.semester}</td>
                          <td>
                            <span className="badge bg-primary">{item.cgpa}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{item.attendance}%</span>
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
          {/* Risk Assessment */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Risk Assessment</h5>
            </div>
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '100px',
                  height: '100px',
                  background: risk.level === 'High' ? '#fee2e2' : risk.level === 'Medium' ? '#fef3c7' : '#d1fae5',
                  color: risk.level === 'High' ? '#dc2626' : risk.level === 'Medium' ? '#f59e0b' : '#059669',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}
              >
                {risk.score}
              </div>
              <h5 className="fw-bold">{risk.level} Risk</h5>
              <p className="text-muted small">Score: {risk.score}/100</p>
              {risk.factors && risk.factors.length > 0 && (
                <div className="text-start mt-3">
                  <strong className="small">Risk Factors:</strong>
                  <ul className="small mt-2">
                    {risk.factors.map((factor, idx) => (
                      <li key={idx} className="text-muted">{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">Recommendations</h5>
              </div>
              <div className="card-body">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="alert alert-info mb-2 small">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default StudentPersonalAnalytics;