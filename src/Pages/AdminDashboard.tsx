import React from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { 
  Users, 
  UserCheck, 
  BookMarked, 
  Calendar, 
  TrendingUp,
  Clock,
} from 'lucide-react';
import './Dashboard.css';

//My Mock data
const mockStats = {
  totalStudents: 1247,
  totalStaff: 45,
  totalSubjects: 28,
  totalLectures: 156,
  activeStudents: 1189,
  upcomingLectures: 12,
  recentMarks: [
    { id: '1', studentName: 'Ednah Moraa', subjectName: 'BCS 374', marks: 85, totalMarks: 100, grade: 'A' },
    { id: '2', studentName: 'Jane Catherine', subjectName: 'BCS 367', marks: 78, totalMarks: 100, grade: 'B' },
    { id: '3', studentName: 'Lydia Rose', subjectName: 'BCS 321', marks: 92, totalMarks: 100, grade: 'A' },
  ],
  subjectDistribution: [
    { subject: 'BCS 321', students: 45 },
    { subject: 'BCS 324', students: 38 },
    { subject: 'BCS 367', students: 42 },
    { subject: 'BCS 374', students: 35 },
  ]
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className={`stat-icon ${color}`}>
          <Icon className="icon" />
        </div>
        <div className="stat-text">
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value.toLocaleString()}</p>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-space">
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={mockStats.totalStudents}
          icon={Users}
          color="bg-blue"
          subtitle={`${mockStats.activeStudents} active`}
        />
        <StatCard
          title="Total Staff"
          value={mockStats.totalStaff}
          icon={UserCheck}
          color="bg-green"
        />
        <StatCard
          title="Subjects"
          value={mockStats.totalSubjects}
          icon={BookMarked}
          color="bg-purple"
        />
        <StatCard
          title="Lectures"
          value={mockStats.totalLectures}
          icon={Calendar}
          color="bg-green"
          subtitle={`${mockStats.upcomingLectures} upcoming`}
        />
        <StatCard
          title="Average Marks"
          value={mockStats.recentMarks.reduce((sum, mark) => sum + mark.marks, 0) / mockStats.recentMarks.length}
          icon={TrendingUp}
          color="bg-blue"
          subtitle="Average of recent marks"
          />
        <StatCard
          title="Active Students"
          value={mockStats.activeStudents}
          icon={Users}
          color="bg-orange"
          />

      </div>

      {/* Charts and Recent Activity */}
      <div className="charts-grid">
        {/* Subject Distribution */}
        <div className="dashboard-card">
          <h3 className="card-title">Subject Enrollment</h3>
          <div className="subject-list">
            {mockStats.subjectDistribution.map((item, index) => (
              <div key={index} className="subject-item">
                <span className="subject-name">{item.subject}</span>
                <div className="subject-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(item.students / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="student-count">{item.students}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Marks */}
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
                    mark.grade.startsWith('A') ? 'grade-a' : 
                    mark.grade.startsWith('B') ? 'grade-b' : 'grade-c'
                  }`}>
                    {mark.grade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLecturerDashboard = () => (
    <div className="dashboard-space">
      <div className="stats-grid lecturer-stats">
        <StatCard
          title="My Subjects"
          value={5}
          icon={BookMarked}
          color="bg-purple"
        />
        <StatCard
          title="My Students"
          value={156}
          icon={Users}
          color="bg-blue"
        />
        <StatCard
          title="Upcoming Lectures"
          value={8}
          icon={Calendar}
          color="bg-orange"
        />
      </div>

      <div className="charts-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Today's Schedule</h3>
          <div className="schedule-list">
            <div className="schedule-item bg-green">
              <Clock className="schedule-icon" />
              <div>
                <p className="schedule-class">BCS 321 - Room 101</p>
                <p className="schedule-time">9:00 AM - 10:30 AM</p>
              </div>
            </div>
            <div className="schedule-item bg-blue">
              <Clock className="schedule-icon" />
              <div>
                <p className="schedule-class">BCS 374 - Room 205</p>
                <p className="schedule-time">2:00 PM - 3:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Grade Distribution</h3>
          <div className="grade-list">
            <div className="grade-item">
              <span className="grade-label">A Grade</span>
              <span className="grade-percent grade-a">70%</span>
            </div>
            <div className="grade-item">
              <span className="grade-label">B Grade</span>
              <span className="grade-percent grade-b">60%</span>
            </div>
            <div className="grade-item">
              <span className="grade-label">C Grade</span>
              <span className="grade-percent grade-c">55%</span>
            </div>
            <div className="grade-item">
              <span className="grade-label">Below C</span>
              <span className="grade-percent grade-d">40%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="dashboard-space">
      <div className="stats-grid student-stats">
        <StatCard
          title="Enrolled Subjects"
          value={6}
          icon={BookMarked}
          color="bg-purple"
        />
        <StatCard
          title="Upcoming Lectures"
          value={4}
          icon={Calendar}
          color="bg-orange"
        />
        <StatCard
          title="Average Grade"
          value={85}
          icon={TrendingUp}
          color="bg-green"
          subtitle="B+ Average"
        />
      </div>

      <div className="charts-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Upcoming Lectures</h3>
          <div className="lecture-list">
            <div className="lecture-item">
              <div>
                <p className="lecture-subject">BCS 367</p>
                <p className="lecture-details">Room 101 • Prof. Johnson</p>
              </div>
              <div className="lecture-time">
                <p className="lecture-day">Tomorrow</p>
                <p className="lecture-hour">9:00 AM</p>
              </div>
            </div>
            <div className="lecture-item">
              <div>
                <p className="lecture-subject">BCS 324</p>
                <p className="lecture-details">Room 205 • Dr. Smith</p>
              </div>
              <div className="lecture-time">
                <p className="lecture-day">Tomorrow</p>
                <p className="lecture-hour">2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Recent Grades</h3>
          <div className="grades-list">
            {mockStats.recentMarks.map((mark) => (
              <div key={mark.id} className="grade-item">
                <div>
                  <p className="grade-subject">{mark.subjectName}</p>
                  <p className="grade-exam">Midterm Exam</p>
                </div>
                <div className="grade-score">
                  <p className="grade-mark">{mark.marks}/{mark.totalMarks}</p>
                  <p className={`grade-letter ${
                    mark.grade.startsWith('A') ? 'grade-a' : 
                    mark.grade.startsWith('B') ? 'grade-b' : 'grade-c'
                  }`}>
                    {mark.grade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="header-title">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="header-subtitle">
          {user?.role === 'admin' && 'Welcome to your admin dashboard. Here\'s what\'s happening today.'}
          {user?.role === 'lecturer' && 'Here\'s your teaching overview for today.'}
          {user?.role === 'student' && 'Here\'s your academic progress and upcoming schedule.'}
        </p>
      </div>

      {/* Role-based Dashboard Content */}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'lecturer' && renderLecturerDashboard()}
      {user?.role === 'student' && renderStudentDashboard()}
    </div>
  );
};
export default Dashboard;