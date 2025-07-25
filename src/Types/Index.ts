export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  profileImage?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  semester: number;
  lecturerId: string;
  lecturerName: string;
  status: 'active' | 'inactive';
}

export interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  role: UserRole;
  status: 'active' | 'inactive';
  profileImage?: string;
}

export interface Lecturer {
  id: string;
  subjectId: string;
  subjectName: string;
  lecturerId: string;
  lecturerName: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Mark {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  examType: 'midterm' | 'final' | 'assignment' | 'quiz';
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  date: string;
  lecturerId: string;
  remarks?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalSubjects: number;
  totalLectures: number;
  activeStudents: number;
  upcomingLectures: number;
  recentMarks: Mark[];
  subjectDistribution: { subject: string; students: number }[];
}