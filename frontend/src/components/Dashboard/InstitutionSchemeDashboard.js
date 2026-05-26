import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Users, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, FileText, Search, Filter } from 'lucide-react';
import { getInstitutionSchemeStats, getSchemes } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Legend } from 'recharts';

const InstitutionSchemeDashboard = ({ institutionId }) => {
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  useEffect(() => {
    fetchData();
  }, [institutionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, schemesRes] = await Promise.all([
        getInstitutionSchemeStats(institutionId),
        getSchemes({ isActive: true })
      ]);
      
      if (statsRes.success) setStats(statsRes.stats);
      if (schemesRes.success) setSchemes(schemesRes.schemes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading scheme data..." />;

  const statusData = Object.entries(stats?.byStatus || {}).map(([name, value]) => ({ name, value }));
  const schemeData = Object.entries(stats?.byScheme || {}).map(([name, data]) => ({
    name: name.length > 20 ? name.substring(0, 20) + '...' : name,
    count: data.count,
    approved: data.approved,
  }));

  return (
    <div className="animate-fade-in">
      <style>{`
        .stat-card { transition: all 0.3s ease; border-radius: 16px; }
        .stat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
        .icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); }
        .application-card { transition: all 0.2s ease; border-radius: 12px; }
        .application-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Scheme Tracking Dashboard</h3>
          <p className="text-muted small mb-0">Monitor student scheme enrollments and benefits</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <Filter size={18} className="me-2" />
            Filter
          </button>
          <button className="btn btn-primary">
            <FileText size={18} className="me-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-2 opacity-90">Total Students</p>
                  <h2 className="fw-bold mb-2">{stats?.totalStudents || 0}</h2>
                  <small className="opacity-90">{stats?.studentsEnrolled || 0} enrolled</small>
                </div>
                <div className="icon-wrapper">
                  <Users size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-2 opacity-90">Approved</p>
                  <h2 className="fw-bold mb-2">{stats?.approved || 0}</h2>
                  <small className="opacity-90">Applications</small>
                </div>
                <div className="icon-wrapper">
                  <CheckCircle size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-2 opacity-90">Pending</p>
                  <h2 className="fw-bold mb-2">{stats?.pending || 0}</h2>
                  <small className="opacity-90">Awaiting approval</small>
                </div>
                <div className="icon-wrapper">
                  <Clock size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-2 opacity-90">Total Benefit</p>
                  <h2 className="fw-bold mb-2">₹{(stats?.totalBenefit / 100000 || 0).toFixed(1)}L</h2>
                  <small className="opacity-90">Disbursed amount</small>
                </div>
                <div className="icon-wrapper">
                  <DollarSign size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Enrollment Rate</h6>
                <Award className="text-primary" size={24} />
              </div>
              <div className="display-6 fw-bold text-primary mb-2">{stats?.enrollmentRate}%</div>
              <div className="progress" style={{height: '8px'}}>
                <div className="progress-bar bg-primary" style={{width: `${stats?.enrollmentRate}%`}}></div>
              </div>
              <small className="text-muted mt-2 d-block">{stats?.studentsEnrolled} of {stats?.totalStudents} students</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Success Rate</h6>
                <TrendingUp className="text-success" size={24} />
              </div>
              <div className="display-6 fw-bold text-success mb-2">
                {stats?.totalApplications > 0 ? ((stats?.approved / stats?.totalApplications) * 100).toFixed(1) : 0}%
              </div>
              <div className="progress" style={{height: '8px'}}>
                <div className="progress-bar bg-success" style={{width: `${stats?.totalApplications > 0 ? (stats?.approved / stats?.totalApplications) * 100 : 0}%`}}></div>
              </div>
              <small className="text-muted mt-2 d-block">{stats?.approved} approved applications</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">Pending Actions</h6>
                <Clock className="text-warning" size={24} />
              </div>
              <div className="display-6 fw-bold text-warning mb-2">{stats?.pending || 0}</div>
              <div className="progress" style={{height: '8px'}}>
                <div className="progress-bar bg-warning" style={{width: `${stats?.totalApplications > 0 ? (stats?.pending / stats?.totalApplications) * 100 : 0}%`}}></div>
              </div>
              <small className="text-muted mt-2 d-block">Requires attention</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Application Status Distribution</h5>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Scheme-wise Performance</h5>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={schemeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Total" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Recent Applications</h5>
            <div className="input-group" style={{width: '300px'}}>
              <span className="input-group-text bg-white">
                <Search size={18} className="text-muted" />
              </span>
              <input type="text" className="form-control" placeholder="Search applications..." />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>APAAR ID</th>
                  <th>Scheme</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentApplications?.map((app, i) => (
                  <tr key={i}>
                    <td className="fw-semibold">{app.studentName}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{app.apaarId}</span></td>
                    <td className="small">{app.scheme}</td>
                    <td className="small">{new Date(app.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${
                        app.status === 'Approved' ? 'success' : 
                        app.status === 'Rejected' ? 'danger' : 
                        'warning'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Available Schemes */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Available Schemes</h5>
          <div className="row g-3">
            {schemes.slice(0, 6).map(scheme => (
              <div key={scheme._id} className="col-md-4">
                <div className="card border application-card">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0 small">{scheme.name}</h6>
                      <span className="badge bg-success-subtle text-success">Active</span>
                    </div>
                    <p className="small text-muted mb-2">{scheme.code}</p>
                    <div className="d-flex gap-2 mb-3">
                      <span className="badge bg-primary-subtle text-primary small">{scheme.category}</span>
                      <span className="badge bg-info-subtle text-info small">{scheme.type}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Amount</div>
                        <div className="fw-bold">₹{(scheme.benefits?.amount || 0).toLocaleString()}</div>
                      </div>
                      <button className="btn btn-sm btn-primary">Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionSchemeDashboard;