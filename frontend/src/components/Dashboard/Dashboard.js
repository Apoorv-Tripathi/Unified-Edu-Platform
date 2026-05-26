import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Users, Award, GraduationCap, Building, TrendingUp, BookOpen, Target, Clock, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';

const Dashboard = ({ stats, loading, userRole = 'student' }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
  
  const performanceData = [
    { semester: 'Sem 1', avgCGPA: 7.8, attendance: 85 },
    { semester: 'Sem 2', avgCGPA: 8.0, attendance: 87 },
    { semester: 'Sem 3', avgCGPA: 8.2, attendance: 88 },
    { semester: 'Sem 4', avgCGPA: 8.4, attendance: 90 },
    { semester: 'Sem 5', avgCGPA: 8.5, attendance: 89 },
    { semester: 'Sem 6', avgCGPA: 8.6, attendance: 91 },
  ];

  const monthlyData = [
    { month: 'Jan', students: 450, faculty: 45, institutions: 12 },
    { month: 'Feb', students: 480, faculty: 48, institutions: 13 },
    { month: 'Mar', students: 520, faculty: 52, institutions: 14 },
    { month: 'Apr', students: 550, faculty: 55, institutions: 15 },
    { month: 'May', students: 580, faculty: 58, institutions: 16 },
    { month: 'Jun', students: 620, faculty: 62, institutions: 17 },
  ];

  const radarData = [
    { subject: 'Academic', value: 85 },
    { subject: 'Research', value: 78 },
    { subject: 'Infrastructure', value: 92 },
    { subject: 'Placement', value: 88 },
    { subject: 'Faculty', value: 90 },
    { subject: 'Innovation', value: 75 },
  ];

  const institutionData = stats.institutions.topRanked?.map(i => ({
    name: i.shortName || i.name?.substring(0, 12),
    score: i.nirfScore
  })) || [];

  const departmentData = Object.entries(stats.teachers.byDepartment || {}).map(([name, value]) => ({
    name: name.substring(0, 15),
    value
  }));

  const placementData = [
    { category: 'Placed', value: 75 },
    { category: 'Higher Studies', value: 15 },
    { category: 'Entrepreneurship', value: 5 },
    { category: 'Others', value: 5 },
  ];

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="animate-fade-in">
      <style>{`
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bg-gradient-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .bg-gradient-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .bg-gradient-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
        .bg-gradient-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
        .bg-gradient-cyan { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card-enhanced {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .stat-card-enhanced::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-card-enhanced:hover::before {
          opacity: 1;
        }
        .stat-card-enhanced:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }
        .chart-card {
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          border-radius: 16px;
        }
        .chart-card:hover {
          border-color: var(--primary-light);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .metric-item {
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          transition: all 0.2s ease;
        }
        .metric-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="card border-0 shadow-sm mb-4 bg-gradient-primary text-white">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="fw-bold mb-2">Welcome back! 👋</h3>
              <p className="mb-0 opacity-90">Here's what's happening with your education platform today</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="d-inline-block">
                <div className="small opacity-90 mb-1">Current Academic Year</div>
                <div className="h4 fw-bold mb-0">2024-2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100 bg-gradient-primary text-white stat-card-enhanced">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-2 opacity-90 fw-medium">Total Students</p>
                  <h2 className="fw-bold mb-2 display-6">{stats.students.total || 0}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <TrendingUp size={16} />
                    <small className="opacity-90">+12% from last month</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <GraduationCap size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100 bg-gradient-success text-white stat-card-enhanced">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-2 opacity-90 fw-medium">Institutions</p>
                  <h2 className="fw-bold mb-2 display-6">{stats.institutions.total || 0}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Award size={16} />
                    <small className="opacity-90">Avg NIRF: {stats.institutions.avgNIRF || '0.00'}</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Building size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100 bg-gradient-warning text-white stat-card-enhanced">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-2 opacity-90 fw-medium">Faculty Members</p>
                  <h2 className="fw-bold mb-2 display-6">{stats.teachers.total || 0}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} />
                    <small className="opacity-90">★ {stats.teachers.avgRating || '0.00'} avg rating</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Users size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100 bg-gradient-purple text-white stat-card-enhanced">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-2 opacity-90 fw-medium">Publications</p>
                  <h2 className="fw-bold mb-2 display-6">
                    {Math.round((stats.teachers.avgPublications || 0) * (stats.teachers.total || 0))}
                  </h2>
                  <div className="d-flex align-items-center gap-2">
                    <BookOpen size={16} />
                    <small className="opacity-90">Research Papers</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Award size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="metric-item">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <CheckCircle size={24} className="text-primary" />
              </div>
              <div>
                <div className="h5 fw-bold mb-0">{stats.students.avgCGPA || '0.00'}</div>
                <small className="text-muted">Average CGPA</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="metric-item">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <Target size={24} className="text-success" />
              </div>
              <div>
                <div className="h5 fw-bold mb-0">89%</div>
                <small className="text-muted">Avg Attendance</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="metric-item">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <Clock size={24} className="text-warning" />
              </div>
              <div>
                <div className="h5 fw-bold mb-0">94%</div>
                <small className="text-muted">On-Time Submission</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="metric-item">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-purple bg-opacity-10 p-3 rounded-circle">
                <Award size={24} className="text-purple" />
              </div>
              <div>
                <div className="h5 fw-bold mb-0">75%</div>
                <small className="text-muted">Placement Rate</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100 chart-card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Performance Trends</h5>
                  <p className="text-muted small mb-0">CGPA and Attendance over semesters</p>
                </div>
                <span className="badge bg-primary-subtle text-primary px-3 py-2">Last 6 Semesters</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorCGPA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="semester" stroke="#6b7280" style={{fontSize: '12px'}} />
                  <YAxis stroke="#6b7280" style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                  <Legend />
                  <Area type="monotone" dataKey="avgCGPA" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCGPA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 chart-card">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Placement Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={placementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#6b7280' }}
                  >
                    {placementData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 chart-card">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Monthly Growth</h5>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{fontSize: '12px'}} />
                  <YAxis stroke="#6b7280" style={{fontSize: '12px'}} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="faculty" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="institutions" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 chart-card">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Performance Radar</h5>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" style={{fontSize: '12px'}} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} style={{fontSize: '12px'}} />
                  <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} strokeWidth={2} />
                  <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="row g-4">
        {departmentData.length > 0 && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm chart-card">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Faculty Distribution by Department</h5>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#6b7280' }}
                    >
                      {departmentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {institutionData.length > 0 && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm chart-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">Top Institutions by NIRF</h5>
                    <p className="text-muted small mb-0">Leading institutions in our network</p>
                  </div>
                  <Building size={24} className="text-primary" />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={institutionData}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={11} stroke="#6b7280" />
                    <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} />
                    <Tooltip contentStyle={{background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px'}} />
                    <Legend />
                    <Bar dataKey="score" fill="url(#colorBar)" name="NIRF Score" radius={[12, 12, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;