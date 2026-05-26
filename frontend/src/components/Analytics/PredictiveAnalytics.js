import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const PredictiveAnalytics = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/analytics/predictive/dropout-risk/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setRiskData(data.data);
      }
    } catch (error) {
      console.error('Risk data load error:', error);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner text="Loading predictive analytics..." />;

  if (!riskData || !riskData.students || riskData.students.length === 0) {
    return (
      <div className="text-center py-5">
        <Users size={64} className="text-muted mb-3" />
        <h4>No Student Data</h4>
        <p className="text-muted">Add students to see predictive analytics.</p>
      </div>
    );
  }

  const { summary, students } = riskData;

  const riskDistribution = [
    { name: 'High Risk', value: summary.highRisk, color: '#ef4444' },
    { name: 'Medium Risk', value: summary.mediumRisk, color: '#f59e0b' },
    { name: 'Low Risk', value: summary.lowRisk, color: '#10b981' }
  ];

  const highRiskStudents = students.filter(s => s.riskLevel === 'High');
  const mediumRiskStudents = students.filter(s => s.riskLevel === 'Medium');
  const lowRiskStudents = students.filter(s => s.riskLevel === 'Low');

  return (
    <div>
      {/* Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body p-4 text-white">
          <h4 className="fw-bold mb-2">🎯 Predictive Analytics</h4>
          <p className="mb-0 opacity-90">AI-powered dropout risk assessment</p>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <AlertTriangle size={32} className="text-danger" />
                <div>
                  <div className="h2 fw-bold text-danger mb-0">{summary.highRisk}</div>
                  <small className="text-muted">High Risk Students</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <Target size={32} className="text-warning" />
                <div>
                  <div className="h2 fw-bold text-warning mb-0">{summary.mediumRisk}</div>
                  <small className="text-muted">Medium Risk</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <Users size={32} className="text-success" />
                <div>
                  <div className="h2 fw-bold text-success mb-0">{summary.lowRisk}</div>
                  <small className="text-muted">Low Risk</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm" style={{ borderLeft: '4px solid #667eea' }}>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <TrendingUp size={32} className="text-primary" />
                <div>
                  <div className="h2 fw-bold text-primary mb-0">{((summary.lowRisk / summary.total) * 100).toFixed(0)}%</div>
                  <small className="text-muted">Success Rate</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Risk Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                    {riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">High Risk Students</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {highRiskStudents.length === 0 ? (
                <p className="text-center text-muted">No high-risk students</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Course</th>
                        <th>CGPA</th>
                        <th>Attendance</th>
                        <th>Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highRiskStudents.map((student, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold">{student.name}</td>
                          <td>{student.course}</td>
                          <td>{student.cgpa}</td>
                          <td>{student.attendance}%</td>
                          <td><span className="badge bg-danger">{student.riskScore}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All Students Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold mb-0">All Students Risk Assessment</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th>APAAR ID</th>
                  <th>Course</th>
                  <th>CGPA</th>
                  <th>Attendance</th>
                  <th>Assignments</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Risk Factors</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold">{student.name}</td>
                    <td><small>{student.apaarId}</small></td>
                    <td>{student.course}</td>
                    <td>{student.cgpa}</td>
                    <td>{student.attendance}%</td>
                    <td>{student.assignments}%</td>
                    <td><strong>{student.riskScore}</strong></td>
                    <td>
                      <span className={`badge ${student.riskLevel === 'High' ? 'bg-danger' :
                          student.riskLevel === 'Medium' ? 'bg-warning' : 'bg-success'
                        }`}>
                        {student.riskLevel}
                      </span>
                    </td>
                    <td><small>{student.riskFactors.join(', ') || 'None'}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;