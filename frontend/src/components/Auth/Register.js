import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Briefcase } from 'lucide-react';
import { registerUser, registerFaculty } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    designation: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (form.role === "faculty") {
        // Faculty API
        response = await registerFaculty({
          name: form.name,
          email: form.email,
          password: form.password,
          department: form.department,
          designation: form.designation
        });
      } else {
        // Admin / Institution / Student API
        response = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        });
      }

      if (!response.success) {
        setError(response.message || "Registration failed");
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError("Server error");
    }

    setLoading(false);
  };

  const facultyFields = form.role === "faculty";

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
              <div className="card-body p-4 p-md-5">

                {/* Logo */}
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    }}
                  >
                    <GraduationCap size={40} className="text-white" />
                  </div>
                  <h4 className="fw-bold mb-1">Create an Account</h4>
                  <p className="text-muted small">Register to continue</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <div className="position-relative">
                      <User className="position-absolute top-50 translate-middle-y text-muted" size={18} style={{ left: "12px" }} />
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email</label>
                    <div className="position-relative">
                      <Mail className="position-absolute top-50 translate-middle-y text-muted" size={18} style={{ left: "12px" }} />
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Password</label>
                    <div className="position-relative">
                      <Lock className="position-absolute top-50 translate-middle-y text-muted" size={18} style={{ left: "12px" }} />
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Create password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: "40px" }}
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Register As</label>
                    <select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="institution">Institution</option>
                      <option value="admin">Admin</option>
                      <option value="faculty">Faculty</option> {/* NEW */}
                    </select>
                  </div>

                  {/* Faculty Fields */}
                  {facultyFields && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Department</label>
                        <div className="position-relative">
                          <Briefcase className="position-absolute top-50 translate-middle-y text-muted" size={18} style={{ left: "12px" }} />
                          <input
                            type="text"
                            className="form-control"
                            name="department"
                            placeholder="Enter department"
                            value={form.department}
                            onChange={handleChange}
                            required={facultyFields}
                            style={{ paddingLeft: "40px" }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Designation</label>
                        <select
                          className="form-select"
                          name="designation"
                          value={form.designation}
                          onChange={handleChange}
                          required={facultyFields}
                        >
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Professor">Professor</option>
                          <option value="Lecturer">Lecturer</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn w-100 text-white mt-2"
                    disabled={loading}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      padding: "10px"
                    }}
                  >
                    {loading ? "Processing..." : "Register"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Login
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

export default Register;