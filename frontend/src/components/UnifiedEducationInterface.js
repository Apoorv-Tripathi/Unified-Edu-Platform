import React, { useState, useEffect } from 'react';
import Navbar from './Layout/Navbar';
import Sidebar from './Layout/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import StudentList from './Students/StudentList';
import StudentProfile from './Students/StudentProfile';
import InstitutionList from './Institutions/InstitutionList';
import InstitutionProfile from './Institutions/InstitutionProfile';
import TeacherList from './Teachers/TeacherList';
import TeacherProfile from './Teachers/TeacherProfile';
import AdminPanel from './Admin/AdminPanel';
import InstitutionDashboard from './Dashboard/InstitutionDashboard';
import FacultyDashboard from './Dashboard/FacultyDashboard';
import StudentFormModal from './Students/StudentFormModal';
import InstitutionFormModal from './Institutions/InstitutionFormModal';
import TeacherFormModal from './Teachers/TeacherFormModal';
import DeleteModal from './Common/DeleteModal';
import StudentDashboard from './Dashboard/StudentDashboard';
import AnalyticsDashboard from './Analytics/AnalyticsDashboard';
import InstitutionAnalyticsDashboard from './Analytics/InstitutionAnalyticsDashboard';
import FacultyAnalytics from './Dashboard/FacultyDashboard';
import StudentPersonalAnalytics from './Analytics/StudentPersonalAnalytics';
import AdminSchemeDashboard from './Dashboard/AdminSchemeDashboard';
import InstitutionSchemeDashboard from './Dashboard/InstitutionSchemeDashboard';
import AdminLifecycleVerifications from './Admin/AdminVerificationPanel';

import {
  getCurrentUser,
  fetchStudents,
  fetchInstitutions,
  fetchTeachers,
  fetchStudentStats,
  fetchInstitutionStats,
  fetchTeacherStats,
  createStudent,
  updateStudent,
  deleteStudent,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../services/api';

const initialStudentForm = {
  name: '',
  email: '',
  course: '',
  semester: 1,
  cgpa: 0,
  attendance: 0,
  assignments: 0,
  achievements: '',
  schemes: '',
};

const initialInstitutionForm = {
  name: '',
  shortName: '',
  aisheCode: '',
  location: '',
  type: 'Private',
  accreditation: 'NAAC A',
  nirfScore: 0,
  ranking: 0,
  compliance: 0,
  students: 0,
  faculty: 0,
  departments: 0,
  established: 2000,
  placement: 0,
};

const initialTeacherForm = {
  name: '',
  email: '',
  department: '',
  designation: 'Assistant Professor',
  publications: 0,
  projects: 0,
  hIndex: 0,
  experience: 0,
  rating: 0,
  specializations: '',
};

const UnifiedEducationInterface = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({
    students: {},
    institutions: {},
    teachers: {},
  });

  // ⭐ NEW: map institutions by id so we always have stable data for profile
  const [institutionMap, setInstitutionMap] = useState({});

  const [loading, setLoading] = useState({
    students: false,
    institutions: false,
    teachers: false,
    stats: false,
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [institutionForm, setInstitutionForm] = useState(initialInstitutionForm);
  const [teacherForm, setTeacherForm] = useState(initialTeacherForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  const [formLoading, setFormLoading] = useState(false);

  const currentUser = getCurrentUser();
  const userRole = currentUser.role || 'student';

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (currentView === 'students') loadStudents();
    if (currentView === 'institutions') loadInstitutions();
    if (currentView === 'teachers') loadTeachers();
  }, [currentView]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const [studentRes, institutionRes, teacherRes] = await Promise.all([
        fetchStudentStats().catch(() => ({ data: {} })),
        fetchInstitutionStats().catch(() => ({ data: {} })),
        fetchTeacherStats().catch(() => ({ data: {} })),
      ]);
      setStats({
        students: studentRes.data || {},
        institutions: institutionRes.data || {},
        teachers: teacherRes.data || {},
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
    setLoading(prev => ({ ...prev, stats: false }));
  };

  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const res = await fetchStudents({ search: searchQuery });
      console.log('Students response:', res);

      if (res.success && Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res)) {
        setStudents(res);
      } else {
        console.error('Unexpected response format:', res);
        setStudents([]);
      }
    } catch (err) {
      console.error('Load students error:', err);
      setError('Failed to load students');
      setStudents([]);
    }
    setLoading(prev => ({ ...prev, students: false }));
  };

  // ⭐ UPDATED: loadInstitutions now also builds institutionMap
  const loadInstitutions = async () => {
    setLoading(prev => ({ ...prev, institutions: true }));
    try {
      const res = await fetchInstitutions({ search: searchQuery });
      console.log('Institutions response:', res);

      let list = [];

      if (res?.success && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res)) {
        list = res;
      } else {
        console.warn('Unexpected institutions response shape, using empty list');
        list = [];
      }

      setInstitutions(list);

      // ⭐ store by id so we can always reliably get the full institution object
      const map = {};
      list.forEach(inst => {
        if (inst && inst._id) {
          map[inst._id] = inst;
        }
      });
      setInstitutionMap(map);

    } catch (err) {
      console.error('Load institutions error:', err);
      setError('Failed to load institutions');
      setInstitutions([]);
      setInstitutionMap({});
    }
    setLoading(prev => ({ ...prev, institutions: false }));
  };

  const loadTeachers = async () => {
    setLoading(prev => ({ ...prev, teachers: true }));
    try {
      const res = await fetchTeachers({ search: searchQuery });
      console.log('Teachers response:', res);

      if (res.success && Array.isArray(res.data)) {
        setTeachers(res.data);
      } else if (Array.isArray(res.data)) {
        setTeachers(res.data);
      } else if (Array.isArray(res)) {
        setTeachers(res);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Load teachers error:', err);
      setError('Failed to load teachers');
      setTeachers([]);
    }
    setLoading(prev => ({ ...prev, teachers: false }));
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setCurrentView('student-profile');
  };

  // ⭐ UPDATED: always resolve the latest institution object from institutionMap
  const handleViewInstitutionProfile = (institution) => {
    if (!institution) return;
    const fullInst = institutionMap[institution._id] || institution;
    setSelectedInstitution(fullInst);
    setCurrentView('institution-profile');
  };

  const handleViewTeacherProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setCurrentView('teacher-profile');
  };

  const handleBackToList = (listType) => {
    setCurrentView(listType);
    setSelectedStudent(null);
    setSelectedInstitution(null);
    setSelectedTeacher(null);
  };

  const handleAddStudent = () => {
    setStudentForm(initialStudentForm);
    setEditingId(null);
    setShowStudentModal(true);
  };

  const handleEditStudent = (student) => {
    setStudentForm({
      name: student.name || '',
      email: student.email || '',
      course: student.course || '',
      semester: student.semester || 1,
      cgpa: student.cgpa || 0,
      attendance: student.attendance || 0,
      assignments: student.assignments || 0,
      achievements: student.achievements?.join(', ') || '',
      schemes: student.schemes?.join(', ') || '',
    });
    setEditingId(student._id);
    setShowStudentModal(true);
  };

  const handleSaveStudent = async () => {
    setFormLoading(true);
    try {
      const data = {
        ...studentForm,
        achievements: studentForm.achievements
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        schemes: studentForm.schemes
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };

      let res;
      if (editingId) {
        res = await updateStudent(editingId, data);
      } else {
        res = await createStudent(data);
      }

      if (res.success) {
        setSuccessMsg(
          editingId ? 'Student updated successfully!' : 'Student created successfully!'
        );
        setShowStudentModal(false);
        loadStudents();
        loadStats();
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save student');
    }
    setFormLoading(false);
  };

  const handleAddInstitution = () => {
    setInstitutionForm(initialInstitutionForm);
    setEditingId(null);
    setShowInstitutionModal(true);
  };

  const handleEditInstitution = (inst) => {
    setInstitutionForm({
      name: inst.name || '',
      shortName: inst.shortName || '',
      aisheCode: inst.aisheCode || '',
      location: inst.location || '',
      type: inst.type || 'Private',
      accreditation: inst.accreditation || 'NAAC A',
      nirfScore: inst.nirfScore || 0,
      ranking: inst.ranking || 0,
      compliance: inst.compliance || 0,
      students: inst.students || 0,
      faculty: inst.faculty || 0,
      departments: inst.departments || 0,
      established: inst.established || 2000,
      placement: inst.placement || 0,
    });
    setEditingId(inst._id);
    setShowInstitutionModal(true);
  };

  const handleSaveInstitution = async () => {
    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await updateInstitution(editingId, institutionForm);
      } else {
        res = await createInstitution(institutionForm);
      }

      if (res.success) {
        setSuccessMsg(editingId ? 'Institution updated!' : 'Institution created!');
        setShowInstitutionModal(false);
        loadInstitutions();
        loadStats();
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save institution');
    }
    setFormLoading(false);
  };

  const handleAddTeacher = () => {
    setTeacherForm(initialTeacherForm);
    setEditingId(null);
    setShowTeacherModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setTeacherForm({
      name: teacher.name || '',
      email: teacher.email || '',
      department: teacher.department || '',
      designation: teacher.designation || 'Assistant Professor',
      publications: teacher.publications || 0,
      projects: teacher.projects || 0,
      hIndex: teacher.hIndex || 0,
      experience: teacher.experience || 0,
      rating: teacher.rating || 0,
      specializations: teacher.specializations?.join(', ') || '',
    });
    setEditingId(teacher._id);
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async () => {
    setFormLoading(true);
    try {
      const data = {
        ...teacherForm,
        specializations: teacherForm.specializations
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };

      let res;
      if (editingId) {
        res = await updateTeacher(editingId, data);
      } else {
        res = await createTeacher(data);
      }

      if (res.success) {
        setSuccessMsg(editingId ? 'Faculty updated!' : 'Faculty created!');
        setShowTeacherModal(false);
        loadTeachers();
        loadStats();
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save teacher');
    }
    setFormLoading(false);
  };

  const handleDeleteClick = (type, id, name) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setFormLoading(true);
    try {
      let res;
      if (deleteTarget.type === 'student') res = await deleteStudent(deleteTarget.id);
      if (deleteTarget.type === 'institution')
        res = await deleteInstitution(deleteTarget.id);
      if (deleteTarget.type === 'teacher') res = await deleteTeacher(deleteTarget.id);

      if (res?.success) {
        setSuccessMsg(`${deleteTarget.type} deleted successfully!`);
        setShowDeleteModal(false);

        if (currentView.includes('profile')) {
          if (deleteTarget.type === 'student') {
            handleBackToList('students');
          } else if (deleteTarget.type === 'institution') {
            handleBackToList('institutions');
          } else if (deleteTarget.type === 'teacher') {
            handleBackToList('teachers');
          }
        }

        if (deleteTarget.type === 'student') loadStudents();
        if (deleteTarget.type === 'institution') loadInstitutions();
        if (deleteTarget.type === 'teacher') loadTeachers();
        loadStats();
      } else {
        setError(res?.message || 'Delete failed');
      }
    } catch (err) {
      setError('Failed to delete');
    }
    setFormLoading(false);
  };

  const handleSearch = () => {
    if (currentView === 'students') loadStudents();
    if (currentView === 'institutions') loadInstitutions();
    if (currentView === 'teachers') loadTeachers();
  };

  const bulkOperations = {
    bulkAdd: async (type, data) => {
      setFormLoading(true);
      try {
        let promises = [];
        if (type === 'student') {
          promises = data.map(item => createStudent(item));
        } else if (type === 'institution') {
          promises = data.map(item => createInstitution(item));
        } else if (type === 'teacher') {
          promises = data.map(item => createTeacher(item));
        }

        await Promise.all(promises);
        setSuccessMsg(`Successfully added ${data.length} ${type}s`);

        if (type === 'student') loadStudents();
        if (type === 'institution') loadInstitutions();
        if (type === 'teacher') loadTeachers();
        loadStats();
      } catch (err) {
        setError(`Failed to bulk add ${type}s`);
      }
      setFormLoading(false);
    },

    bulkDelete: async (type, ids) => {
      setFormLoading(true);
      try {
        let promises = [];
        if (type === 'student') {
          promises = ids.map(id => deleteStudent(id));
        } else if (type === 'institution') {
          promises = ids.map(id => deleteInstitution(id));
        } else if (type === 'teacher') {
          promises = ids.map(id => deleteTeacher(id));
        }

        await Promise.all(promises);
        setSuccessMsg(`Successfully deleted ${ids.length} ${type}s`);

        if (type === 'student') loadStudents();
        if (type === 'institution') loadInstitutions();
        if (type === 'teacher') loadTeachers();
        loadStats();
      } catch (err) {
        setError(`Failed to bulk delete ${type}s`);
      }
      setFormLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (userRole === 'student') {
          const myStudentRecord =
            students.find(s => s.userId === currentUser?._id) ||
            students.find(s => s.email === currentUser?.email) ||
            selectedStudent || null;

          return (
            <StudentDashboard
              currentUser={currentUser}
              student={myStudentRecord}
              loading={loading.students || loading.stats}
              refreshStudent={loadStudents}
              stats={stats.students}
            />
          );
        }

        if (userRole === 'institution') {
          return (
            <InstitutionDashboard
              currentUser={currentUser}
              stats={stats}
              loading={loading.stats}
              students={students}
              teachers={teachers}
              onViewStudent={handleViewStudentProfile}
              onViewTeacher={handleViewTeacherProfile}
            />
          );
        }

        if (userRole === 'faculty') {
          if (currentView === 'faculty-analytics') {
            return <FacultyAnalytics />;
          }

          return (
            <FacultyDashboard
              currentUser={currentUser}
              stats={stats}
              loading={loading.stats}
              students={students}
              onViewStudent={handleViewStudentProfile}
            />
          );
        }

        return <Dashboard stats={stats} loading={loading.stats} />;

      case 'lifecycle-verifications':
        return userRole === 'admin' ? (
          <AdminLifecycleVerifications />
        ) : (
          <Dashboard stats={stats} loading={loading.stats} />
        );

      case 'students':
        return (
          <StudentList
            students={students}
            loading={loading.students}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onRefresh={loadStudents}
            onAdd={handleAddStudent}
            onEdit={handleEditStudent}
            onDelete={handleDeleteClick}
            onViewProfile={handleViewStudentProfile}
            userRole={userRole}
            onBulkOperations={bulkOperations}
          />
        );

      case 'analytics':
        return (
          <>
            {userRole === 'admin' && <AnalyticsDashboard userRole={userRole} />}
            {userRole === 'institution' && <InstitutionAnalyticsDashboard />}
            {userRole === 'student' && <StudentPersonalAnalytics />}
          </>
        );

      case 'student-profile':
        return (
          <StudentProfile
            student={selectedStudent}
            onBack={() => handleBackToList('students')}
            onEdit={handleEditStudent}
            onDelete={handleDeleteClick}
            userRole={userRole}
          />
        );

      case 'institutions':
        return (
          <InstitutionList
            institutions={institutions}
            loading={loading.institutions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onRefresh={loadInstitutions}
            onAdd={handleAddInstitution}
            onEdit={handleEditInstitution}
            onDelete={handleDeleteClick}
            onViewProfile={handleViewInstitutionProfile}
            userRole={userRole}
          />
        );

      case 'institution-profile':
        return (
          <InstitutionProfile
            institution={selectedInstitution}
            onBack={() => handleBackToList('institutions')}
            onEdit={handleEditInstitution}
            onDelete={handleDeleteClick}
            userRole={userRole}
          />
        );

      case 'teachers':
        return (
          <TeacherList
            teachers={teachers}
            loading={loading.teachers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onRefresh={loadTeachers}
            onAdd={handleAddTeacher}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteClick}
            onViewProfile={handleViewTeacherProfile}
            userRole={userRole}
            onBulkOperations={bulkOperations}
          />
        );

      case 'teacher-profile':
        return (
          <TeacherProfile
            teacher={selectedTeacher}
            onBack={() => handleBackToList('teachers')}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteClick}
            userRole={userRole}
          />
        );

      case 'schemes-admin':
        return <AdminSchemeDashboard />;

      case 'schemes-institution':
        return (
          <InstitutionSchemeDashboard
            institutionId={currentUser?.institutionId}
          />
        );

      case 'admin':
        return userRole === 'admin' ? (
          <AdminPanel
            stats={stats}
            onAddStudent={handleAddStudent}
            onAddInstitution={handleAddInstitution}
            onAddTeacher={handleAddTeacher}
            setCurrentView={setCurrentView}
            onBulkOperations={bulkOperations}
          />
        ) : (
          <Dashboard stats={stats} loading={loading.stats} userRole={userRole} />
        );

      default:
        return <Dashboard stats={stats} loading={loading.stats} />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {successMsg && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success shadow z-3" style={{ zIndex: 9999 }}>
          {successMsg}
        </div>
      )}
      {error && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-danger shadow z-3 d-flex align-items-center" style={{ zIndex: 9999 }}>
          {error}
          <button className="btn-close ms-2" onClick={() => setError(null)}></button>
        </div>
      )}

      <StudentFormModal
        show={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        onSave={handleSaveStudent}
        saving={formLoading}
        editingId={editingId}
      />
      <InstitutionFormModal
        show={showInstitutionModal}
        onClose={() => setShowInstitutionModal(false)}
        institutionForm={institutionForm}
        setInstitutionForm={setInstitutionForm}
        onSave={handleSaveInstitution}
        saving={formLoading}
        editingId={editingId}
      />
      <TeacherFormModal
        show={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        teacherForm={teacherForm}
        setTeacherForm={setTeacherForm}
        onSave={handleSaveTeacher}
        saving={formLoading}
        editingId={editingId}
      />
      <DeleteModal
        show={showDeleteModal}
        deleteTarget={deleteTarget}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowDeleteModal(false)}
        loading={formLoading}
      />

      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="d-flex">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={userRole}
          sidebarOpen={sidebarOpen}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-grow-1 p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UnifiedEducationInterface;