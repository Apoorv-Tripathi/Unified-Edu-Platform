import React from 'react';
import { Users, GraduationCap, Award, TrendingUp, BookOpen, Target, Building } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';


const InstitutionDashboard = ({
  currentUser,
  stats,
  loading,
  students = [],
  teachers = [],
  onViewStudent,
  onViewTeacher
}) => {
  // Calculate institution-specific metrics
  const totalStudents = students.length;
  const totalFaculty = teachers.length;
  const avgCGPA = students.length > 0
    ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2)
    : '0.00';
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length)
    : 0;

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card {
          transition: all 0.3s ease;
          border-radius: 16px;
        }
        .stat-card:hover {
          transform: translateY(-8px);
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
        }
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bg-gradient-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .bg-gradient-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .bg-gradient-info { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); }
        .student-card {
          transition: all 0.2s ease;
          cursor: pointer;
          border-radius: 12px;
        }
        .student-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="card border-0 shadow-sm mb-4 bg-gradient-primary text-white">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Building size={32} />
                <h3 className="fw-bold mb-0">Institution Dashboard</h3>
              </div>
              <p className="mb-0 opacity-90">Welcome back, {currentUser?.name}!</p>
            </div>
            <div className="text-end">
              <div className="small opacity-90 mb-1">Current Academic Year</div>
              <div className="h4 fw-bold mb-0">2024-2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card bg-gradient-primary text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">Total Students</p>
                  <h2 className="fw-bold mb-2 display-6">{totalStudents}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <TrendingUp size={16} />
                    <small className="opacity-90">Active enrollments</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <GraduationCap size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card bg-gradient-success text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">Faculty Members</p>
                  <h2 className="fw-bold mb-2 display-6">{totalFaculty}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} />
                    <small className="opacity-90">Teaching staff</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Users size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card bg-gradient-warning text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">Average CGPA</p>
                  <h2 className="fw-bold mb-2 display-6">{avgCGPA}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Award size={16} />
                    <small className="opacity-90">Academic performance</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <BookOpen size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card bg-gradient-info text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">Attendance</p>
                  <h2 className="fw-bold mb-2 display-6">{avgAttendance}%</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Target size={16} />
                    <small className="opacity-90">Average rate</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Target size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Recent Students</h5>
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div
                    key={student._id}
                    className="student-card p-3 bg-light"
                    onClick={() => onViewStudent && onViewStudent(student)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '48px', height: '48px', fontWeight: 'bold' }}>
                        {student.name?.charAt(0)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{student.name}</div>
                        <div className="small text-muted">{student.course} • Sem {student.semester}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-primary">{student.cgpa}</div>
                        <div className="small text-muted">CGPA</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Overview */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Faculty Overview</h5>
              <div className="space-y-3">
                {teachers.slice(0, 5).map((teacher) => (
                  <div
                    key={teacher._id}
                    className="student-card p-3 bg-light"
                    onClick={() => onViewTeacher && onViewTeacher(teacher)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '48px', height: '48px', fontWeight: 'bold' }}>
                        {teacher.name?.charAt(0)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{teacher.name}</div>
                        <div className="small text-muted">{teacher.department}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-warning">★ {teacher.rating || 'N/A'}</div>
                        <div className="small text-muted">Rating</div>
                      </div>
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

export default InstitutionDashboard;