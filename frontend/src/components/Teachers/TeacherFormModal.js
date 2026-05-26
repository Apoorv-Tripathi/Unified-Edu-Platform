// TeacherFormModal.js
// Simple Bootstrap modal for creating/editing a teacher.
// Props expected:
// show, onClose, teacherForm, setTeacherForm, onSave, saving, editingId

import React from 'react';

const TeacherFormModal = ({
  show,
  onClose,
  teacherForm = {},
  setTeacherForm = () => {},
  onSave = () => {},
  saving = false,
  editingId = null,
}) => {

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input name="name" value={teacherForm.name || ''} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" value={teacherForm.email || ''} onChange={handleChange} className="form-control" />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <input name="department" value={teacherForm.department || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <input name="designation" value={teacherForm.designation || ''} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label className="form-label">Publications</label>
                <input name="publications" type="number" value={teacherForm.publications || 0} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Projects</label>
                <input name="projects" type="number" value={teacherForm.projects || 0} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Experience (yrs)</label>
                <input name="experience" type="number" value={teacherForm.experience || 0} onChange={handleChange} className="form-control" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : (editingId ? 'Update Faculty' : 'Create Faculty')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormModal;