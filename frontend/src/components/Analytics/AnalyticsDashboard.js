import React, { useState, useEffect } from 'react';
import {
  TrendingUp, AlertTriangle, Award, BarChart3, Map, Activity,
  Users, GraduationCap, Target, CheckCircle, XCircle, Clock, Building2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import PredictiveAnalytics from './PredictiveAnalytics';
import ComplianceDashboard from './ComplianceDashboard';
import ComparativeAnalysis from './ComparativeAnalysis';
import TrendAnalysis from './TrendAnalysis';
import { fetchAnalyticsOverview } from '../../services/api';

const AnalyticsDashboard = ({ userRole = 'admin' }) => {
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'comparative', label: 'Comparative', icon: Target },
    { id: 'trends', label: 'Trends', icon: Activity },
  ];
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Force child components to reload
    window.location.reload();
  };

  return (
    <div className="analytics-dashboard animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .analytics-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .view-tab {
          padding: 14px 24px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .view-tab:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        
        .view-tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }
        
        .metric-card-analytics {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .metric-card-analytics:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #667eea;
        }
        
        .alert-card {
          border-left: 4px solid #ef4444;
          background: #fef2f2;
        }
        
        .alert-card.warning {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }
        
        .alert-card.success {
          border-left-color: #10b981;
          background: #f0fdf4;
        }
      `}</style>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="analytics-header text-white p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-2">📊 Advanced Analytics Dashboard</h3>
              <p className="mb-0 opacity-90">
                Comprehensive insights into institutional performance and student outcomes
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-light d-flex align-items-center gap-2"
                onClick={handleRefresh}
              >
                <Activity size={16} />
                Refresh Data
              </button>
              <span className="badge bg-white text-primary px-3 py-2">
                <Clock size={14} className="me-1" />
                Real-time Data
              </span>
              <span className="badge bg-white text-success px-3 py-2">
                <Activity size={14} className="me-1" />
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="d-flex border-bottom overflow-auto">
            {views.map(view => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  className={`view-tab ${activeView === view.id ? 'active' : ''}`}
                  onClick={() => setActiveView(view.id)}
                >
                  <Icon size={18} />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Content */}
      {activeView === 'overview' && <AnalyticsOverview />}
      {activeView === 'predictive' && <PredictiveAnalytics />}
      {activeView === 'compliance' && <ComplianceDashboard />}
      {activeView === 'comparative' && <ComparativeAnalysis />}
      {activeView === 'trends' && <TrendAnalysis />}
    </div>
  );
};

// Analytics Overview Component
const AnalyticsOverview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/analytics/overview?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOverviewData(data.data);
      }
    } catch (error) {
      console.error('Overview load error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading overview..." />;
  }

  if (!overviewData) {
    return (
      <div className="text-center py-5">
        <AlertTriangle size={64} className="text-warning mb-3" />
        <h4>No Data Available</h4>
        <p className="text-muted">Analytics data will appear once the system is populated.</p>
      </div>
    );
  }

  const overviewStats = [
    {
      label: 'At-Risk Students',
      value: overviewData.summary.highRiskStudents,
      change: overviewData.summary.highRiskStudents > 0 ? '-8%' : '0%',
      positive: overviewData.summary.highRiskStudents === 0,
      icon: AlertTriangle,
      color: 'danger'
    },
    {
      label: 'Total Students',
      value: overviewData.summary.totalStudents,
      change: '+12%',
      positive: true,
      icon: Users,
      color: 'success'
    },
    {
      label: 'Avg Performance',
      value: overviewData.summary.avgCGPA.toFixed(1),
      change: '+0.3',
      positive: true,
      icon: TrendingUp,
      color: 'primary'
    },
    {
      label: 'Total Institutions',
      value: overviewData.summary.totalInstitutions,
      change: '+2',
      positive: true,
      icon: Building2,
      color: 'info'
    }
  ];

  return (
    <div>
      {/* Quick Stats */}
      <div className="row g-4 mb-4">
        {overviewStats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorMap = {
            primary: '#667eea',
            success: '#10b981',
            danger: '#ef4444',
            info: '#06b6d4'
          };
          return (
            <div key={idx} className="col-md-3">
              <div className="metric-card-analytics h-100">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-3 rounded-circle"
                    style={{ background: `${colorMap[stat.color]}20` }}
                  >
                    <Icon size={24} style={{ color: colorMap[stat.color] }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small text-muted mb-1">{stat.label}</div>
                    <div className="d-flex align-items-baseline gap-2">
                      <h4 className="fw-bold mb-0">{stat.value}</h4>
                      <small className={`text-${stat.positive ? 'success' : 'danger'}`}>
                        {stat.change}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Risk Distribution Overview</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overviewData.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {overviewData.riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Key Insights</h5>
            </div>
            <div className="card-body">
              {overviewData.summary.highRiskStudents > 0 && (
                <div className="alert-card alert mb-3">
                  <div className="d-flex align-items-start gap-2">
                    <AlertTriangle size={20} className="text-danger mt-1" />
                    <div>
                      <strong className="d-block mb-1">
                        {overviewData.summary.highRiskStudents} High-Risk Students
                      </strong>
                      <small className="text-muted">Immediate intervention needed</small>
                    </div>
                  </div>
                </div>
              )}

              {overviewData.summary.mediumRiskStudents > 0 && (
                <div className="alert-card warning alert mb-3">
                  <div className="d-flex align-items-start gap-2">
                    <Clock size={20} className="text-warning mt-1" />
                    <div>
                      <strong className="d-block mb-1">
                        {overviewData.summary.mediumRiskStudents} Medium-Risk Students
                      </strong>
                      <small className="text-muted">Monitor closely</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="alert-card success alert mb-0">
                <div className="d-flex align-items-start gap-2">
                  <CheckCircle size={20} className="text-success mt-1" />
                  <div>
                    <strong className="d-block mb-1">
                      {overviewData.summary.lowRiskStudents} Students On Track
                    </strong>
                    <small className="text-muted">Performing well</small>
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

export default AnalyticsDashboard;