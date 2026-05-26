import React, { useState } from 'react';
import { GraduationCap, Building, UserCheck, Plus, Eye, Upload, Trash2 } from 'lucide-react';
import BulkOperationsModal from '../Common/BulkOperationsModal';

const AdminPanel = ({ stats, onAddStudent, onAddInstitution, onAddTeacher, setCurrentView, onBulkOperations }) => {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkType, setBulkType] = useState('');

  const handleBulkAdd = async (type, data) => {
    setBulkType(type);
    setShowBulkModal(true);
  };

  const handleBulkModalClose = () => {
    setShowBulkModal(false);
    setBulkType('');
  };

  const handleBulkAddSubmit = async (data) => {
    // Call API for bulk add
    if (onBulkOperations && onBulkOperations.bulkAdd) {
      await onBulkOperations.bulkAdd(bulkType, data);
    }
    handleBulkModalClose();
  };

  const handleBulkDeleteSubmit = async (ids) => {
    // Call API for bulk delete
    if (onBulkOperations && onBulkOperations.bulkDelete) {
      await onBulkOperations.bulkDelete(bulkType, ids);
    }
    handleBulkModalClose();
  };

  return (
    <div className="animate-fade-in">
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .admin-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .admin-card:hover {
          border-color: var(--primary-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .action-btn {
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <h4 className="fw-bold mb-4">Admin Control Panel</h4>

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        {/* Students Management */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 admin-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-primary bg-opacity-10 rounded-circle">
                  <GraduationCap size={28} className="text-primary" />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Manage Students</h6>
                  <small className="text-muted">Add, edit, or remove students</small>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-primary action-btn" onClick={onAddStudent}>
                  <Plus size={16} className="me-2" />
                  Add Single Student
                </button>
                <button 
                  className="btn btn-outline-primary action-btn"
                  onClick={() => handleBulkAdd('student')}
                >
                  <Upload size={16} className="me-2" />
                  Bulk Add Students
                </button>
                <button 
                  className="btn btn-outline-danger action-btn"
                  onClick={() => handleBulkAdd('student')}
                >
                  <Trash2 size={16} className="me-2" />
                  Bulk Delete Students
                </button>
                <button 
                  className="btn btn-outline-secondary action-btn"
                  onClick={() => setCurrentView('students')}
                >
                  <Eye size={16} className="me-2" />
                  View All Students
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Institutions Management */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 admin-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                  <Building size={28} className="text-success" />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Manage Institutions</h6>
                  <small className="text-muted">Register and maintain institutions</small>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-success action-btn" onClick={onAddInstitution}>
                  <Plus size={16} className="me-2" />
                  Add Single Institution
                </button>
                <button 
                  className="btn btn-outline-success action-btn"
                  onClick={() => handleBulkAdd('institution')}
                >
                  <Upload size={16} className="me-2" />
                  Bulk Add Institutions
                </button>
                <button 
                  className="btn btn-outline-danger action-btn"
                  onClick={() => handleBulkAdd('institution')}
                >
                  <Trash2 size={16} className="me-2" />
                  Bulk Delete Institutions
                </button>
                <button 
                  className="btn btn-outline-secondary action-btn"
                  onClick={() => setCurrentView('institutions')}
                >
                  <Eye size={16} className="me-2" />
                  View All Institutions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Management */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 admin-card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-warning bg-opacity-10 rounded-circle">
                  <UserCheck size={28} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Manage Faculty</h6>
                  <small className="text-muted">Add and manage faculty members</small>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-warning text-white action-btn" onClick={onAddTeacher}>
                  <Plus size={16} className="me-2" />
                  Add Single Faculty
                </button>
                <button 
                  className="btn btn-outline-warning action-btn"
                  onClick={() => handleBulkAdd('teacher')}
                >
                  <Upload size={16} className="me-2" />
                  Bulk Add Faculty
                </button>
                <button 
                  className="btn btn-outline-danger action-btn"
                  onClick={() => handleBulkAdd('teacher')}
                >
                  <Trash2 size={16} className="me-2" />
                  Bulk Delete Faculty
                </button>
                <button 
                  className="btn btn-outline-secondary action-btn"
                  onClick={() => setCurrentView('teachers')}
                >
                  <Eye size={16} className="me-2" />
                  View All Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="fw-bold mb-4">System Statistics Overview</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="bg-light rounded p-3 text-center">
                <h3 className="fw-bold text-primary mb-0">{stats.students.total || 0}</h3>
                <small className="text-muted">Total Students</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded p-3 text-center">
                <h3 className="fw-bold text-success mb-0">{stats.institutions.total || 0}</h3>
                <small className="text-muted">Total Institutions</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded p-3 text-center">
                <h3 className="fw-bold text-warning mb-0">{stats.teachers.total || 0}</h3>
                <small className="text-muted">Total Faculty</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded p-3 text-center">
                <h3 className="fw-bold text-info mb-0">{stats.students.avgCGPA || '0.00'}</h3>
                <small className="text-muted">Average CGPA</small>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Additional Metrics */}
          <div className="row g-3">
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Institution Metrics</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Average NIRF Score</span>
                <strong>{stats.institutions.avgNIRF || '0.00'}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Total Student Capacity</span>
                <strong>
                  {((stats.institutions.total || 0) * 5000).toLocaleString()}
                </strong>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Faculty Metrics</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Average Rating</span>
                <strong>{stats.teachers.avgRating || '0.00'} / 5.0</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Avg Publications</span>
                <strong>{stats.teachers.avgPublications || '0.00'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        show={showBulkModal}
        onClose={handleBulkModalClose}
        type={bulkType}
        onBulkAdd={handleBulkAddSubmit}
        onBulkDelete={handleBulkDeleteSubmit}
      />
    </div>
  );
};

export default AdminPanel;