import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Plus, Edit2, Trash2, Eye, Building, MapPin, Award, Users, TrendingUp, SlidersHorizontal, X, ChevronDown, Download, Grid, List as ListIcon } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';

const InstitutionList = ({
  institutions,
  loading,
  searchQuery,
  setSearchQuery,
  onSearch,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onViewProfile,
  userRole
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    location: [],
    accreditation: [],
    type: [],
    rankRange: [1, 300],
    nirfRange: [0, 100],
    studentsRange: [0, 5000],
    facultyRange: [0, 1000],
    departmentsRange: [0, 30],
    placementRange: [0, 100],
    complianceRange: [0, 100],
    establishedRange: [1950, 2025],
  });

  const filterOptions = {
    locations: ['Delhi', 'Pune', 'Jaipur', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Lucknow'],
    accreditations: ['NAAC A++', 'NAAC A+', 'NAAC A', 'NAAC B++', 'NAAC B+', 'NAAC B', 'NBA'],
    types: ['Government', 'Private', 'Deemed', 'Autonomous', 'Central'],
  };

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      const matchesSearch = inst.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.aisheCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = filters.location.length === 0 || filters.location.includes(inst.location);
      const matchesAccreditation = filters.accreditation.length === 0 || filters.accreditation.includes(inst.accreditation);
      const matchesType = filters.type.length === 0 || filters.type.includes(inst.type);

      const rank = Number(inst.ranking) || 0;
      const nirf = Number(inst.nirfScore) || 0;
      const students = Number(inst.students) || 0;
      const faculty = Number(inst.faculty) || 0;
      const departments = Number(inst.departments) || 0;
      const placement = Number(inst.placement) || 0;
      const compliance = Number(inst.compliance) || 0;
      const established = Number(inst.established) || 0;

      const matchesRank = rank >= filters.rankRange[0] && rank <= filters.rankRange[1];
      const matchesNirf = nirf >= filters.nirfRange[0] && nirf <= filters.nirfRange[1];
      const matchesStudents = students >= filters.studentsRange[0] && students <= filters.studentsRange[1];
      const matchesFaculty = faculty >= filters.facultyRange[0] && faculty <= filters.facultyRange[1];
      const matchesDepartments = departments >= filters.departmentsRange[0] && departments <= filters.departmentsRange[1];
      const matchesPlacement = placement >= filters.placementRange[0] && placement <= filters.placementRange[1];
      const matchesCompliance = compliance >= filters.complianceRange[0] && compliance <= filters.complianceRange[1];
      const matchesEstablished = established >= filters.establishedRange[0] && established <= filters.establishedRange[1];

      return matchesSearch && matchesLocation && matchesAccreditation && matchesType &&
        matchesRank && matchesNirf && matchesStudents && matchesFaculty &&
        matchesDepartments && matchesPlacement && matchesCompliance && matchesEstablished;
    });
  }, [institutions, searchQuery, filters]);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const updateRangeFilter = (category, index, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].map((v, i) => i === index ? Number(value) : v)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      location: [],
      accreditation: [],
      type: [],
      rankRange: [1, 300],
      nirfRange: [0, 100],
      studentsRange: [0, 5000],
      facultyRange: [0, 1000],
      departmentsRange: [0, 30],
      placementRange: [0, 100],
      complianceRange: [0, 100],
      establishedRange: [1950, 2025],
    });
    setSearchQuery('');
  };

  const activeFilterCount = filters.location.length + filters.accreditation.length + filters.type.length;

  const getComplianceVariant = (score) => {
    const value = Number(score) || 0;
    if (value >= 85) return "success";
    if (value >= 70) return "warning";
    return "danger";
  };

  const getInitials = (name) => {
    return name?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3) || 'INS';
  };

  return (
    <div className="animate-fade-in">
      <style>{`
      /* FILTER OVERLAY — FIXED */


        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
          border-color: #10b981;
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
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        .institution-logo {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        .hover-card:hover .institution-logo {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }
        .nirf-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        .nirf-score {
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
        }
        .nirf-label {
          font-size: 9px;
          font-weight: 600;
        }
        .stat-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-radius: 10px;
          padding: 12px;
          transition: all 0.2s ease;
        }
        .stat-box:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }
        .rank-badge {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
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
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
          background: #10b981;
          color: white;
        }
        .view-toggle button:hover:not(.active) {
          background: #f3f4f6;
        }
      `}</style>

      {/* Filter Overlay */}
      <div className={`filter-overlay ${showFilters ? 'show' : ''}`} onClick={() => setShowFilters(false)} />

      {/* Filter Sidebar */}
      <div className={`filter-sidebar ${showFilters ? 'show' : 'hide'}`}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-success text-white">
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

        {/* Location Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <MapPin size={18} className="me-2 text-success" />
            Location
          </h6>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filterOptions.locations.map(loc => (
              <label key={loc} className="filter-checkbox d-flex align-items-center gap-2 w-100">
                <input
                  type="checkbox"
                  checked={filters.location.includes(loc)}
                  onChange={() => toggleFilter('location', loc)}
                  className="form-check-input"
                />
                <span className="small">{loc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accreditation Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Award size={18} className="me-2 text-success" />
            Accreditation
          </h6>
          {filterOptions.accreditations.map(acc => (
            <label key={acc} className="filter-checkbox d-flex align-items-center gap-2 w-100">
              <input
                type="checkbox"
                checked={filters.accreditation.includes(acc)}
                onChange={() => toggleFilter('accreditation', acc)}
                className="form-check-input"
              />
              <span className="small">{acc}</span>
            </label>
          ))}
        </div>

        {/* Type Filter */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Building size={18} className="me-2 text-success" />
            Institution Type
          </h6>
          {filterOptions.types.map(type => (
            <label key={type} className="filter-checkbox d-flex align-items-center gap-2 w-100">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => toggleFilter('type', type)}
                className="form-check-input"
              />
              <span className="small">{type}</span>
            </label>
          ))}
        </div>

        {/* Rank Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <TrendingUp size={18} className="me-2 text-success" />
            Rank Range
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.rankRange[0]}
              onChange={(e) => updateRangeFilter('rankRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.rankRange[1]}
              onChange={(e) => updateRangeFilter('rankRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* NIRF Score Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">NIRF Score</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.nirfRange[0]}
              onChange={(e) => updateRangeFilter('nirfRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
              step="0.1"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.nirfRange[1]}
              onChange={(e) => updateRangeFilter('nirfRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
              step="0.1"
            />
          </div>
        </div>

        {/* Students Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Users size={18} className="me-2 text-success" />
            Student Count
          </h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.studentsRange[0]}
              onChange={(e) => updateRangeFilter('studentsRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.studentsRange[1]}
              onChange={(e) => updateRangeFilter('studentsRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Faculty Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Faculty Count</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.facultyRange[0]}
              onChange={(e) => updateRangeFilter('facultyRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.facultyRange[1]}
              onChange={(e) => updateRangeFilter('facultyRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Departments Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Departments</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.departmentsRange[0]}
              onChange={(e) => updateRangeFilter('departmentsRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.departmentsRange[1]}
              onChange={(e) => updateRangeFilter('departmentsRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Placement Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Placement Rate (%)</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.placementRange[0]}
              onChange={(e) => updateRangeFilter('placementRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.placementRange[1]}
              onChange={(e) => updateRangeFilter('placementRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Compliance Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Compliance Score (%)</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.complianceRange[0]}
              onChange={(e) => updateRangeFilter('complianceRange', 0, e.target.value)}
              className="range-input"
              placeholder="Min"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.complianceRange[1]}
              onChange={(e) => updateRangeFilter('complianceRange', 1, e.target.value)}
              className="range-input"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Established Year Range */}
        <div className="filter-section">
          <h6 className="fw-bold mb-3">Established Year</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              value={filters.establishedRange[0]}
              onChange={(e) => updateRangeFilter('establishedRange', 0, e.target.value)}
              className="range-input"
              placeholder="From"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              value={filters.establishedRange[1]}
              onChange={(e) => updateRangeFilter('establishedRange', 1, e.target.value)}
              className="range-input"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-2 text-gradient">
            <Building size={28} className="me-2" style={{ color: '#10b981' }} />
            Institution Directory
          </h4>
          <p className="text-muted mb-0 small">Explore all registered educational institutions</p>
        </div>
        {userRole === 'admin' && (
          <button className="btn btn-success btn-enhanced shadow" onClick={onAdd}>
            <Plus size={18} className="me-2" />
            <span className="d-none d-sm-inline">Add Institution</span>
          </button>
        )}
      </div>

      {/* Enhanced Search Bar */}
      <div className="row mb-4">
        <div className="col-md-5">
          <div className="search-box">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={20} style={{ color: '#10b981' }} />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search by name or AISHE code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
              <button className="btn btn-success px-4 rounded-end" onClick={onSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button
            className={`btn w-100 btn-enhanced ${showFilters ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} className="me-2" />
            <span className="d-none d-sm-inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="badge bg-white text-success ms-2">{activeFilterCount}</span>
            )}
          </button>
        </div>
        <div className="col-md-2 mt-2 mt-md-0">
          <button className="btn btn-outline-success w-100 btn-enhanced" onClick={onRefresh}>
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
          <div className="card border-0 bg-success bg-opacity-10 h-100">
            <div className="card-body py-2 px-3">
              <div className="text-center">
                <h5 className="mb-0 fw-bold text-success">{filteredInstitutions.length}</h5>
                <small className="text-success">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner text="Loading institutions..." />
      ) : (
        <>
          <div className={`row ${viewMode === 'grid' ? 'g-4' : 'g-3'}`}>
            {filteredInstitutions.map(inst => (
              <div key={inst._id} className={viewMode === 'grid' ? 'col-md-6 col-lg-6' : 'col-12'}>

                {/* LIST VIEW STARTS HERE */}
                {viewMode === "list" ? (
                  <div
                    className="card border-0 shadow-sm hover-card mb-3 p-3 d-flex flex-row align-items-center justify-content-between"
                    style={{ minHeight: "120px" }}
                  >
                    {/* LEFT SECTION - LOGO + TITLE */}
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="institution-logo"
                        style={{ width: 60, height: 60, margin: 0 }}
                      >
                        {getInitials(inst.name)}
                      </div>

                      <div>
                        <h6 className="fw-bold mb-1">{inst.name}</h6>
                        <p className="text-muted small mb-1 d-flex align-items-center">
                          <MapPin size={14} className="me-1" />
                          {inst.location}
                        </p>

                        <div className="d-flex flex-wrap gap-1">
                          <span className="badge bg-primary">{inst.aisheCode}</span>
                          <span className="badge bg-success">{inst.accreditation}</span>
                          <span className="badge bg-secondary">{inst.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE SECTION - STATS */}
                    <div className="text-end me-4" style={{ minWidth: "170px" }}>
                      <div
                        className="badge text-white mb-2"
                        style={{
                          background: "linear-gradient(135deg,#f59e0b,#d97706)",
                          borderRadius: "20px",
                          padding: "6px 12px",
                          fontWeight: "600",
                        }}
                      >
                        {inst.nirfScore} NIRF
                      </div>

                      <div className="small text-muted">
                        Students: <strong>{inst.students}</strong>
                      </div>
                      <div className="small text-muted">
                        Faculty: <strong>{inst.faculty}</strong>
                      </div>
                      <div className="small text-muted">
                        Departments: <strong>{inst.departments}</strong>
                      </div>
                    </div>

                    {/* RIGHT SECTION - ACTION BUTTONS */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          console.log("CLICKED:", inst);
                          onViewProfile(inst);
                        }}
                      >
                        <Eye size={14} />
                      </button>

                      {userRole === "admin" && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => onEdit(inst)}
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              onDelete("institution", inst._id, inst.name)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (

                  /* ORIGINAL GRID CARD (UNCHANGED) */
                  <div className="card border-0 shadow-sm hover-card h-100 card-enhanced position-relative">
                    <div className="nirf-badge">
                      <div className="nirf-score">{inst.nirfScore}</div>
                      <div className="nirf-label">NIRF</div>
                    </div>

                    <div className="card-body p-4">
                      <div className="institution-logo">
                        {getInitials(inst.name)}
                      </div>

                      <h6 className="fw-bold mb-2 text-dark text-center">{inst.name}</h6>
                      <p className="text-muted small mb-2 text-center">
                        <MapPin size={14} className="me-1" />
                        {inst.location}
                      </p>

                      <div className="text-center mb-3">
                        <span className="badge bg-primary me-1">{inst.aisheCode}</span>
                        <span className="badge bg-success me-1">{inst.accreditation}</span>
                        <span className="badge bg-secondary">{inst.type}</span>
                      </div>

                      <div className="text-center mb-3">
                        <div className="rank-badge">
                          <TrendingUp size={16} />
                          Rank #{inst.ranking}
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-4">
                          <div className="stat-box text-center">
                            <div className="text-success small mb-1">
                              <Users size={18} />
                            </div>
                            <strong className="d-block">{((inst.students || 0) / 1000).toFixed(1)}K</strong>
                            <small className="text-muted" style={{ fontSize: "10px" }}>Students</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="stat-box text-center">
                            <div className="text-success small mb-1">
                              <Users size={18} />
                            </div>
                            <strong className="d-block">{inst.faculty}</strong>
                            <small className="text-muted" style={{ fontSize: "10px" }}>Faculty</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="stat-box text-center">
                            <div className="text-success small mb-1">
                              <Building size={18} />
                            </div>
                            <strong className="d-block">{inst.departments}</strong>
                            <small className="text-muted" style={{ fontSize: "10px" }}>Departments</small>
                          </div>
                        </div>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="small">
                            <span className="text-muted">Established:</span>
                            <strong className="ms-1">{inst.established}</strong>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <div className="small">
                            <span className="text-muted">Placement:</span>
                            <strong className="ms-1 text-success">{inst.placement}%</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">Compliance Score</small>
                          <small className="fw-semibold">{inst.compliance}%</small>
                        </div>
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar bg-${getComplianceVariant(
                              inst.compliance
                            )}`}
                            style={{ width: `${Number(inst.compliance) || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 pt-3 border-top">
                        <button
                          className="btn btn-sm btn-success flex-grow-1"
                          onClick={() => {
                            console.log("CLICKED:", inst);
                            onViewProfile(inst);
                          }}
                        >
                          <Eye size={14} className="me-1" /> View Details
                        </button>

                        {userRole === "admin" && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onEdit(inst)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                onDelete("institution", inst._id, inst.name)
                              }
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
            {filteredInstitutions.length === 0 && (
              <div className="col-12">
                <div className="card border-0 shadow-sm text-center py-5">
                  <Building size={64} className="text-muted mx-auto mb-3" />
                  <h5 className="text-muted">No institutions found</h5>
                  <p className="text-muted small">Try adjusting your search criteria or filters</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InstitutionList;