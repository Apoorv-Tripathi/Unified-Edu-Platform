export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@edu.in",
    password: "admin123",
    role: "admin",
    fullName: "System Administrator",
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    username: "rahul_sharma",
    email: "rahul@student.edu.in",
    password: "student123",
    role: "student",
    fullName: "Rahul Sharma",
    entityId: 1,
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 3,
    username: "anita_desai",
    email: "anita.desai@faculty.edu.in",
    password: "teacher123",
    role: "teacher",
    fullName: "Dr. Anita Desai",
    entityId: 1,
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 4,
    username: "iit_delhi",
    email: "admin@iitd.ac.in",
    password: "institution123",
    role: "institution",
    fullName: "IIT Delhi Admin",
    entityId: 1,
    isActive: true,
    lastLogin: new Date().toISOString()
  }
];