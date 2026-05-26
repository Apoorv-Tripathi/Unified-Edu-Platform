import React, { useState } from 'react';
import {
  TrendingUp, GraduationCap, Building, UserCheck, Settings,
  MessageCircle, X, Send, Maximize2, Minimize2, BarChart3, AlertTriangle
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
const roleMenuConfig = {
  admin: [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'students', icon: GraduationCap, label: 'Students' },
    { id: 'institutions', icon: Building, label: 'Institutions' },
    { id: 'teachers', icon: UserCheck, label: 'Faculty' },
    { id: 'schemes-admin', icon: Settings, label: 'Schemes' },
    { id: 'admin', icon: Settings, label: 'Admin Panel', isAdmin: true },
  ],
  institution: [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'students', icon: GraduationCap, label: 'My Students' },
    { id: 'teachers', icon: UserCheck, label: 'My Faculty' },
    // { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'institution-schemes', icon: Settings, label: 'Schemes', route: '/institution/schemes' }
  ],
  faculty: [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'faculty-analytics', icon: BarChart3, label: 'My Analytics' },
    { id: 'students', icon: GraduationCap, label: 'My Students' },
  ],
  student: [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    // { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'institutions', icon: Building, label: 'Institutions' },
    { id: 'teachers', icon: UserCheck, label: 'Faculty' },
  ],
};

const Sidebar = ({ currentView, setCurrentView, userRole, sidebarOpen, setSearchQuery }) => {
  const menuItems = roleMenuConfig[userRole] || roleMenuConfig.student;
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hi! I am EduGuide AI, your educational assistant. I can help with academics, college questions, career guidance, and more. How can I help you today? 😊 ' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    setChatMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setChatInput("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setChatMessages(prev => [...prev, { type: "bot", text: data.reply }]);

    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        { type: "bot", text: "❌ Error connecting to AI server." }
      ]);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!sidebarOpen) return null;

  return (
    <>
      <div
        className="bg-white shadow-sm"
        style={{
          width: '280px',
          height: 'calc(100vh - 68px)',
          position: 'sticky',
          top: '68px',
          overflowY: 'auto',
          flexShrink: 0,
          zIndex: 50
        }}
      >
        <style>{`
          .sidebar-item {
            padding: 14px 20px;
            margin: 6px 12px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 14px;
            position: relative;
            color: #64748b;
            font-weight: 500;
          }
          .sidebar-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 0 4px 4px 0;
            transition: height 0.2s ease;
          }
          .sidebar-item:hover {
            background: rgba(102, 126, 234, 0.08);
            color: #667eea;
            padding-left: 24px;
            transform: translateX(4px);
          }
          .sidebar-item:hover::before {
            height: 70%;
          }
          .sidebar-item.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          .sidebar-item.active::before {
            height: 100%;
            background: white;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            position: relative;
            display: inline-block;
          }
          .status-dot::before {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: inherit;
            opacity: 0.3;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .chat-button {
            position: fixed;
            bottom: 24px;
            left: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
          }
          .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
          }
          .chat-window {
            position: fixed;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            z-index: 1001;
            animation: slideUp 0.3s ease;
            transition: all 0.3s ease;
          }
          .chat-window.small {
            bottom: 100px;
            left: 24px;
            width: 380px;
            height: 500px;
          }
          .chat-window.fullscreen {
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1200px;
            height: calc(100vh - 100px);
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .chat-message {
            padding: 12px 16px;
            border-radius: 16px;
            max-width: 80%;
            animation: messageSlide 0.2s ease;
          }
          @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .chat-message.user {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            align-self: flex-end;
            border-radius: 16px 16px 4px 16px;
          }
          .chat-message.bot {
            background: #f1f5f9;
            color: #1e293b;
            align-self: flex-start;
            border-radius: 16px 16px 16px 4px;
          }
          .chat-input-container {
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 8px;
          }
          .chat-input {
            flex: 1;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            outline: none;
            transition: all 0.2s ease;
          }
          .chat-input:focus {
            border-color: #667eea;
          }
          .chat-send-btn {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .chat-send-btn:hover {
            transform: scale(1.05);
          }
          .icon-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .icon-btn:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>

        <div className="p-4">
          <p className="text-muted small text-uppercase fw-bold mb-3 px-2">Navigation</p>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {item.isAdmin && <p className="text-muted small text-uppercase fw-bold mb-3 mt-4 px-2">Administration</p>}
                <div
                  className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView(item.id);        // ⭐ ALWAYS use currentView
                    setSearchQuery('');
                  }}
                >
                  <Icon size={22} /> <span>{item.label}</span>
                </div>
              </div>
            );
          })}
          {/* Admin-only: Lifecycle Verifications */}
          {userRole === 'admin' && (
            <div
              className={`sidebar-item ${currentView === 'lifecycle-verifications' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('lifecycle-verifications');
                setSearchQuery('');
              }}
            >
              <AlertTriangle size={22} />
              <span>Lifecycle Verifications</span>
            </div>
          )}
          <div className="mt-5 px-2">
            <p className="text-muted small text-uppercase fw-bold mb-3">System Status</p>
            <div className="card border-0 bg-light mb-3">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="status-dot"></div>
                  <span className="small fw-semibold text-success">All Systems Operational</span>
                </div>
                <div className="small text-muted">Last updated: Just now</div>
              </div>
            </div>

            <div className="card border-0 bg-gradient-primary text-white">
              <div className="card-body p-3">
                <div className="small opacity-90 mb-1">Need Help?</div>
                <div className="fw-semibold mb-2">Chat with AI Assistant</div>
                <button
                  className="btn btn-light btn-sm w-100"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle size={16} className="me-2" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <button className="chat-button" onClick={() => setShowChat(true)}>
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className={`chat-window ${isFullscreen ? 'fullscreen' : 'small'}`}>
          <div className="chat-header">
            <div>
              <h6 className="mb-0 fw-bold">AI Assistant</h6>
              <small className="opacity-90">Always here to help</small>
            </div>
            <div className="d-flex gap-2">
              <button className="icon-btn" onClick={toggleFullscreen} title={isFullscreen ? "Minimize" : "Maximize"}>
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button className="icon-btn" onClick={() => setShowChat(false)}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="chat-send-btn" onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;