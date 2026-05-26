import React from 'react';
import { Users, BookOpen, Award, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';


const FacultyDashboard = ({ 
  currentUser, 
  stats, 
  loading, 
  students = [],
  onViewStudent
}) => {
  // Mock faculty data (in real app, fetch from teacher model)
  const myCourses = 3;
  const myStudents = students.slice(0, 15); // Mock: first 15 students
  const totalAssignments = 8;
  const pendingGrading = 12;

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
          align-items-center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
        }
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bg-gradient-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .bg-gradient-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .bg-gradient-danger { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .course-card, .student-card {
          transition: all 0.2s ease;
          cursor: pointer;
          border-radius: 12px;
        }
        .course-card:hover, .student-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Welcome Banner */}
      <div className="card border-0 shadow-sm mb-4 bg-gradient-primary text-white">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="fw-bold mb-2">👋 Welcome back, {currentUser?.name}!</h3>
              <p className="mb-0 opacity-90">Here's your teaching overview for today</p>
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
                  <p className="mb-2 opacity-90 fw-medium">My Courses</p>
                  <h2 className="fw-bold mb-2 display-6">{myCourses}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <BookOpen size={16} />
                    <small className="opacity-90">Active courses</small>
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
          <div className="card border-0 shadow-sm stat-card bg-gradient-success text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">My Students</p>
                  <h2 className="fw-bold mb-2 display-6">{myStudents.length}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} />
                    <small className="opacity-90">Enrolled students</small>
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
                  <p className="mb-2 opacity-90 fw-medium">Assignments</p>
                  <h2 className="fw-bold mb-2 display-6">{totalAssignments}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} />
                    <small className="opacity-90">Total assigned</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Award size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm stat-card bg-gradient-danger text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 opacity-90 fw-medium">Pending Grading</p>
                  <h2 className="fw-bold mb-2 display-6">{pendingGrading}</h2>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={16} />
                    <small className="opacity-90">Needs attention</small>
                  </div>
                </div>
                <div className="icon-wrapper">
                  <Clock size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses & Schedule */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">My Courses</h5>
              <div className="space-y-3">
                <div className="course-card p-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Data Structures & Algorithms</div>
                    <span className="badge bg-primary">45 Students</span>
                  </div>
                  <div className="small text-muted">Mon, Wed, Fri • 10:00 AM - 11:00 AM</div>
                </div>
                <div className="course-card p-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Operating Systems</div>
                    <span className="badge bg-success">38 Students</span>
                  </div>
                  <div className="small text-muted">Tue, Thu • 2:00 PM - 3:30 PM</div>
                </div>
                <div className="course-card p-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">Database Management Systems</div>
                    <span className="badge bg-warning">42 Students</span>
                  </div>
                  <div className="small text-muted">Mon, Wed • 3:00 PM - 4:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Today's Schedule</h5>
              <div className="space-y-3">
                <div className="d-flex gap-3 p-3 bg-light rounded">
                  <div className="text-center" style={{minWidth: '60px'}}>
                    <div className="fw-bold text-primary">10:00</div>
                    <div className="small text-muted">AM</div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">DSA Lecture</div>
                    <div className="small text-muted">Room 301 • B.Tech CSE</div>
                  </div>
                </div>
                <div className="d-flex gap-3 p-3 bg-light rounded">
                  <div className="text-center" style={{minWidth: '60px'}}>
                    <div className="fw-bold text-success">2:00</div>
                    <div className="small text-muted">PM</div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">OS Lab Session</div>
                    <div className="small text-muted">Lab B-203 • B.Tech CSE</div>
                  </div>
                </div>
                <div className="d-flex gap-3 p-3 bg-light rounded">
                  <div className="text-center" style={{minWidth: '60px'}}>
                    <div className="fw-bold text-warning">3:00</div>
                    <div className="small text-muted">PM</div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">DBMS Lecture</div>
                    <div className="small text-muted">Room 305 • B.Tech CSE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Students */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">My Students</h5>
          <div className="row g-3">
            {myStudents.slice(0, 6).map((student) => (
              <div key={student._id} className="col-md-4">
                <div
                  className="student-card p-3 bg-light"
                  onClick={() => onViewStudent && onViewStudent(student)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                         style={{width: '48px', height: '48px', fontWeight: 'bold'}}>
                      {student.name?.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{student.name}</div>
                      <div className="small text-muted">{student.course}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary small">{student.cgpa}</div>
                      <div className="small text-muted" style={{fontSize: '10px'}}>CGPA</div>
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

export default FacultyDashboard;