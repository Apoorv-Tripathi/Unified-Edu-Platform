import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Users, DollarSign, Plus, Download } from 'lucide-react';
import { getSchemes, getSchemeAnalytics } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const AdminSchemeDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, schemesRes] = await Promise.all([
        getSchemeAnalytics(),
        getSchemes()
      ]);
      
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (schemesRes.success) setSchemes(schemesRes.schemes);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading scheme analytics..." />;

  const categoryData = Object.entries(analytics?.byCategory || {}).map(([name, value]) => ({ name, value }));
  const typeData = Object.entries(analytics?.byType || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="animate-fade-in">
      <style>{`
        .stat-card { transition: all 0.3s ease; border-radius: 16px; }
        .stat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
        .icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); }
        .scheme-card { transition: all 0.2s ease; cursor: pointer; border-radius: 12px; }
        .scheme-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Government Scheme Management</h3>
          <p className="text-muted small mb-0">Track and manage scholarship schemes</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} className="me-2" />
          Add Scheme
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-2 opacity-90">Total Schemes</p>
                  <h2 className="fw-bold mb-2">{analytics?.totalSchemes || 0}</h2>
                  <small className="opacity-90">Active programs</small>
                </div>
                <div className="icon-wrapper">
                  <Award size={28} />
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
                  <p className="mb-2 opacity-90">Total Beneficiaries</p>
                  <h2 className="fw-bold mb-2">{analytics?.totalBeneficiaries || 0}</h2>
                  <small className="opacity-90">Students helped</small>
                </div>
                <div className="icon-wrapper">
                  <Users size={28} />
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
                  <p className="mb-2 opacity-90">Budget Allocated</p>
                  <h2 className="fw-bold mb-2">₹{(analytics?.totalBudget / 10000000 || 0).toFixed(1)}Cr</h2>
                  <small className="opacity-90">Current year</small>
                </div>
                <div className="icon-wrapper">
                  <DollarSign size={28} />
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
                  <p className="mb-2 opacity-90">Approval Rate</p>
                  <h2 className="fw-bold mb-2">{analytics?.approvalRate}%</h2>
                  <small className="opacity-90">Applications approved</small>
                </div>
                <div className="icon-wrapper">
                  <TrendingUp size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Schemes by Category</h5>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <h5 className="fw-bold mb-4">Schemes by Type</h5>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Schemes */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Top Performing Schemes</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Code</th>
                  <th>Beneficiaries</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topSchemes?.map((scheme, i) => (
                  <tr key={i}>
                    <td className="fw-semibold">{scheme.name}</td>
                    <td><span className="badge bg-primary">{scheme.code}</span></td>
                    <td>{scheme.beneficiaries}</td>
                    <td>₹{(scheme.amount || 0).toLocaleString()}</td>
                    <td><span className="badge bg-success">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Schemes */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">All Schemes</h5>
            <button className="btn btn-outline-primary btn-sm">
              <Download size={16} className="me-2" />
              Export
            </button>
          </div>
          <div className="row g-3">
            {schemes.map(scheme => (
              <div key={scheme._id} className="col-md-4">
                <div className="card border scheme-card">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">{scheme.name}</h6>
                      <span className={`badge bg-${scheme.isActive ? 'success' : 'secondary'}`}>
                        {scheme.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="small text-muted mb-2">{scheme.shortName || scheme.type}</p>
                    <div className="d-flex gap-2 mb-2">
                      <span className="badge bg-primary-subtle text-primary">{scheme.category}</span>
                      <span className="badge bg-success-subtle text-success">{scheme.type}</span>
                    </div>
                    <div className="d-flex justify-content-between text-sm">
                      <div>
                        <div className="text-muted small">Amount</div>
                        <div className="fw-semibold">₹{(scheme.amount?.max || scheme.amount?.min || 0).toLocaleString()}</div>
                      </div>
                      <div className="text-end">
                        <div className="text-muted small">Applications</div>
                        <div className="fw-semibold">{scheme.totalApplicants || 0}</div>
                      </div>
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

export default AdminSchemeDashboard;