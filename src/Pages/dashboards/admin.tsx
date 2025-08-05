import React from 'react';
import {
  Users,
  UserCheck,
  BookMarked,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../Contexts/AuthContext';
import StatCard from './StatsCard';
import './Dashboard.css';

const mockStats = {
  totalStudents: 1247,
  totalStaff: 45,
  totalSubjects: 28,
  totalLectures: 156,
  activeStudents: 1189,
  upcomingLectures: 12,
  recentMarks: [
    { id: '1', studentName: 'Ednah ', subjectName: 'BCS 374', marks: 85, totalMarks: 100, grade: 'A' },
    { id: '2', studentName: 'Janey', subjectName: 'BCS 367', marks: 78, totalMarks: 100, grade: 'B' },
    { id: '3', studentName: 'Lydiah', subjectName: 'BCS 321', marks: 92, totalMarks: 100, grade: 'A' },
  ],
  subjectDistribution: [
    { subject: 'BCS 321', students: 45 },
    { subject: 'BCS 324', students: 38 },
    { subject: 'BCS 367', students: 42 },
    { subject: 'BCS 374', students: 35 },
  ],
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const averageMark = mockStats.recentMarks.reduce((sum, mark) => sum + mark.marks, 0) / mockStats.recentMarks.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getAdminName = () => {
    if (!user) return 'Admin';
    return user.firstName || user.email.split('@')[0] || 'Admin';
  };

  return (
    <div className="dashboard-space">
      <div className="dashboard-greeting">
        <h1>{getGreeting()}, {getAdminName()}</h1>
        <p className="greeting-subtext">Here's what's happening with your institution today</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students" value={mockStats.totalStudents} icon={Users} color="bg-blue" subtitle={`${mockStats.activeStudents} active`} />
        <StatCard title="Total Staff" value={mockStats.totalStaff} icon={UserCheck} color="bg-orange" />
        <StatCard title="Subjects" value={mockStats.totalSubjects} icon={BookMarked} color="bg-purple" />
        <StatCard title="Lectures" value={mockStats.totalLectures} icon={Calendar} color="bg-green" subtitle={`${mockStats.upcomingLectures} upcoming`} />
        <StatCard title="Average Marks" value={averageMark.toFixed(1)} icon={TrendingUp} color="bg-blue" subtitle="Average of recent marks" />
        <StatCard title="Active Students" value={mockStats.activeStudents} icon={Users} color="bg-orange" />
        <StatCard title="Active lecturers" value={mockStats.activeStudents} icon={Users} color="bg-purple" />
        <StatCard title="Marks uploaded" value={mockStats.activeStudents} icon={Users} color="bg-green" />

      </div>

      <div className="charts-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Subject Enrollment</h3>
          <div className="subject-list">
            {mockStats.subjectDistribution.map((item, index) => (
              <div key={index} className="subject-item">
                <span className="subject-name">{item.subject}</span>
                <div className="subject-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(item.students / 50) * 100}%` }}></div>
                  </div>
                  <span className="student-count">{item.students}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Recent Marks</h3>
          <div className="marks-list">
            {mockStats.recentMarks.map((mark) => (
              <div key={mark.id} className="mark-item">
                <div>
                  <p className="student-name">{mark.studentName}</p>
                  <p className="subject-name">{mark.subjectName}</p>
                </div>
                <div className="mark-details">
                  <p className="mark-score">{mark.marks}/{mark.totalMarks}</p>
                  <p className={`mark-grade ${
                    mark.grade === 'A' ? 'grade-a' : 
                    mark.grade === 'B' ? 'grade-b' : 'grade-c'
                  }`}>{mark.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;