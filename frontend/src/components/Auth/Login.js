import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { loginUser, setAuthData, getDashboardPath, sendAadhaarOTP, verifyAadhaarOTP } from '../../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  // FORM DATA STATE
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("email");

  // 2FA OTP STATE
  const [show2FA, setShow2FA] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [tempLoginData, setTempLoginData] = useState(null);
  const [timer, setTimer] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };

      const data = await loginUser(payload);

      if (data.success) {
        // Store login data temporarily and show 2FA
        setTempLoginData(data);
        setShow2FA(true);
        setLoading(false);
      } else {
        setError(data.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setError(error.message || 'Cannot connect to server.');
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setError('Please enter valid 12-digit Aadhaar number');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const response = await sendAadhaarOTP({
        aadhaarNumber,
        userId: tempLoginData.userId
      });

      if (response.success) {
        setOtpSent(true);
        setTimer(60);

        // Start countdown
        const interval = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Show mock OTP in console for demo
        console.log('🔐 Mock OTP sent:', response.otp);
        alert(`Demo Mode: Your OTP is ${response.otp}`);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const response = await verifyAadhaarOTP({
        aadhaarNumber,
        otp,
        userId: tempLoginData.userId
      });

      if (response.success) {
        // Complete login
        setAuthData(tempLoginData);
        if (onLogin) onLogin();
        navigate(getDashboardPath(tempLoginData.role));
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (error) {
      setError(error.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSkip2FA = () => {
    // For demo - allow skip
    setAuthData(tempLoginData);
    if (onLogin) onLogin();
    navigate(getDashboardPath(tempLoginData.role));
  };

  // Quick login for demo
  const quickLogin = (role) => {
    const credentials = {
      admin: { email: 'apoorv@gmail.com', password: '12345678' },
      student: { email: 'unnatipal@gmail.com', password: '12345678' },
      institution: { email: 'iitb@gmail.com', password: '12345678' },
      faculty: { email: 'arpitmishra@gmail.com', password: '123456789' }
    };
    setFormData(credentials[role]);
  };

  // 2FA Modal
  if (show2FA) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4 p-md-5">

                  {/* Logo */}
                  <div className="text-center mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      }}
                    >
                      <Shield size={40} className="text-white" />
                    </div>
                    <h4 className="fw-bold mb-1">Two-Factor Authentication</h4>
                    <p className="text-muted small">Verify with Aadhaar OTP for secure login</p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-start py-2">
                      <AlertCircle size={18} className="me-2 mt-1" />
                      <small>{error}</small>
                    </div>
                  )}

                  {!otpSent ? (
                    // Aadhaar Input
                    <>
                      <div className="mb-4">
                        <label className="form-label small fw-semibold">Aadhaar Number</label>
                        <div className="position-relative">
                          <Shield
                            className="position-absolute top-50 translate-middle-y text-muted"
                            size={18}
                            style={{ left: '12px' }}
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter 12-digit Aadhaar"
                            value={aadhaarNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 12) {
                                setAadhaarNumber(value);
                                setError('');
                              }
                            }}
                            maxLength={12}
                            style={{ paddingLeft: '40px' }}
                          />
                        </div>
                        <small className="text-muted">
                          Demo: Enter any 12 digits (e.g., 123456789012)
                        </small>
                      </div>

                      <button
                        className="btn w-100 text-white mb-3"
                        onClick={handleSendOTP}
                        disabled={otpLoading || aadhaarNumber.length !== 12}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          padding: '10px'
                        }}
                      >
                        {otpLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Sending OTP...
                          </>
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </>
                  ) : (
                    // OTP Verification
                    <>
                      <div className="alert alert-success d-flex align-items-start py-2 mb-3">
                        <CheckCircle size={18} className="me-2 mt-1" />
                        <small>OTP sent to Aadhaar ****{aadhaarNumber.slice(-4)}</small>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-semibold">Enter OTP</label>
                        <input
                          type="text"
                          className="form-control text-center"
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 6) {
                              setOtp(value);
                              setError('');
                            }
                          }}
                          maxLength={6}
                          style={{ fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }}
                        />
                        {timer > 0 && (
                          <small className="text-muted d-block mt-2 text-center">
                            Resend OTP in {timer}s
                          </small>
                        )}
                        {timer === 0 && (
                          <button
                            className="btn btn-link btn-sm p-0 d-block mx-auto mt-2"
                            onClick={handleSendOTP}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      <button
                        className="btn w-100 text-white mb-2"
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || otp.length !== 6}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          padding: '10px'
                        }}
                      >
                        {otpLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </button>

                      <button
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          setAadhaarNumber('');
                          setTimer(0);
                        }}
                      >
                        Change Aadhaar Number
                      </button>
                    </>
                  )}

                  {/* Skip for Demo */}
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-link btn-sm text-muted"
                      onClick={handleSkip2FA}
                    >
                      Skip 2FA (Demo Only)
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Login Form
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4 p-md-5">

                {/* Logo */}
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <GraduationCap size={40} className="text-white" />
                  </div>
                  <h4 className="fw-bold mb-1">Welcome Back!</h4>
                  <p className="text-muted small">Sign in to your account</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-start py-2">
                    <AlertCircle size={18} className="me-2 mt-1" />
                    <small>{error}</small>
                  </div>
                )}

                {/* LOGIN FORM */}
                <form onSubmit={handleSubmit}>

                  {/* LOGIN MODE TOGGLE */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <button
                        type="button"
                        className={`btn btn-sm ${loginMode === "email" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setLoginMode("email")}
                        disabled={loading}
                      >
                        Email Login
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm ${loginMode === "aishe" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setLoginMode("aishe")}
                        disabled={loading}
                      >
                        AISHE Login
                      </button>
                    </div>

                    <label className="form-label small fw-semibold">
                      {loginMode === "email" ? "Email" : "AISHE Code"}
                    </label>

                    <div className="position-relative">
                      <Mail
                        className="position-absolute top-50 translate-middle-y text-muted"
                        size={18}
                        style={{ left: '12px' }}
                      />

                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        placeholder={
                          loginMode === "email"
                            ? "Enter your email"
                            : "Enter AISHE Code (e.g., U-0012)"
                        }
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '40px' }}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Password</label>
                    <div className="position-relative">
                      <Lock
                        className="position-absolute top-50 translate-middle-y text-muted"
                        size={18}
                        style={{ left: '12px' }}
                      />
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '40px' }}
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="btn w-100 text-white mb-3"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '10px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                </form>

                {/* QUICK LOGIN */}
                <div className="mb-3">
                  <p className="text-center text-muted small mb-2">Quick Demo Login</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={() => quickLogin('admin')} disabled={loading}>Admin</button>
                    <button className="btn btn-outline-success btn-sm flex-grow-1" onClick={() => quickLogin('student')} disabled={loading}>Student</button>
                    <button className="btn btn-outline-info btn-sm flex-grow-1" onClick={() => quickLogin('institution')} disabled={loading}>Institution</button>
                    <button className="btn btn-outline-warning btn-sm flex-grow-1" onClick={() => quickLogin('faculty')} disabled={loading}>Faculty</button>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <small className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                      Register
                    </Link>
                  </small>
                </div>

              </div>
            </div>

            <p className="text-center text-white small mt-4 mb-0">
              © 2025 Unified Education Interface
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;