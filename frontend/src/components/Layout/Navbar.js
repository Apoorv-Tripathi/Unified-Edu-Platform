import React, { useState } from 'react';
import { GraduationCap, Bell, LogOut, Menu, X, Settings, User } from 'lucide-react';

const Navbar = ({ currentUser, onLogout, sidebarOpen, setSidebarOpen }) => {
  const userRole = currentUser?.role || 'student';
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar-enhanced py-3 sticky-top">
      <style>{`
        .navbar-enhanced {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }
        .logo-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 15px;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .user-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .notification-bell {
          position: relative;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        .notification-bell:hover {
          background: rgba(102, 126, 234, 0.1);
        }
        .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          min-width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
          animation: pulse 2s ease infinite;
        }
        .menu-toggle {
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        .menu-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.2);
        }
        .logout-btn {
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          border: 2px solid #ef4444;
          background: white;
          color: #ef4444;
        }
        .logout-btn:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .dropdown-menu-custom {
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 8px;
          min-width: 240px;
        }
        .dropdown-item-custom {
          border-radius: 8px;
          padding: 10px 16px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dropdown-item-custom:hover {
          background: rgba(102, 126, 234, 0.08);
        }
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .role-admin { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        .role-institution { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .role-student { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        .role-faculty { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
      `}</style>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-dark p-0 d-lg-none menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h5 className="mb-0 logo-text d-flex align-items-center gap-2">
              <GraduationCap size={32} />
              <span className="d-none d-md-inline">Unified Education Interface</span>
              <span className="d-inline d-md-none">UEI</span>
            </h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} className="text-muted" />
              <span className="notification-badge">3</span>
            </div>

            {/* User Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-link p-0 d-flex align-items-center gap-3 text-decoration-none"
                data-bs-toggle="dropdown"
              >
                <div className="user-avatar">
                  {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold text-dark small">{currentUser?.name || 'User'}</div>
                  <span className={`role-badge role-${userRole}`}>{userRole}</span>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom mt-2">
                <li className="px-3 py-2">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                      {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-semibold">{currentUser?.name || 'User'}</div>
                      <div className="small text-muted">{currentUser?.email}</div>
                    </div>
                  </div>
                </li>
                <li><hr className="dropdown-divider my-2" /></li>
                <li>
                  <button className="dropdown-item dropdown-item-custom">
                    <User size={18} />
                    <span>My Profile</span>
                  </button>
                </li>
                <li>
                  <button className="dropdown-item dropdown-item-custom">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </li>
                <li><hr className="dropdown-divider my-2" /></li>
                <li>
                  <button className="dropdown-item dropdown-item-custom text-danger" onClick={onLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Visible Logout Button */}
            <button className="logout-btn d-none d-lg-flex align-items-center gap-2" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;