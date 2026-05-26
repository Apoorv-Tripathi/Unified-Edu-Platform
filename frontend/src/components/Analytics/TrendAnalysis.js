import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const TrendAnalysis = () => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1year');

  useEffect(() => {
    loadTrends();
  }, [period]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/trends/all?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setTrendData(data.data);
      }
    } catch (error) {
      console.error('Trend analysis load error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading trend analysis..." />;
  }

  if (!trendData) {
    return (
      <div className="text-center py-5">
        <Activity size={64} className="text-primary mb-3" />
        <h4>No Trend Data</h4>
        <p className="text-muted">Trend data will appear once historical records are available.</p>
      </div>
    );
  }

  const latestCGPA = trendData.trends.cgpa[trendData.trends.cgpa.length - 1]?.value || 0;
  const previousCGPA = trendData.trends.cgpa[trendData.trends.cgpa.length - 2]?.value || 0;
  const cgpaChange = (latestCGPA - previousCGPA).toFixed(2);

  const latestAttendance = trendData.trends.attendance[trendData.trends.attendance.length - 1]?.value || 0;
  const previousAttendance = trendData.trends.attendance[trendData.trends.attendance.length - 2]?.value || 0;
  const attendanceChange = (latestAttendance - previousAttendance).toFixed(1);

  const latestPlacement = trendData.trends.placement[0]?.value || 0;
  const latestNIRF = trendData.trends.nirfScore[0]?.value || 0;

  return (
    <div>
      <style>{`
        .trend-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .trend-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body p-4 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="fw-bold mb-2">📈 Year-over-Year Trends</h4>
              <p className="mb-0 opacity-90">Academic performance and institutional growth over time</p>
            </div>
            <div className="btn-group">
              <button
                className={`btn btn-sm ${period === '1year' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setPeriod('1year')}
              >
                1 Year
              </button>
              <button
                className={`btn btn-sm ${period === '2years' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setPeriod('2years')}
              >
                2 Years
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm trend-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TrendingUp size={20} className={cgpaChange >= 0 ? 'text-success' : 'text-danger'} />
                <h6 className="mb-0">Latest CGPA</h6>
              </div>
              <div className="h3 fw-bold text-success mb-1">{latestCGPA.toFixed(1)}</div>
              <div className="d-flex align-items-center gap-1">
                {cgpaChange >= 0 ? (
                  <ArrowUpCircle size={16} className="text-success" />
                ) : (
                  <ArrowDownCircle size={16} className="text-danger" />
                )}
                <small className={cgpaChange >= 0 ? 'text-success' : 'text-danger'}>
                  {cgpaChange >= 0 ? '+' : ''}{cgpaChange}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm trend-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Calendar size={20} className={attendanceChange >= 0 ? 'text-primary' : 'text-danger'} />
                <h6 className="mb-0">Latest Attendance</h6>
              </div>
              <div className="h3 fw-bold text-primary mb-1">{latestAttendance.toFixed(1)}%</div>
              <div className="d-flex align-items-center gap-1">
                {attendanceChange >= 0 ? (
                  <ArrowUpCircle size={16} className="text-success" />
                ) : (
                  <ArrowDownCircle size={16} className="text-danger" />
                )}
                <small className={attendanceChange >= 0 ? 'text-success' : 'text-danger'}>
                  {attendanceChange >= 0 ? '+' : ''}{attendanceChange}%
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm trend-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Activity size={20} className="text-warning" />
                <h6 className="mb-0">Placement Rate</h6>
              </div>
              <div className="h3 fw-bold text-warning mb-1">{latestPlacement.toFixed(1)}%</div>
              <small className="text-muted">Latest Period</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm trend-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-info" />
                <h6 className="mb-0">NIRF Score</h6>
              </div>
              <div className="h3 fw-bold text-info mb-1">{latestNIRF.toFixed(1)}</div>
              <small className="text-muted">Latest Period</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Academic Performance Trends</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData.trends.cgpa}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" style={{ fontSize: '12px' }} />
                  <YAxis domain={[0, 10]} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Average CGPA" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Attendance Trends</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData.trends.attendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" style={{ fontSize: '12px' }} />
                  <YAxis domain={[0, 100]} style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={3} dot={{ r: 5 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">📊 Key Insights</h5>
          <div className="row g-3">
            {trendData.insights.map((insight, idx) => (
              <div key={idx} className="col-md-4">
                <div className="d-flex align-items-start gap-2">
                  <TrendingUp size={20} className="text-success mt-1" />
                  <p className="mb-0">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;