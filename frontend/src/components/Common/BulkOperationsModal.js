import React, { useState } from 'react';
import { Upload, Download, X, CheckCircle, AlertCircle, FileText, Users } from 'lucide-react';
import Modal from './Modal';

const BulkOperationsModal = ({ show, onClose, type, onBulkAdd, onBulkDelete }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [deleteIds, setDeleteIds] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCsv(text);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const parseCsv = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index];
        });
        data.push(obj);
      }
    }
    
    setCsvData(data);
  };

  const handleBulkAdd = async () => {
    setProcessing(true);
    try {
      await onBulkAdd(csvData);
      setCsvFile(null);
      setCsvData([]);
    } catch (error) {
      console.error('Bulk add error:', error);
    }
    setProcessing(false);
  };

  const handleBulkDelete = async () => {
    setProcessing(true);
    try {
      const ids = deleteIds.split(',').map(id => id.trim()).filter(Boolean);
      await onBulkDelete(ids);
      setDeleteIds('');
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
    setProcessing(false);
  };

  const getTemplate = () => {
    const templates = {
      student: 'name,email,course,semester,cgpa,attendance,assignments,achievements,schemes',
      institution: 'name,shortName,aisheCode,location,type,accreditation,nirfScore,ranking,compliance,students,faculty,departments,established,placement',
      teacher: 'name,email,department,designation,publications,projects,hIndex,experience,rating,specializations'
    };
    return templates[type] || '';
  };

  const downloadTemplate = () => {
    const template = getTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose} title={`Bulk Operations - ${type.charAt(0).toUpperCase() + type.slice(1)}`} size="lg">
      <style>{`
        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-bottom: 3px solid transparent;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .tab-btn:hover {
          color: #667eea;
        }
        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }
        .upload-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .upload-zone:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        .upload-zone.has-file {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        .data-preview {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          background: #f8fafc;
        }
      `}</style>

      {/* Tabs */}
      <div className="d-flex border-bottom mb-4">
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <Upload size={18} className="me-2" />
          Bulk Add
        </button>
        <button 
          className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          <Users size={18} className="me-2" />
          Bulk Delete
        </button>
      </div>

      {/* Bulk Add Tab */}
      {activeTab === 'add' && (
        <div>
          <div className="alert alert-info d-flex align-items-start gap-3 mb-4">
            <AlertCircle size={24} className="flex-shrink-0 mt-1" />
            <div>
              <strong>Instructions:</strong>
              <ul className="mb-0 mt-2">
                <li>Download the CSV template</li>
                <li>Fill in the data (one record per row)</li>
                <li>Upload the completed CSV file</li>
                <li>Review and confirm the import</li>
              </ul>
            </div>
          </div>

          <button className="btn btn-outline-primary mb-3" onClick={downloadTemplate}>
            <Download size={18} className="me-2" />
            Download CSV Template
          </button>

          <div 
            className={`upload-zone ${csvFile ? 'has-file' : ''}`}
            onClick={() => document.getElementById('csv-upload').click()}
          >
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {csvFile ? (
              <>
                <CheckCircle size={48} className="text-success mb-3" />
                <h6 className="fw-bold mb-2">{csvFile.name}</h6>
                <p className="text-muted mb-0">{csvData.length} records found</p>
              </>
            ) : (
              <>
                <FileText size={48} className="text-muted mb-3" />
                <h6 className="fw-bold mb-2">Click to upload CSV file</h6>
                <p className="text-muted mb-0">or drag and drop</p>
              </>
            )}
          </div>

          {csvData.length > 0 && (
            <>
              <h6 className="fw-bold mt-4 mb-3">Preview ({csvData.length} records)</h6>
              <div className="data-preview">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      {Object.keys(csvData[0]).map(key => (
                        <th key={key} className="small">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="small">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && (
                  <p className="text-muted small text-center mt-2 mb-0">
                    Showing first 5 of {csvData.length} records
                  </p>
                )}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-primary flex-grow-1"
                  onClick={handleBulkAdd}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Import ${csvData.length} Records`}
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setCsvFile(null);
                    setCsvData([]);
                  }}
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bulk Delete Tab */}
      {activeTab === 'delete' && (
        <div>
          <div className="alert alert-warning d-flex align-items-start gap-3 mb-4">
            <AlertCircle size={24} className="flex-shrink-0 mt-1" />
            <div>
              <strong>Warning:</strong> This action cannot be undone. Please enter the IDs carefully.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Enter IDs to delete (comma-separated)
            </label>
            <textarea
              className="form-control"
              rows="6"
              placeholder="Example: 507f1f77bcf86cd799439011, 507f191e810c19729de860ea, ..."
              value={deleteIds}
              onChange={(e) => setDeleteIds(e.target.value)}
            />
            <small className="text-muted">
              Enter multiple IDs separated by commas
            </small>
          </div>

          {deleteIds.split(',').filter(id => id.trim()).length > 0 && (
            <div className="alert alert-info">
              <strong>{deleteIds.split(',').filter(id => id.trim()).length}</strong> records will be deleted
            </div>
          )}

          <button 
            className="btn btn-danger w-100"
            onClick={handleBulkDelete}
            disabled={processing || !deleteIds.trim()}
          >
            {processing ? 'Deleting...' : 'Delete Selected Records'}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BulkOperationsModal;