import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  GraduationCap,
  BookOpen,
  Award,
  Upload,
  Shield,
  SlidersHorizontal,
  X,
  Grid,
  List as ListIcon,
} from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import BulkOperationsModal from '../Common/BulkOperationsModal';

const StudentList = ({
  students,
  loading,
  searchQuery,
  setSearchQuery,
  onSearch,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onViewProfile,
  userRole,
  onBulkOperations,
}) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    course: [],
    semester: [],
    aadhaarVerified: [],
    cgpaRange: [0, 10],
    attendanceRange: [0, 100],
    assignmentsRange: [0, 100],
    schemes: [],
  });

  const filterOptions = {
    courses: [
      'BBA',
      'B.Tech ECE',
      'B.Tech ME',
      'B.Tech CE',
      'B.Tech CSE',
      'BCA',
      'MBA',
      'MCA',
      'M.Tech',
    ],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    verificationStatus: ['Verified', 'Not Verified'],
    schemes: ['UP Scholarship', 'Merit Scholarship', 'NSP', 'Post Matric', 'Sports Scholarship'],
  };

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || 'ST';

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.apaarId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
        filters.course.length === 0 || filters.course.includes(student.course);
      const matchesSemester =
        filters.semester.length === 0 || filters.semester.includes(Number(student.semester));

      const matchesVerification =
        filters.aadhaarVerified.length === 0 ||
        (filters.aadhaarVerified.includes('Verified') && student.aadhaarVerified) ||
        (filters.aadhaarVerified.includes('Not Verified') && !student.aadhaarVerified);

      const cgpa = Number(student.cgpa) || 0;
      const attendance = Number(student.attendance) || 0;
      const assignments = Number(student.assignments) || 0;

      const matchesCgpa = cgpa >= filters.cgpaRange[0] && cgpa <= filters.cgpaRange[1];
      const matchesAttendance =
        attendance >= filters.attendanceRange[0] && attendance <= filters.attendanceRange[1];
      const matchesAssignments =
        assignments >= filters.assignmentsRange[0] &&
        assignments <= filters.assignmentsRange[1];

      const matchesSchemes =
        filters.schemes.length === 0 ||
        (student.schemes && filters.schemes.some(s => student.schemes.includes(s)));

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester &&
        matchesVerification &&
        matchesCgpa &&
        matchesAttendance &&
        matchesAssignments &&
        matchesSchemes
      );
    });
  }, [students, searchQuery, filters]);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  const updateRangeFilter = (category, index, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].map((v, i) => (i === index ? Number(value) : v)),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      course: [],
      semester: [],
      aadhaarVerified: [],
      cgpaRange: [0, 10],
      attendanceRange: [0, 100],
      assignmentsRange: [0, 100],
      schemes: [],
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    filters.course.length +
    filters.semester.length +
    filters.aadhaarVerified.length +
    filters.schemes.length;

  const handleBulkAddSubmit = async data => {
    if (onBulkOperations && onBulkOperations.bulkAdd) {
      await onBulkOperations.bulkAdd('student', data);
    }
    setShowBulkModal(false);
  };

  const handleBulkDeleteSubmit = async ids => {
    if (onBulkOperations && onBulkOperations.bulkDelete) {
      await onBulkOperations.bulkDelete('student', ids);
    }
    setShowBulkModal(false);
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .student-list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          background: #fff;
          transition: all 0.25s ease;
        }
        .student-list-row:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border-color: var(--primary-color);
        }
        .student-avatar-sm {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }
        .student-meta {
          font-size: 13px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .student-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .cgpa-chip-sm {
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: right;
        }
        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
          border-color: var(--primary-light);
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-box {
          border: 2px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .search-box:focus-within {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        .cgpa-badge {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-box {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 8px;
          padding: 12px;
          transition: all 0.2s ease;
        }
        .stat-box:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
        }
        .aadhaar-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          border: 2px solid;
        }
        .aadhaar-badge.verified {
          background: #10b981;
          border-color: #059669;
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .aadhaar-badge.not-verified {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #6b7280;
        }
        .filter-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 20px rgba(0,0,0,0.1);
          z-index: 1050;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }
        .filter-sidebar.show {
          transform: translateX(0);
        }
        .filter-sidebar.hide {
          transform: translateX(100%);
        }
        .filter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1040;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .filter-overlay.show {
          opacity: 1;
          pointer-events: all;
        }
        .filter-section {
          border-bottom: 1px solid #e5e7eb;
          padding: 20px;
        }
        .filter-section:last-child {
          border-bottom: none;
        }
        .filter-checkbox {
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .filter-checkbox:hover {
          background: #f3f4f6;
        }
        .range-input {
          width: 90px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        .range-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .view-toggle {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 4px;
          display: inline-flex;
          gap: 4px;
        }
        .view-toggle button {
          padding: 6px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-toggle button.active {
          background: var(--primary-color);
          color: white;
        }
        .view-toggle button:hover:not(.active) {
          background: #f3f4f6;
        }
      `}</style>

      {/* Filter Overlay */}
      <div
        className={`filter-overlay ${showFilters ? 'show' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${showFilters ? 'show' : 'hide'}`}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0 fw-bold">
            <SlidersHorizontal size={20} className="me-2" />
            Advanced Filters
          </h5>
          <button className="btn btn-sm btn-light" onClick={() => setShowFilters(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <button
            className="btn btn-outline-danger btn-sm w-100 mb-3"
            onClick={clearAllFilters}
          >
            <X size={16} className="me-2" />
            Clear All Filters
          </button>
        </div>

        {/* Course Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <BookOpen size={18} className="me-2 text-primary" />
            Course
          </h6>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filterOptions.courses.map(course => (
              <label
                key={course}
                className="filter-checkbox d-flex align-items-center gap-2 w-100"
              >
                <input
                  type="checkbox"
                  checked={filters.course.includes(course)}
                  onChange={() => toggleFilter('course', course)}
                  className="form-check-input"
                />
                <span className="small">{course}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Semester Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <GraduationCap size={18} className="me-2 text-primary" />
            Semester
          </h6>
          <div className="row g-2">
            {filterOptions.semesters.map(sem => (
              <div key={sem} className="col-6">
                <label className="filter-checkbox d-flex align-items-center gap-2 w-100">
                  <input
                    type="checkbox"
                    checked={filters.semester.includes(sem)}
                    onChange={() => toggleFilter('semester', sem)}
                    className="form-check-input"
                  />
                  <span className="small">Sem {sem}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Aadhaar Verification Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Shield size={18} className="me-2 text-primary" />
            Aadhaar Status
          </h6>
          {filterOptions.verificationStatus.map(status => (
            <label
              key={status}
              className="filter-checkbox d-flex align-items-center gap-2 w-100"
            >
              <input
                type="checkbox"
                checked={filters.aadhaarVerified.includes(status)}
                onChange={() => toggleFilter('aadhaarVerified', status)}
                className="form-check-input"
              />
              <span className="small">{status}</span>
            </label>
          ))}
        </div>

        {/* Schemes Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Award size={18} className="me-2 text-primary" />
            Scholarship Schemes
          </h6>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filterOptions.schemes.map(scheme => (
              <label
                key={scheme}
                className="filter-checkbox d-flex align-items-center gap-2 w-100"
              >
                <input
                  type="checkbox"
                  checked={filters.schemes.includes(scheme)}
                  onChange={() => toggleFilter('schemes', scheme)}
                  className="form-check-input"
                />
                <span className="small">{scheme}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CGPA Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">CGPA Range</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.cgpaRange[0]}
              onChange={e => updateRangeFilter('cgpaRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
              step="0.1"
              min="0"
              max="10"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.cgpaRange[1]}
              onChange={e => updateRangeFilter('cgpaRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
              step="0.1"
              min="0"
              max="10"
            />
          </div>
        </div>

        {/* Attendance Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Attendance (%)</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.attendanceRange[0]}
              onChange={e =>
                updateRangeFilter('attendanceRange', 0, e.target.value)
              }
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.attendanceRange[1]}
              onChange={e =>
                updateRangeFilter('attendanceRange', 1, e.target.value)
              }
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Assignments Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Assignments (%)</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.assignmentsRange[0]}
              onChange={e =>
                updateRangeFilter('assignmentsRange', 0, e.target.value)
              }
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.assignmentsRange[1]}
              onChange={e =>
                updateRangeFilter('assignmentsRange', 1, e.target.value)
              }
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-2 text-gradient">
            <GraduationCap
              size={28}
              className="me-2"
              style={{ color: 'var(--primary-color)' }}
            />
            Student Records
          </h4>
          <p className="text-muted mb-0 small">Manage and view all student profiles</p>
        </div>
        {(userRole === 'admin' || userRole === 'institution') && (
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-enhanced shadow" onClick={onAdd}>
              <Plus size={18} className="me-2" />
              <span className="d-none d-sm-inline">Add Student</span>
            </button>
            {userRole === 'institution' && (
              <button
                className="btn btn-outline-primary btn-enhanced shadow"
                onClick={() => setShowBulkModal(true)}
              >
                <Upload size={18} className="me-2" />
                <span className="d-none d-sm-inline">Bulk Operations</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Search Bar */}
      <div className="row mb-4">
        <div className="col-md-5">
          <div className="search-box">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={20} className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by name or APAAR ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
              <button className="btn btn-primary px-4 rounded-end" onClick={onSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button
            className={`btn w-100 btn-enhanced ${showFilters ? 'btn-primary' : 'btn-outline-primary'
              }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} className="me-2" />
            <span className="d-none d-sm-inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="badge bg-white text-primary ms-2">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button
            className="btn btn-outline-primary w-100 btn-enhanced"
            onClick={onRefresh}
          >
            <RefreshCw size={18} className="me-2" />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
        </div>
        <div className="col-md-2 mt-2 mt-md-0 d-flex align-items-center justify-content-center">
          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
        <div className="col-md-1 mt-2 mt-md-0">
          <div className="card border-0 bg-primary bg-opacity-10 h-100">
            <div className="card-body py-2 px-3">
              <div className="text-center">
                <h5 className="mb-0 fw-bold text-primary">
                  {filteredStudents.length}
                </h5>
                <small className="text-primary">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner text="Loading students..." />
      ) : (
        <>
          <div className={`row ${viewMode === 'grid' ? 'g-4' : 'g-2'}`}>
            {filteredStudents.map(student => (
              <div
                key={student._id}
                className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}
              >
                {viewMode === 'grid' ? (
                  /* ====== GRID VIEW (same card as before) ====== */
                  <div className="card border-0 shadow-sm hover-card h-100 card-enhanced">
                    <div className="card-body p-4">
                      {/* Student Header */}
                      <div className="d-flex justify-content-between mb-3">
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-dark">{student.name}</h6>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <BookOpen size={14} />
                            {student.course} • Sem {student.semester}
                          </small>
                          <div className="mt-2 d-flex flex-wrap gap-1">
                            <span className="badge bg-primary badge-enhanced">
                              {student.apaarId}
                            </span>
                            {student.aadhaarVerified ? (
                              <span className="aadhaar-badge verified">
                                <Shield size={12} />
                                Verified
                              </span>
                            ) : (
                              <span className="aadhaar-badge not-verified">
                                <Shield size={12} />
                                Not Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="cgpa-badge">
                            {Number(student.cgpa || 0).toFixed(1)}
                          </div>
                          <small className="text-muted d-block">CGPA</small>
                        </div>
                      </div>

                      {/* CGPA Progress */}
                      <div className="progress-enhanced mb-3" style={{ height: '6px' }}>
                        <div
                          className="progress-bar-enhanced bg-success"
                          style={{
                            width: `${(student.cgpa || 0) * 10}%`,
                            background: 'linear-gradient(90deg, #10b981, #059669)',
                          }}
                        ></div>
                      </div>

                      {/* Stats */}
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="stat-box text-center">
                            <div className="text-muted small mb-1">Attendance</div>
                            <strong className="text-success">
                              {student.attendance || 0}%
                            </strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="stat-box text-center">
                            <div className="text-muted small mb-1">Assignments</div>
                            <strong className="text-primary">
                              {student.assignments || 0}%
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Schemes */}
                      {student.schemes?.length > 0 && (
                        <div className="mb-3">
                          {student.schemes.slice(0, 2).map((s, i) => (
                            <span
                              key={i}
                              className="badge bg-success badge-enhanced me-1 small"
                            >
                              <Award size={12} className="me-1" />
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="d-flex gap-2 pt-3 border-top">
                        <button
                          className="btn btn-sm btn-primary btn-enhanced flex-grow-1"
                          onClick={() => onViewProfile(student)}
                        >
                          <Eye size={14} className="me-1" /> View Details
                        </button>
                        {(userRole === 'admin' || userRole === 'institution') && (
                          <button
                            className="btn btn-sm btn-outline-secondary btn-enhanced"
                            onClick={() => onEdit(student)}
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {userRole === 'admin' && (
                          <button
                            className="btn btn-sm btn-outline-danger btn-enhanced"
                            onClick={() =>
                              onDelete('student', student._id, student.name)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ====== COMPACT LIST VIEW (like Faculty) ====== */
                  <div className="student-list-row mb-2">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <div className="student-avatar-sm">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '14px' }}>
                          {student.name}
                        </div>
                        <div className="student-meta">
                          {student.course} • Sem {student.semester} • {student.apaarId}
                        </div>
                        <div className="student-badges">
                          {student.aadhaarVerified ? (
                            <span className="aadhaar-badge verified">
                              <Shield size={12} />
                              Verified
                            </span>
                          ) : (
                            <span className="aadhaar-badge not-verified">
                              <Shield size={12} />
                              Not Verified
                            </span>
                          )}
                          {student.schemes?.slice(0, 1).map((s, i) => (
                            <span
                              key={i}
                              className="badge bg-success badge-enhanced small"
                            >
                              <Award size={11} className="me-1" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-end me-3" style={{ fontSize: '12px' }}>
                      <div className="cgpa-chip-sm">
                        {Number(student.cgpa || 0).toFixed(1)}
                      </div>
                      <small className="text-muted d-block">CGPA</small>
                      <small className="text-muted d-block">
                        Attendance: {student.attendance || 0}%
                      </small>
                      <small className="text-muted d-block">
                        Assignments: {student.assignments || 0}%
                      </small>
                    </div>

                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onViewProfile(student)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {(userRole === 'admin' || userRole === 'institution') && (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onEdit(student)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {userRole === 'admin' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            onDelete('student', student._id, student.name)
                          }
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="col-12">
                <div className="card border-0 shadow-sm text-center py-5">
                  <GraduationCap size={64} className="text-muted mx-auto mb-3" />
                  <h5 className="text-muted">No students found</h5>
                  <p className="text-muted small">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        show={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        type="student"
        onBulkAdd={handleBulkAddSubmit}
        onBulkDelete={handleBulkDeleteSubmit}
      />
    </div>
  );
};

export default StudentList;