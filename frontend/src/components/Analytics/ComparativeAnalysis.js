import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Users, Target, Building2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const ComparativeAnalysis = () => {
  const [comparativeData, setComparativeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('nirfScore');

  useEffect(() => {
    loadComparativeData();
  }, []);

  const loadComparativeData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/analytics/comparative', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setComparativeData(data.data);
      }
    } catch (error) {
      console.error('Comparative analysis load error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading comparative analysis..." />;
  }

  if (!comparativeData) {
    return (
      <div className="text-center py-5">
        <Target size={64} className="text-primary mb-3" />
        <h4>No Comparative Data</h4>
        <p className="text-muted">Comparative analysis will appear once multiple institutions are available.</p>
      </div>
    );
  }

  const { institutions, benchmarks, topPerformers, categoryComparison, insights } = comparativeData;

  // Sort institutions
  const sortedInstitutions = [...institutions].sort((a, b) => {
    if (sortBy === 'nirfScore') return b.nirfScore - a.nirfScore;
    if (sortBy === 'avgCGPA') return parseFloat(b.avgCGPA) - parseFloat(a.avgCGPA);
    if (sortBy === 'placement') return b.placement - a.placement;
    if (sortBy === 'students') return b.students - a.students;
    return 0;
  });

  // Prepare data for charts
  const cgpaComparisonData = sortedInstitutions.slice(0, 8).map(inst => ({
    name: inst.shortName,
    cgpa: parseFloat(inst.avgCGPA),
    benchmark: parseFloat(benchmarks.avgCGPA)
  }));

  const nirfComparisonData = sortedInstitutions.slice(0, 8).map(inst => ({
    name: inst.shortName,
    score: inst.nirfScore,
    benchmark: parseFloat(benchmarks.avgNIRF)
  }));

  const placementComparisonData = sortedInstitutions.slice(0, 8).map(inst => ({
    name: inst.shortName,
    placement: inst.placement,
    benchmark: parseFloat(benchmarks.avgPlacement)
  }));

  const multiMetricData = sortedInstitutions.slice(0, 5).map(inst => ({
    name: inst.shortName,
    CGPA: parseFloat(inst.avgCGPA) * 10, // Scale to 100
    Attendance: parseFloat(inst.avgAttendance),
    Placement: inst.placement,
    NIRF: inst.nirfScore,
    Publications: parseFloat(inst.avgPublications) * 5 // Scale up
  }));

  const categoryData = [
    { name: 'Government', count: categoryComparison.government, color: '#10b981' },
    { name: 'Private', count: categoryComparison.private, color: '#667eea' },
    { name: 'Deemed', count: categoryComparison.deemed, color: '#f59e0b' },
    { name: 'Autonomous', count: categoryComparison.autonomous, color: '#8b5cf6' }
  ];

  return (
    <div>
      <style>{`
        .comparative-card {
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .comparative-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }
        .rank-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        .rank-1 { background: linear-gradient(135deg, #ffd700, #ffed4e); color: #000; }
        .rank-2 { background: linear-gradient(135deg, #c0c0c0, #e8e8e8); color: #000; }
        .rank-3 { background: linear-gradient(135deg, #cd7f32, #e6a85c); color: #fff; }
        .rank-other { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
        .metric-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
        .sort-btn {
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-btn:hover {
          border-color: #667eea;
          background: #f8fafc;
        }
        .sort-btn.active {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }
      `}</style>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body p-4 text-white">
          <h4 className="fw-bold mb-2">🎯 Comparative Analysis</h4>
          <p className="mb-0 opacity-90">Inter-institutional benchmarking coming soon...</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="row g-4 mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">📊 Key Insights</h5>
              <div className="row g-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="col-md-4">
                    <div className="d-flex align-items-start gap-2">
                      <TrendingUp size={20} className="text-primary mt-1" />
                      <p className="mb-0 small">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm comparative-card bg-warning bg-opacity-10">
            <div className="card-body p-4 text-center">
              <Award size={32} className="text-warning mb-2" />
              <h6 className="fw-bold mb-1">Highest NIRF</h6>
              <div className="h5 fw-bold text-warning mb-1">{topPerformers.highestNIRF.name}</div>
              <small className="text-muted">Score: {topPerformers.highestNIRF.nirfScore}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm comparative-card bg-success bg-opacity-10">
            <div className="card-body p-4 text-center">
              <Target size={32} className="text-success mb-2" />
              <h6 className="fw-bold mb-1">Best CGPA</h6>
              <div className="h5 fw-bold text-success mb-1">{topPerformers.highestCGPA.shortName}</div>
              <small className="text-muted">CGPA: {topPerformers.highestCGPA.avgCGPA}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm comparative-card bg-info bg-opacity-10">
            <div className="card-body p-4 text-center">
              <Users size={32} className="text-info mb-2" />
              <h6 className="fw-bold mb-1">Best Attendance</h6>
              <div className="h5 fw-bold text-info mb-1">{topPerformers.highestAttendance.shortName}</div>
              <small className="text-muted">Attendance: {topPerformers.highestAttendance.avgAttendance}%</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm comparative-card bg-primary bg-opacity-10">
            <div className="card-body p-4 text-center">
              <Building2 size={32} className="text-primary mb-2" />
              <h6 className="fw-bold mb-1">Best Placement</h6>
              <div className="h5 fw-bold text-primary mb-1">{topPerformers.highestPlacement.shortName}</div>
              <small className="text-muted">Placement: {topPerformers.highestPlacement.placement}%</small>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Metrics */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">📏 Network Benchmarks</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="h4 fw-bold text-primary mb-1">{benchmarks.avgCGPA}</div>
                <small className="text-muted">Average CGPA</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="h4 fw-bold text-success mb-1">{benchmarks.avgAttendance}%</div>
                <small className="text-muted">Average Attendance</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="h4 fw-bold text-warning mb-1">{benchmarks.avgNIRF}</div>
                <small className="text-muted">Average NIRF Score</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-light rounded text-center">
                <div className="h4 fw-bold text-info mb-1">{benchmarks.avgPlacement}%</div>
                <small className="text-muted">Average Placement</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">CGPA Comparison</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cgpaComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                  <YAxis domain={[0, 10]} style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="cgpa" fill="#10b981" name="Institution CGPA" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="benchmark" fill="#e5e7eb" name="Network Average" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">NIRF Score Comparison</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={nirfComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                  <YAxis domain={[0, 100]} style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="score" fill="#667eea" name="NIRF Score" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="benchmark" fill="#e5e7eb" name="Network Average" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Placement Rate Comparison</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={placementComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                  <YAxis domain={[0, 100]} style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="placement" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} name="Placement Rate" />
                  <Line type="monotone" dataKey="benchmark" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" name="Network Average" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Multi-Metric Radar (Top 5)</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={multiMetricData[0] ? [
                  { subject: 'CGPA', ...multiMetricData.reduce((acc, inst) => ({ ...acc, [inst.name]: inst.CGPA }), {}) },
                  { subject: 'Attendance', ...multiMetricData.reduce((acc, inst) => ({ ...acc, [inst.name]: inst.Attendance }), {}) },
                  { subject: 'Placement', ...multiMetricData.reduce((acc, inst) => ({ ...acc, [inst.name]: inst.Placement }), {}) },
                  { subject: 'NIRF', ...multiMetricData.reduce((acc, inst) => ({ ...acc, [inst.name]: inst.NIRF }), {}) },
                  { subject: 'Research', ...multiMetricData.reduce((acc, inst) => ({ ...acc, [inst.name]: inst.Publications }), {}) }
                ] : []}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" style={{ fontSize: '12px' }} />
                  <PolarRadiusAxis domain={[0, 100]} style={{ fontSize: '10px' }} />
                  {multiMetricData.map((inst, idx) => (
                    <Radar
                      key={idx}
                      name={inst.name}
                      dataKey={inst.name}
                      stroke={['#667eea', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'][idx]}
                      fill={['#667eea', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'][idx]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Institution Rankings Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <h5 className="fw-bold mb-0">Institution Rankings</h5>
            <div className="d-flex gap-2">
              <button
                className={`sort-btn ${sortBy === 'nirfScore' ? 'active' : ''}`}
                onClick={() => setSortBy('nirfScore')}
              >
                NIRF Score
              </button>
              <button
                className={`sort-btn ${sortBy === 'avgCGPA' ? 'active' : ''}`}
                onClick={() => setSortBy('avgCGPA')}
              >
                CGPA
              </button>
              <button
                className={`sort-btn ${sortBy === 'placement' ? 'active' : ''}`}
                onClick={() => setSortBy('placement')}
              >
                Placement
              </button>
              <button
                className={`sort-btn ${sortBy === 'students' ? 'active' : ''}`}
                onClick={() => setSortBy('students')}
              >
                Students
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>Institution</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Students</th>
                  <th>Faculty</th>
                  <th>Avg CGPA</th>
                  <th>Attendance</th>
                  <th>NIRF Score</th>
                  <th>Ranking</th>
                  <th>Placement</th>
                </tr>
              </thead>
              <tbody>
                {sortedInstitutions.map((inst, idx) => (
                  <tr key={inst.id}>
                    <td>
                      <div className={`rank-badge ${idx === 0 ? 'rank-1' :
                          idx === 1 ? 'rank-2' :
                            idx === 2 ? 'rank-3' :
                              'rank-other'
                        }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="fw-semibold">{inst.name}</td>
                    <td><span className="badge bg-secondary">{inst.type}</span></td>
                    <td>{inst.location}</td>
                    <td>{inst.students}</td>
                    <td>{inst.faculty}</td>
                    <td>
                      <strong className={parseFloat(inst.avgCGPA) >= parseFloat(benchmarks.avgCGPA) ? 'text-success' : 'text-muted'}>
                        {inst.avgCGPA}
                      </strong>
                      {parseFloat(inst.avgCGPA) >= parseFloat(benchmarks.avgCGPA) &&
                        <ArrowUpCircle size={14} className="ms-1 text-success" />
                      }
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress" style={{ width: '60px', height: '8px' }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${inst.avgAttendance}%` }}
                          ></div>
                        </div>
                        <small>{inst.avgAttendance}%</small>
                      </div>
                    </td>
                    <td>
                      <strong className="text-primary">{inst.nirfScore}</strong>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark">#{inst.ranking}</span>
                    </td>
                    <td>
                      <strong className={inst.placement >= parseFloat(benchmarks.avgPlacement) ? 'text-success' : 'text-muted'}>
                        {inst.placement}%
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="row g-4 mt-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold mb-0">Institution Type Distribution</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {categoryData.map((category, idx) => (
                  <div key={idx} className="col-md-3">
                    <div className="p-4 rounded text-center" style={{ background: `${category.color}15`, border: `2px solid ${category.color}` }}>
                      <div className="h2 fw-bold mb-1" style={{ color: category.color }}>{category.count}</div>
                      <div className="fw-semibold">{category.name}</div>
                      <small className="text-muted">Institutions</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;