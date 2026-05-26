import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStudents } from '../data/mockStudents';
import { mockInstitutions } from '../data/mockInstitutions';
import { mockTeachers } from '../data/mockTeachers';
import { mockUsers } from '../data/mockUsers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage or use mock data
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : mockStudents;
  });

  const [institutions, setInstitutions] = useState(() => {
    const saved = localStorage.getItem('institutions');
    return saved ? JSON.parse(saved) : mockInstitutions;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : mockTeachers;
  });

  const [users] = useState(mockUsers);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'admin';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  // Authentication functions
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole('admin');
    localStorage.removeItem('currentUser');
  };

  // Student CRUD operations
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Math.max(...students.map(s => s.id), 0) + 1,
      status: 'active'
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const getStudentByApaarId = (apaarId) => {
    return students.find(s => s.apaarId.toLowerCase() === apaarId.toLowerCase());
  };

  // Institution CRUD operations
  const addInstitution = (institution) => {
    const newInstitution = {
      ...institution,
      id: Math.max(...institutions.map(i => i.id), 0) + 1,
      status: 'active'
    };
    setInstitutions([...institutions, newInstitution]);
    return newInstitution;
  };

  const updateInstitution = (id, updatedData) => {
    setInstitutions(institutions.map(i => i.id === id ? { ...i, ...updatedData } : i));
  };

  const deleteInstitution = (id) => {
    setInstitutions(institutions.filter(i => i.id !== id));
  };

  const getInstitutionByAisheCode = (aisheCode) => {
    return institutions.find(i => i.aisheCode.toLowerCase() === aisheCode.toLowerCase());
  };

  // Teacher CRUD operations
  const addTeacher = (teacher) => {
    const newTeacher = {
      ...teacher,
      id: Math.max(...teachers.map(t => t.id), 0) + 1,
      status: 'active'
    };
    setTeachers([...teachers, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const getTeacherByAparId = (aparId) => {
    return teachers.find(t => t.aparId.toLowerCase() === aparId.toLowerCase());
  };

  // Analytics functions
  const getStudentStats = () => {
    return {
      total: students.length,
      avgCGPA: (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2),
      active: students.filter(s => s.status === 'active').length,
      byCourse: students.reduce((acc, s) => {
        acc[s.course] = (acc[s.course] || 0) + 1;
        return acc;
      }, {})
    };
  };

  const getInstitutionStats = () => {
    return {
      total: institutions.length,
      avgNIRF: (institutions.reduce((sum, i) => sum + i.nirfScore, 0) / institutions.length).toFixed(2),
      avgCompliance: (institutions.reduce((sum, i) => sum + i.compliance, 0) / institutions.length).toFixed(2),
      topRanked: institutions.sort((a, b) => a.ranking - b.ranking).slice(0, 5)
    };
  };

  const getTeacherStats = () => {
    return {
      total: teachers.length,
      avgPublications: (teachers.reduce((sum, t) => sum + t.publications, 0) / teachers.length).toFixed(0),
      avgRating: (teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(2),
      byDepartment: teachers.reduce((acc, t) => {
        acc[t.department] = (acc[t.department] || 0) + 1;
        return acc;
      }, {})
    };
  };

  const value = {
    // State
    students,
    institutions,
    teachers,
    users,
    currentUser,
    userRole,
    
    // Auth
    login,
    logout,
    setUserRole,
    
    // Student operations
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentByApaarId,
    
    // Institution operations
    addInstitution,
    updateInstitution,
    deleteInstitution,
    getInstitutionByAisheCode,
    
    // Teacher operations
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherByAparId,
    
    // Analytics
    getStudentStats,
    getInstitutionStats,
    getTeacherStats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};