import React from 'react';
import Modal from '../Common/Modal';

const StudentFormModal = ({ show, onClose, studentForm, setStudentForm, onSave, saving, editingId }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={editingId ? 'Edit Student' : 'Add New Student'}
      onSave={onSave}
      saving={saving}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Name *</label>
          <input
            type="text"
            className="form-control"
            value={studentForm.name}
            onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Email *</label>
          <input
            type="email"
            className="form-control"
            value={studentForm.email}
            onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Course *</label>
          <select
            className="form-select"
            value={studentForm.course}
            onChange={e => setStudentForm({ ...studentForm, course: e.target.value })}
          >
            <option value="">Select Course</option>
            <option value="B.Tech CSE">B.Tech CSE</option>
            <option value="B.Tech ECE">B.Tech ECE</option>
            <option value="B.Tech Mechanical">B.Tech Mechanical</option>
            <option value="B.Tech Civil">B.Tech Civil</option>
            <option value="B.Tech IT">B.Tech IT</option>
            <option value="M.Tech AI & ML">M.Tech AI & ML</option>
            <option value="M.Tech Data Science">M.Tech Data Science</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Semester</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="10"
            value={studentForm.semester}
            onChange={e => setStudentForm({ ...studentForm, semester: parseInt(e.target.value) })}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">CGPA</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="10"
            step="0.1"
            value={studentForm.cgpa}
            onChange={e => setStudentForm({ ...studentForm, cgpa: parseFloat(e.target.value) })}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">Attendance %</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="100"
            value={studentForm.attendance}
            onChange={e => setStudentForm({ ...studentForm, attendance: parseInt(e.target.value) })}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">Assignments %</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="100"
            value={studentForm.assignments}
            onChange={e => setStudentForm({ ...studentForm, assignments: parseInt(e.target.value) })}
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold">Achievements (comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Hackathon Winner, Best Project"
            value={studentForm.achievements}
            onChange={e => setStudentForm({ ...studentForm, achievements: e.target.value })}
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold">Schemes (comma separated)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Merit Scholarship, PM Scholarship"
            value={studentForm.schemes}
            onChange={e => setStudentForm({ ...studentForm, schemes: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default StudentFormModal;