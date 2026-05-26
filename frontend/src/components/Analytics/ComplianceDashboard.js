import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Award, TrendingUp, FileCheck, Shield } from 'lucide-react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const ComplianceDashboard = () => {
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInstitution, setSelectedInstitution] = useState('all');

  useEffect(() => {
    loadComplianceData();
  }, [selectedInstitution]);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/analytics/compliance/${selectedInstitution}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setComplianceData(data.data);
      }
    } catch (error) {
      console.error('Compliance load error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading compliance data..." />;
  }

  if (!complianceData) {
    return (
      <div className="text-center py-5">
        <AlertTriangle size={64} className="text-warning mb-3" />
        <h4>No Compliance Data</h4>
        <p className="text-muted">Compliance data will appear once institution metrics are available.</p>
      </div>
    );
  }

  // If viewing specific institution
  if (complianceData.institution) {
    const { institution, naac, nirf, compliance } = complianceData;

    const naacCriteriaData = [
      { subject: 'Teaching & Learning', value: parseFloat(naac.criteria.teachingLearning) },
      { subject: 'Research', value: parseFloat(naac.criteria.researchInnovation) },
      { subject: 'Infrastructure', value: parseFloat(naac.criteria.infrastructure) },
      { subject: 'Student Support', value: parseFloat(naac.criteria.studentSupport) },
      { subject: 'Governance', value: parseFloat(naac.criteria.governance) }
    ];

    const nirfParametersData = [
      { name: 'TLR', value: parseFloat(nirf.parameters.tlr), fullName: 'Teaching Learning Resources' },
      { name: 'RP', value: parseFloat(nirf.parameters.rp), fullName: 'Research & Professional Practice' },
      { name: 'GO', value: parseFloat(nirf.parameters.go), fullName: 'Graduation Outcomes' },
      { name: 'OI', value: parseFloat(nirf.parameters.oi), fullName: 'Outreach & Inclusivity' },
      { name: 'Perception', value: parseFloat(nirf.parameters.perception), fullName: 'Perception' }
    ];

    return (
      <div>
        <style>{`
          .compliance-card {
            border-radius: 12px;
            transition: all 0.3s ease;
          }
          .compliance-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          }
          .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-compliant {
            background: #d1fae5;
            color: #065f46;
          }
          .status-non-compliant {
            background: #fee2e2;
            color: #991b1b;
          }
          .status-needs-improvement {
            background: #fef3c7;
            color: #92400e;
          }
          .gradient-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        `}</style>

        {/* Header */}
        <div className="card border-0 shadow-sm mb-4 gradient-primary">
          <div className="card-body p-4 text-white">
            <h4 className="fw-bold mb-2">📋 Compliance Dashboard</h4>
            <p className="mb-0 opacity-90">{institution.name} - {institution.location}</p>
          </div>
        </div>

        {/* NAAC & NIRF Overview */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm compliance-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                    <Award size={32} className="text-success" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">NAAC Accreditation</h5>
                    <p className="text-muted small mb-0">National Assessment and Accreditation Council</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="h1 fw-bold text-success mb-0">{naac.score}</div>
                    <small className="text-muted">Score out of 100</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success px-4 py-2" style={{ fontSize: '18px' }}>
                      Grade: {naac.grade}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm compliance-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 bg-primary bg-opacity-10 rounded-circle">
                    <TrendingUp size={32} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">NIRF Ranking</h5>
                    <p className="text-muted small mb-0">National Institutional Ranking Framework</p>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="h1 fw-bold text-primary mb-0">{nirf.overallScore}</div>
                    <small className="text-muted">Overall Score</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary px-4 py-2" style={{ fontSize: '18px' }}>
                      Rank: {nirf.ranking}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAAC Criteria Radar Chart */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">NAAC Criteria Assessment</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={naacCriteriaData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" style={{ fontSize: '12px' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: '12px' }} />
                    <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.5} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* NIRF Parameters Bar Chart */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">NIRF Parameters Breakdown</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nirfParametersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value, name, props) => [value, props.payload.fullName]}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {nirfParametersData.map((entry, index) => (
                        <Cell key={index} fill={['#667eea', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'][index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Checks */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0">Compliance Parameters</h5>
              <span className="badge bg-primary px-3 py-2">
                Overall: {compliance.overallCompliance}%
              </span>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              {compliance.checks.map((check, idx) => {
                const statusClass =
                  check.status === 'Compliant' ? 'status-compliant' :
                    check.status === 'Non-Compliant' ? 'status-non-compliant' :
                      'status-needs-improvement';

                const Icon = check.status === 'Compliant' ? CheckCircle :
                  check.status === 'Non-Compliant' ? XCircle : AlertTriangle;

                return (
                  <div key={idx} className="col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-start gap-3">
                          <Icon size={24} className={
                            check.status === 'Compliant' ? 'text-success' :
                              check.status === 'Non-Compliant' ? 'text-danger' : 'text-warning'
                          } />
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-2">{check.parameter}</h6>
                            <p className="small text-muted mb-2">{check.description}</p>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className={`status-badge ${statusClass}`}>
                                {check.status}
                              </span>
                              <div className="text-end">
                                <div className="fw-bold">{check.score.toFixed(1)}%</div>
                                <small className="text-muted">Threshold: {check.threshold}%</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit Information */}
            <div className="mt-4 p-3 bg-light rounded">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <FileCheck size={20} className="text-primary" />
                    <div>
                      <small className="text-muted d-block">Last Audit</small>
                      <strong>{new Date(compliance.lastAuditDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <Shield size={20} className="text-success" />
                    <div>
                      <small className="text-muted d-block">Next Audit</small>
                      <strong>{new Date(compliance.nextAuditDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view - all institutions summary
  return (
    <div>
      <style>{`
        .compliance-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .compliance-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body p-4 text-white">
          <h4 className="fw-bold mb-2">📋 Institutional Compliance Overview</h4>
          <p className="mb-0 opacity-90">NAAC & NIRF metrics across all institutions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm compliance-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-primary bg-opacity-10 rounded-circle">
                  <Award size={32} className="text-primary" />
                </div>
                <div>
                  <div className="h3 fw-bold text-primary mb-1">{complianceData.summary.totalInstitutions}</div>
                  <small className="text-muted">Total Institutions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm compliance-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <div>
                  <div className="h3 fw-bold text-success mb-1">{complianceData.summary.naacAccredited}</div>
                  <small className="text-muted">NAAC Accredited</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm compliance-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-warning bg-opacity-10 rounded-circle">
                  <TrendingUp size={32} className="text-warning" />
                </div>
                <div>
                  <div className="h3 fw-bold text-warning mb-1">{complianceData.summary.nirfRanked}</div>
                  <small className="text-muted">NIRF Ranked (Top 200)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="fw-bold mb-0">Institution Compliance Summary</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Institution</th>
                  <th>Location</th>
                  <th>NAAC Grade</th>
                  <th>NIRF Score</th>
                  <th>Ranking</th>
                  <th>Compliance</th>
                  <th>Students</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.institutions.map((inst, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold">{inst.name}</td>
                    <td>{inst.location}</td>
                    <td><span className="badge bg-success">{inst.naacGrade}</span></td>
                    <td><strong className="text-primary">{inst.nirfScore}</strong></td>
                    <td><span className="badge bg-warning text-dark">{inst.nirfRanking}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress" style={{ width: '100px', height: '8px' }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${inst.compliance}%` }}
                          ></div>
                        </div>
                        <small className="fw-semibold">{inst.compliance}%</small>
                      </div>
                    </td>
                    <td>{inst.students}</td>
                    <td>{inst.faculty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;