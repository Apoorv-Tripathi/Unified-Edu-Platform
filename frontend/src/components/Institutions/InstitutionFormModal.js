
import React from 'react';

const InstitutionFormModal = ({
  show,
  onClose,
  institutionForm = {},
  setInstitutionForm = () => { },
  onSave = () => { },
  saving = false,
  editingId = null,
}) => {

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstitutionForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? 'Edit Institution' : 'Add Institution'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input name="name" value={institutionForm.name || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Short Name</label>
                <input name="shortName" value={institutionForm.shortName || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">AISHE Code</label>
                <input name="aisheCode" value={institutionForm.aisheCode || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input name="location" value={institutionForm.location || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select name="type" value={institutionForm.type || 'Private'} onChange={handleChange} className="form-select">
                  <option>Private</option>
                  <option>Government</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Accreditation</label>
                <input name="accreditation" value={institutionForm.accreditation || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">NIRF Score</label>
                <input name="nirfScore" type="number" value={institutionForm.nirfScore || 0} onChange={handleChange} className="form-control" />
              </div>
              {/* Add more fields as needed */}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving}>
              {saving ? 'Saving...' : (editingId ? 'Update Institution' : 'Create Institution')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionFormModal;