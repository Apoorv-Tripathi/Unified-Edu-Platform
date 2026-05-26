import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Users, BookOpen, AlertCircle, Target, Clock } from 'lucide-react';

const FacultyAnalytics = () => {
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

      console.log('Fetching faculty analytics for userId:', userId);

      if (!userId || !token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teachers/${userId}/analytics`, {
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

  const { faculty, studentStats, performanceMetrics, recentActivity } = analytics;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="card mb-4" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white'
      }}>
        <div className="card-body p-4">
          <h2 className="mb-2">{faculty.name}</h2>
          <p className="mb-3 opacity-90">
            {faculty.department} • {faculty.designation} • {faculty.employeeId}
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-light text-dark px-3 py-2">
              Experience: {faculty.experience} years
            </span>
            <span className="badge bg-light text-dark px-3 py-2">
              Qualification: {faculty.qualification}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#3b82f6', color: 'white' }}>
              <Users size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{studentStats.totalStudents}</h1>
              <p className="mb-0 fs-5">Total Students</p>
              <small className="opacity-75">Under your guidance</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#10b981', color: 'white' }}>
              <Award size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{studentStats.avgPerformance}%</h1>
              <p className="mb-0 fs-5">Avg Performance</p>
              <small className="opacity-75">Student success rate</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#f59e0b', color: 'white' }}>
              <BookOpen size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{performanceMetrics.coursesHandled}</h1>
              <p className="mb-0 fs-5">Courses Handled</p>
              <small className="opacity-75">Active courses</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4" style={{ background: '#8b5cf6', color: 'white' }}>
              <Target size={40} className="mb-3" />
              <h1 className="display-4 fw-bold mb-2">{performanceMetrics.completionRate}%</h1>
              <p className="mb-0 fs-5">Completion Rate</p>
              <small className="opacity-75">Course completion</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Student Distribution */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Users size={20} className="me-2" />
                Student Distribution by Performance
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="p-3 bg-success bg-opacity-10 rounded">
                    <h3 className="text-success mb-1">{studentStats.excellent}</h3>
                    <small className="text-muted">Excellent (&gt;80%)</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    <h3 className="text-warning mb-1">{studentStats.average}</h3>
                    <small className="text-muted">Average (60-80%)</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-danger bg-opacity-10 rounded">
                    <h3 className="text-danger mb-1">{studentStats.needsAttention}</h3>
                    <small className="text-muted">Needs Attention (&lt;60%)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <TrendingUp size={20} className="me-2" />
                Teaching Effectiveness Metrics
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Student Satisfaction</span>
                  <strong>{performanceMetrics.studentSatisfaction}%</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${performanceMetrics.studentSatisfaction}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Assignment Completion Rate</span>
                  <strong>{performanceMetrics.assignmentCompletion}%</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${performanceMetrics.assignmentCompletion}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Class Attendance Rate</span>
                  <strong>{performanceMetrics.attendanceRate}%</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${performanceMetrics.attendanceRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Research Publications</span>
                  <strong>{performanceMetrics.publications}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: `${Math.min(performanceMetrics.publications * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Recent Activity */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Clock size={20} className="me-2" />
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="timeline">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex align-items-start">
                        <div
                          className="rounded-circle p-2 me-3"
                          style={{ background: '#e0e7ff' }}
                        >
                          <BookOpen size={16} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small fw-semibold">{activity.action}</p>
                          <small className="text-muted">{activity.course}</small>
                          <div className="text-muted small mt-1">{activity.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No recent activity</p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">
                <Award size={20} className="me-2" />
                Achievements
              </h5>
            </div>
            <div className="card-body">
              {faculty.achievements && faculty.achievements.length > 0 ? (
                <div>
                  {faculty.achievements.map((achievement, idx) => (
                    <div key={idx} className="alert alert-success mb-2 py-2 small">
                      <strong>🏆</strong> {achievement}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No achievements recorded yet</p>
              )}
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

export default FacultyAnalytics;