import React from 'react';
import {
  BookMarked,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import StatCard from './StatsCard'; 
import './Dashboard.css';

const mockStats = {
  recentMarks: [
    { id: '1', studentName: 'Ednah Moraa', subjectName: 'BCS 374', marks: 85, totalMarks: 100, grade: 'A' },
    { id: '2', studentName: 'Jane Catherine', subjectName: 'BCS 367', marks: 78, totalMarks: 100, grade: 'B' },
    { id: '3', studentName: 'Lydia Rose', subjectName: 'BCS 321', marks: 92, totalMarks: 100, grade: 'A' },
  ],
};

const StudentDashboard: React.FC = () => (
  <div className="dashboard-space">
    <div className="stats-grid student-stats">
      <StatCard title="Enrolled Subjects" value={6} icon={BookMarked} color="bg-purple" />
      <StatCard title="Upcoming Lectures" value={4} icon={Calendar} color="bg-orange" />
      <StatCard title="Average Grade" value={85} icon={TrendingUp} color="bg-green" subtitle="B+ Average" />
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
                <p className={`grade-letter ${mark.grade === 'A' ? 'grade-a' : mark.grade === 'B' ? 'grade-b' : 'grade-c'}`}>
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

export default StudentDashboard;
