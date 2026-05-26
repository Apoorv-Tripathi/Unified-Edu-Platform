import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  BookOpen,
  Award,
  Star,
  Upload,
  SlidersHorizontal,
  X,
  Grid,
  List as ListIcon,
  Users
} from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import BulkOperationsModal from '../Common/BulkOperationsModal';

const TeacherList = ({
  teachers,
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
  onBulkOperations
}) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    department: [],
    designation: [],
    ratingRange: [0, 5],
    publicationsRange: [0, 100],
    projectsRange: [0, 50],
    hIndexRange: [0, 50],
    experienceRange: [0, 40],
  });

  const filterOptions = {
    departments: ['ECE', 'Computer Science', 'Mechanical', 'Civil', 'Biotech', 'Electrical', 'Chemical', 'Mathematics', 'Physics', 'Chemistry'],
    designations: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer', 'Research Scholar', 'Visiting Faculty'],
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const matchesSearch =
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.aparId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        filters.department.length === 0 || filters.department.includes(teacher.department);
      const matchesDesignation =
        filters.designation.length === 0 || filters.designation.includes(teacher.designation);

      const rating = Number(teacher.rating) || 0;
      const publications = Number(teacher.publications) || 0;
      const projects = Number(teacher.projects) || 0;
      const hIndex = Number(teacher.hIndex) || 0;
      const experience = Number(teacher.experience) || 0;

      const matchesRating =
        rating >= filters.ratingRange[0] && rating <= filters.ratingRange[1];
      const matchesPublications =
        publications >= filters.publicationsRange[0] &&
        publications <= filters.publicationsRange[1];
      const matchesProjects =
        projects >= filters.projectsRange[0] && projects <= filters.projectsRange[1];
      const matchesHIndex =
        hIndex >= filters.hIndexRange[0] && hIndex <= filters.hIndexRange[1];
      const matchesExperience =
        experience >= filters.experienceRange[0] && experience <= filters.experienceRange[1];

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesRating &&
        matchesPublications &&
        matchesProjects &&
        matchesHIndex &&
        matchesExperience
      );
    });
  }, [teachers, searchQuery, filters]);

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
      department: [],
      designation: [],
      ratingRange: [0, 5],
      publicationsRange: [0, 100],
      projectsRange: [0, 50],
      hIndexRange: [0, 50],
      experienceRange: [0, 40],
    });
    setSearchQuery('');
  };

  const activeFilterCount = filters.department.length + filters.designation.length;

  const getInitials = name =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || 'NA';

  const handleBulkAddSubmit = async data => {
    if (onBulkOperations && onBulkOperations.bulkAdd) {
      await onBulkOperations.bulkAdd('teacher', data);
    }
    setShowBulkModal(false);
  };

  const handleBulkDeleteSubmit = async ids => {
    if (onBulkOperations && onBulkOperations.bulkDelete) {
      await onBulkOperations.bulkDelete('teacher', ids);
    }
    setShowBulkModal(false);
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
          border-color: #f59e0b;
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
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
        }
        .faculty-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease;
        }
        .hover-card:hover .faculty-avatar {
          transform: scale(1.1) rotate(5deg);
        }
        .stat-box {
          background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
          border-radius: 10px;
          padding: 12px;
          transition: all 0.2s ease;
          text-align: center;
        }
        .stat-box:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
        }
        .rating-stars {
          color: #f59e0b;
          font-size: 14px;
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
        . filter-overlay {
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
          display: none; /* ADD THIS */
        }
        .filter-overlay.show {
          opacity: 1;
          pointer-events: all;
          display: block; /* ADD THIS */
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
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
          background: #f59e0b;
          color: white;
        }
        .view-toggle button:hover:not(.active) {
          background: #f3f4f6;
        }

        /* Compact list view specific styles */
        .teacher-list-card {
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: all 0.2s ease;
        }
        .teacher-list-card:hover {
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
          border-color: #f59e0b;
          transform: translateY(-3px);
        }
        .teacher-list-avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .teacher-list-main {
          flex: 1;
          min-width: 0;
        }
        .teacher-list-name {
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .teacher-list-meta {
          font-size: 12px;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .teacher-list-meta span {
          margin-right: 8px;
        }
        .teacher-list-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .teacher-list-rating {
          font-size: 12px;
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .teacher-list-rating .star-icon {
          font-size: 14px;
        }
        .teacher-list-stats {
          font-size: 11px;
          text-align: right;
          color: #6b7280;
        }
      `}</style>

      {/* Filter Overlay */}
      <div
        className={`filter-overlay ${showFilters ? 'show' : ''}`}
        onClick={() => setShowFilters(false)}
      />

      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${showFilters ? 'show' : 'hide'}`}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-warning text-white">
          <h5 className="mb-0 fw-bold">
            <SlidersHorizontal size={20} className="me-2" />
            Advanced Filters
          </h5>
          <button className="btn btn-sm btn-light" onClick={() => setShowFilters(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-3">
          <button className="btn btn-outline-danger btn-sm w-100 mb-3" onClick={clearAllFilters}>
            <X size={16} className="me-2" />
            Clear All Filters
          </button>
        </div>

        {/* Department Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <BookOpen size={18} className="me-2 text-warning" />
            Department
          </h6>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filterOptions.departments.map(dept => (
              <label key={dept} className="filter-checkbox d-flex align-items-center gap-2 w-100">
                <input
                  type="checkbox"
                  checked={filters.department.includes(dept)}
                  onChange={() => toggleFilter('department', dept)}
                  className="form-check-input"
                />
                <span className="small">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Designation Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <UserCheck size={18} className="me-2 text-warning" />
            Designation
          </h6>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filterOptions.designations.map(desig => (
              <label key={desig} className="filter-checkbox d-flex align-items-center gap-2 w-100">
                <input
                  type="checkbox"
                  checked={filters.designation.includes(desig)}
                  onChange={() => toggleFilter('designation', desig)}
                  className="form-check-input"
                />
                <span className="small">{desig}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Star size={18} className="me-2 text-warning" />
            Rating
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.ratingRange[0]}
              onChange={e => updateRangeFilter('ratingRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
              step="0.1"
              min="0"
              max="5"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.ratingRange[1]}
              onChange={e => updateRangeFilter('ratingRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
              step="0.1"
              min="0"
              max="5"
            />
          </div>
        </div>

        {/* Publications Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <BookOpen size={18} className="me-2 text-warning" />
            Publications
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.publicationsRange[0]}
              onChange={e => updateRangeFilter('publicationsRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.publicationsRange[1]}
              onChange={e => updateRangeFilter('publicationsRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Projects Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Award size={18} className="me-2 text-warning" />
            Projects
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.projectsRange[0]}
              onChange={e => updateRangeFilter('projectsRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.projectsRange[1]}
              onChange={e => updateRangeFilter('projectsRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* H-Index Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Star size={18} className="me-2 text-warning" />
            H-Index
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.hIndexRange[0]}
              onChange={e => updateRangeFilter('hIndexRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.hIndexRange[1]}
              onChange={e => updateRangeFilter('hIndexRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Experience Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <UserCheck size={18} className="me-2 text-warning" />
            Experience (Years)
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.experienceRange[0]}
              onChange={e => updateRangeFilter('experienceRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.experienceRange[1]}
              onChange={e => updateRangeFilter('experienceRange', 1, e.target.value)}
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
            <UserCheck size={28} className="me-2" style={{ color: '#f59e0b' }} />
            Faculty Directory
          </h4>
          <p className="text-muted mb-0 small">Manage and view all faculty members</p>
        </div>
        {(userRole === 'admin' || userRole === 'institution') && (
          <div className="d-flex gap-2">
            <button className="btn btn-warning text-white btn-enhanced shadow" onClick={onAdd}>
              <Plus size={18} className="me-2" />
              <span className="d-none d-sm-inline">Add Faculty</span>
            </button>
            {userRole === 'institution' && (
              <button
                className="btn btn-outline-warning btn-enhanced shadow"
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
                <Search size={20} style={{ color: '#f59e0b' }} />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by name or APAR ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
              <button className="btn btn-warning text-white px-4 rounded-end" onClick={onSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button
            className={`btn w-100 btn-enhanced ${showFilters ? 'btn-warning text-white' : 'btn-outline-warning'
              }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} className="me-2" />
            <span className="d-none d-sm-inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="badge bg-white text-warning ms-2">{activeFilterCount}</span>
            )}
          </button>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button className="btn btn-outline-warning w-100 btn-enhanced" onClick={onRefresh}>
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
          <div className="card border-0 bg-warning bg-opacity-10 h-100">
            <div className="card-body py-2 px-3">
              <div className="text-center">
                <h5 className="mb-0 fw-bold text-warning">{filteredTeachers.length}</h5>
                <small className="text-warning">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner text="Loading faculty..." />
      ) : (
        <>
          <div className={`row ${viewMode === 'grid' ? 'g-4' : 'g-2'}`}>
            {filteredTeachers.map(teacher => (
              <div
                key={teacher._id}
                className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}
              >
                {viewMode === 'grid' ? (
                  // ===== GRID VIEW (same as before) =====
                  <div className="card border-0 shadow-sm hover-card h-100 card-enhanced">
                    <div className="card-body p-4 text-center">
                      <div className="faculty-avatar">
                        {getInitials(teacher.name)}
                      </div>

                      <h6 className="fw-bold mb-1 text-dark">{teacher.name}</h6>
                      <p className="text-muted small mb-2">{teacher.designation}</p>
                      <span className="badge bg-warning text-dark badge-enhanced mb-2">
                        {teacher.aparId}
                      </span>
                      <p className="text-muted small mb-3">
                        <BookOpen size={14} className="me-1" />
                        {teacher.department}
                      </p>

                      <div className="rating-stars mb-3">
                        {'★'.repeat(Math.round(teacher.rating || 0))}
                        {'☆'.repeat(5 - Math.round(teacher.rating || 0))}
                        <span className="ms-2 text-dark fw-semibold">
                          {(teacher.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <div className="stat-box">
                            <div className="text-warning small mb-1">
                              <BookOpen size={16} />
                            </div>
                            <strong className="d-block">{teacher.publications || 0}</strong>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              Papers
                            </small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="stat-box">
                            <div className="text-warning small mb-1">
                              <Award size={16} />
                            </div>
                            <strong className="d-block">{teacher.projects || 0}</strong>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              Projects
                            </small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="stat-box">
                            <div className="text-warning small mb-1">
                              <Star size={16} />
                            </div>
                            <strong className="d-block">{teacher.hIndex || 0}</strong>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              H-Index
                            </small>
                          </div>
                        </div>
                      </div>

                      {teacher.experience > 0 && (
                        <div className="mb-3">
                          <span className="badge bg-warning bg-opacity-20 text-warning px-3 py-2">
                            {teacher.experience} Years Experience
                          </span>
                        </div>
                      )}

                      <div className="d-flex gap-2 pt-3 border-top">
                        <button
                          className="btn btn-sm btn-warning text-white btn-enhanced flex-grow-1"
                          onClick={() => onViewProfile(teacher)}
                        >
                          <Eye size={14} className="me-1" /> View Profile
                        </button>
                        {userRole === 'admin' && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-secondary btn-enhanced"
                              onClick={() => onEdit(teacher)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger btn-enhanced"
                              onClick={() => onDelete('teacher', teacher._id, teacher.name)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // ===== COMPACT LIST VIEW =====
                  <div className="teacher-list-card mb-2">
                    <div className="teacher-list-avatar">
                      {getInitials(teacher.name)}
                    </div>

                    <div className="teacher-list-main">
                      <div className="teacher-list-name">
                        {teacher.name}
                      </div>
                      <div className="teacher-list-meta">
                        <span>{teacher.designation}</span>
                        <span>· {teacher.department}</span>
                        {teacher.aparId && <span>· {teacher.aparId}</span>}
                      </div>
                    </div>

                    <div className="teacher-list-right">
                      <div className="teacher-list-rating">
                        <span className="star-icon">★</span>
                        <span>{(teacher.rating || 0).toFixed(1)}</span>
                      </div>
                      <div className="teacher-list-stats d-none d-md-block">
                        <div>Papers: {teacher.publications || 0}</div>
                        <div>Projects: {teacher.projects || 0}</div>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => onViewProfile(teacher)}
                          title="View Profile"
                        >
                          <Eye size={14} />
                        </button>
                        {userRole === 'admin' && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onEdit(teacher)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDelete('teacher', teacher._id, teacher.name)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredTeachers.length === 0 && (
              <div className="col-12">
                <div className="card border-0 shadow-sm text-center py-5">
                  <UserCheck size={64} className="text-muted mx-auto mb-3" />
                  <h5 className="text-muted">No faculty found</h5>
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
        type="teacher"
        onBulkAdd={handleBulkAddSubmit}
        onBulkDelete={handleBulkDeleteSubmit}
      />
    </div>
  );
};

export default TeacherList;