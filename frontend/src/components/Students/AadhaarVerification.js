import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle, Send, Lock, Eye, EyeOff } from 'lucide-react';

const AadhaarVerification = ({ studentId, onVerificationComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mockOtp, setMockOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatAadhaar = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 12) {
      setAadhaarNumber(value);
      setError('');
    }
  };

  const validateAadhaar = () => {
    if (aadhaarNumber.length !== 12) {
      setError('Aadhaar number must be 12 digits');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateAadhaar()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/students/aadhaar/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, aadhaarNumber })
      });

      const data = await response.json();

      if (data.success) {
        setMockOtp(data.mockOtp); // Store mock OTP for display
        setStep(2);
        setTimer(120);
        setCanResend(false);

        // Show mock OTP in alert for testing
        alert(`Mock OTP: ${data.mockOtp}\n\nThis is for testing only. In production, OTP will be sent via SMS.`);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send OTP error:', err);
    }

    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/students/aadhaar/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, aadhaarNumber, otp: otpValue })
      });

      const data = await response.json();

      if (data.success) {
        setStep(3);
        setTimeout(() => {
          onVerificationComplete && onVerificationComplete();
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Verify OTP error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="aadhaar-verification">
      <style>{`
        .aadhaar-verification { max-width: 500px; margin: 0 auto; }
        .verification-step { text-align: center; padding: 30px; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .aadhaar-input {
          font-size: 24px; letter-spacing: 8px; text-align: center; font-family: monospace;
          padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; transition: all 0.2s ease;
        }
        .aadhaar-input:focus {
          border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); outline: none;
        }
        .otp-container { display: flex; gap: 12px; justify-content: center; margin: 24px 0; }
        .otp-input {
          width: 56px; height: 56px; text-align: center; font-size: 24px; font-weight: 600;
          border: 2px solid #e2e8f0; border-radius: 12px; transition: all 0.2s ease;
        }
        .otp-input:focus {
          border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); outline: none;
        }
        .shield-icon {
          width: 80px; height: 80px; margin: 0 auto 20px; padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }
        .success-icon {
          width: 100px; height: 100px; margin: 0 auto 20px; padding: 25px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3); animation: scaleIn 0.5s ease;
        }
        @keyframes scaleIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .timer {
          display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
          background: #f1f5f9; border-radius: 20px; font-weight: 600; color: #667eea;
        }
        .security-note {
          background: #f8fafc; border-left: 4px solid #667eea; padding: 12px 16px;
          border-radius: 8px; text-align: left; margin-top: 20px;
        }
        .mock-otp-display {
          background: #fef3c7; border: 2px solid #f59e0b; padding: 12px;
          border-radius: 8px; margin-bottom: 16px;
        }
      `}</style>

      {step === 1 && (
        <div className="verification-step">
          <div className="shield-icon">
            <Shield size={40} color="white" />
          </div>
          <h4 className="fw-bold mb-2">Aadhaar Verification (Mock)</h4>
          <p className="text-muted mb-4">
            Enter any 12-digit number as Aadhaar for testing
          </p>

          <div className="position-relative mb-3">
            <input
              type={showAadhaar ? 'text' : 'password'}
              className="form-control aadhaar-input"
              placeholder="XXXX XXXX XXXX"
              value={formatAadhaar(aadhaarNumber)}
              onChange={handleAadhaarChange}
              maxLength={14}
            />
            <button
              className="btn btn-link position-absolute"
              style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setShowAadhaar(!showAadhaar)}
            >
              {showAadhaar ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary w-100 py-3 fw-semibold"
            onClick={handleSendOTP}
            disabled={loading || aadhaarNumber.length !== 12}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Sending OTP...
              </>
            ) : (
              <>
                <Send size={20} className="me-2" />
                Send Mock OTP
              </>
            )}
          </button>

          <div className="security-note">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Lock size={16} className="text-primary" />
              <strong className="small">Mock Verification Mode</strong>
            </div>
            <p className="small text-muted mb-0">
              This is a mock implementation for testing. In production, real Aadhaar API will be integrated.
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="verification-step">
          <div className="shield-icon">
            <Shield size={40} color="white" />
          </div>
          <h4 className="fw-bold mb-2">Enter OTP</h4>
          <p className="text-muted mb-3">
            Enter the 6-digit OTP shown in the alert
          </p>

          {mockOtp && (
            <div className="mock-otp-display">
              <strong className="text-warning">Mock OTP: {mockOtp}</strong>
              <p className="small mb-0 mt-1 text-muted">For testing only</p>
            </div>
          )}

          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary w-100 py-3 fw-semibold mb-3"
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle size={20} className="me-2" />
                Verify OTP
              </>
            )}
          </button>

          <div className="d-flex justify-content-center align-items-center gap-2">
            {!canResend ? (
              <div className="timer">
                <span>Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
              </div>
            ) : (
              <button className="btn btn-link" onClick={handleSendOTP}>
                Resend OTP
              </button>
            )}
          </div>

          <button className="btn btn-link mt-3" onClick={() => setStep(1)}>
            Change Aadhaar Number
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="verification-step">
          <div className="success-icon">
            <CheckCircle size={50} color="white" />
          </div>
          <h4 className="fw-bold mb-2 text-success">Verification Successful!</h4>
          <p className="text-muted mb-4">
            Aadhaar has been successfully verified (Mock)
          </p>

          <div className="card border-0 bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Aadhaar Number</span>
                <strong>{formatAadhaar(aadhaarNumber).replace(/\d(?=\d{4})/g, 'X')}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Verified On</span>
                <strong>{new Date().toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          <button
            className="btn btn-success w-100 py-3 fw-semibold mt-4"
            onClick={onClose}
          >
            Continue to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default AadhaarVerification;