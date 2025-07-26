import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { type Lecturer } from '../Types/Index';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import './Lecturer.css';

//My Mock data 
const mockLectures: Lecturer[] = [
  {
    id: '1',
    subjectId: 'SUB001',
    subjectName: 'Calculus I',
    lecturerId: 'LEC001',
    lecturerName: 'Dr. Edna Moraa',
    title: 'Introduction to Derivatives',
    description: 'Basic concepts of derivatives and their applications',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Room 101',
    status: 'scheduled'
  },
  {
    id: '2',
    subjectId: 'SUB002',
    subjectName: 'Digital electronics',
    lecturerId: 'LEC002',
    lecturerName: 'Prof. Sarah Johnson',
    title: 'Logic Gates and Circuits',
    description: 'Understanding basic logic gates and their applications in digital circuits',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 205',
    status: 'completed'
  },
  {
    id: '3',
    subjectId: 'SUB003',
    subjectName: 'Software Engineering',
    lecturerId: 'LEC003',
    lecturerName: 'Dr. Michael Brown',
    title: 'SRS and Design Principles',
    description: 'Types of Software Requirements Specifications and design principles',
    date: '2024-01-16',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Lab 301',
    status: 'cancelled'
  }
];

export const Lectures: React.FC = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<Lecturer[]>(mockLectures);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecturer | null>(null);

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = 
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lecture.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const lectureDate = lecture.date;
      
      switch (dateFilter) {
        case 'today':
          matchesDate = lectureDate === today;
          break;
        case 'this_week':
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date();
          weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
          matchesDate = lectureDate >= weekStart.toISOString().split('T')[0] && 
                      lectureDate <= weekEnd.toISOString().split('T')[0];
          break;
        case 'this_month':
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          matchesDate = lectureDate >= monthStart.toISOString().split('T')[0] && 
                      lectureDate <= monthEnd.toISOString().split('T')[0];
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleAddLecture = () => {
    setSelectedLecture(null);
    setShowAddModal(true);
  };

  const handleEditLecture = (lecture: Lecturer) => {
    setSelectedLecture(lecture);
    setShowAddModal(true);
  };

  const handleDeleteLecture = (lectureId: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      setLectures(lectures.filter(l => l.id !== lectureId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="icon status-scheduled" />;
      case 'completed':
        return <CheckCircle className="icon status-completed" />;
      case 'cancelled':
        return <XCircle className="icon status-cancelled" />;
      default:
        return <AlertCircle className="icon status-default" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'status-badge';
    switch (status) {
      case 'scheduled':
        return `${baseClasses} status-scheduled`;
      case 'completed':
        return `${baseClasses} status-completed`;
      case 'cancelled':
        return `${baseClasses} status-cancelled`;
      default:
        return `${baseClasses} status-default`;
    }
  };

  const canModify = user?.role === 'admin' || user?.role === 'lecturer';

  // Sort lectures by date and time
  const sortedLectures = filteredLectures.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="lectures-container">
      {/* Header */}
      <div className="lectures-header">
        <div>
          <h1>Lectures</h1>
          <p className="lectures-subtitle">
            Manage lecture schedules and sessions
          </p>
        </div>
        {canModify && (
          <div className="lectures-header-action">
            <button
              onClick={handleAddLecture}
              className="btn btn-primary"
            >
              <Plus className="icon" />
              Schedule Lecture
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-content">
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-icon">
                <Search className="icon" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="Search lectures..."
              />
            </div>
          </div>
          <div className="filter-options">
            <div className="filter-group">
              <Filter className="icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="lectures-table">
            <thead>
              <tr>
                <th>Lecture Details</th>
                <th>Subject & Lecturer</th>
                <th>Schedule</th>
                <th>Status</th>
                {canModify && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedLectures.map((lecture) => (
                <tr key={lecture.id} className="table-row">
                  <td>
                    <div>
                      <div className="lecture-title">{lecture.title}</div>
                      <div className="lecture-description">{lecture.description}</div>
                      <div className="lecture-room">
                        <MapPin className="icon" />
                        {lecture.room}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="subject-info">
                        <BookOpen className="icon" />
                        {lecture.subjectName}
                      </div>
                      <div className="lecturer-info">
                        <User className="icon" />
                        {lecture.lecturerName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="date-info">
                        <Calendar className="icon" />
                        {new Date(lecture.date).toLocaleDateString()}
                      </div>
                      <div className="time-info">
                        <Clock className="icon" />
                        {lecture.startTime} - {lecture.endTime}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="status-container">
                      {getStatusIcon(lecture.status)}
                      <span className={getStatusBadge(lecture.status)}>
                        {lecture.status}
                      </span>
                    </div>
                  </td>
                  {canModify && (
                    <td className="actions-cell">
                      <div className="actions-wrapper">
                        <button
                          onClick={() => handleEditLecture(lecture)}
                          className="btn-action edit"
                          title="Edit"
                        >
                          <Edit className="icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteLecture(lecture.id)}
                          className="btn-action delete"
                          title="Delete"
                        >
                          <Trash2 className="icon" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedLectures.length === 0 && (
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <h3>No lectures found</h3>
            <p>
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by scheduling a new lecture.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Lecture Modal */}
      {showAddModal && (
        <LectureFormModal
          lecture={selectedLecture}
          onClose={() => {
            setShowAddModal(false);
            setSelectedLecture(null);
          }}
          onSave={(lecture) => {
            if (selectedLecture) {
              setLectures(lectures.map(l => l.id === selectedLecture.id ? lecture : l));
            } else {
              setLectures([...lectures, { ...lecture, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setSelectedLecture(null);
          }}
        />
      )}
    </div>
  );
};

interface LectureFormModalProps {
  lecture: Lecturer | null;
  onClose: () => void;
  onSave: (lecture: Lecturer) => void;
}

const LectureFormModal: React.FC<LectureFormModalProps> = ({ lecture, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Lecturer>>(
    lecture || {
      title: '',
      description: '',
      subjectId: '',
      subjectName: '',
      lecturerId: '',
      lecturerName: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:30',
      room: '',
      status: 'scheduled'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Lecturer);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            {lecture ? 'Edit Lecture' : 'Schedule New Lecture'}
          </h3>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label>Lecture Title</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Derivatives"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the lecture content"
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                required
                value={formData.subjectName || ''}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                placeholder="e.g., Calculus I"
              />
            </div>
            <div className="form-group">
              <label>Lecturer Name</label>
              <input
                type="text"
                required
                value={formData.lecturerName || ''}
                onChange={(e) => setFormData({ ...formData, lecturerName: e.target.value })}
                placeholder="e.g., Dr. John Smith"
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime || ''}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                required
                value={formData.endTime || ''}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Room</label>
              <input
                type="text"
                required
                value={formData.room || ''}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., Room 101, Lab 301"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status || 'scheduled'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="form-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {lecture ? 'Update' : 'Schedule'} Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Lectures;