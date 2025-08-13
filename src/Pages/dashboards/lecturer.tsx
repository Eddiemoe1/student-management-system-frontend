import React from 'react';
import {
  BookMarked,
  Calendar,
  Users,
  Clock,
} from 'lucide-react';
import StatCard from './StatsCard';
import './Dashboard.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const LecturerDashboard: React.FC = () => {
  // Mock user data 
  const user = {
    firstName: 'Dr.',
    lastName: 'Moraa',
    role: 'lecturer'
  };

  return (
    <div className="dashboard-space">
      {/* Greeting Card */}
      <div className="greeting-card lecturer-greeting">
        <h1 className="greeting-title">
          {getGreeting()}, {user.firstName} {user.lastName}
        </h1>
        <p className="greeting-subtext">
          Here's your teaching overview for today
        </p>
      </div>

      <div className="stats-grid lecturer-stats">
        <StatCard title="My Subjects" value={5} icon={BookMarked} color="bg-purple" />
        <StatCard title="My Students" value={156} icon={Users} color="bg-blue" />
        <StatCard title="Upcoming Lectures" value={8} icon={Calendar} color="bg-orange" />
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
            <div className="grade-item"><span className="grade-label">A Grade</span><span className="grade-percent grade-a">70%</span></div>
            <div className="grade-item"><span className="grade-label">B Grade</span><span className="grade-percent grade-b">60%</span></div>
            <div className="grade-item"><span className="grade-label">C Grade</span><span className="grade-percent grade-c">55%</span></div>
            <div className="grade-item"><span className="grade-label">Below C</span><span className="grade-percent grade-d">40%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;