import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { type Mark } from '../Types/Index';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  GraduationCap,
  User,
  BookOpen,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import './Marks.css';

//My Mock data
const mockMarks: Mark[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Ednah Moraa',
    subjectId: 'SUB001',
    subjectName: 'Calculus I',
    examType: 'midterm',
    marks: 85,
    totalMarks: 100,
    percentage: 85,
    grade: 'A',
    date: '2024-01-15',
    lecturerId: 'LEC001',
    remarks: 'Excellent understanding of concepts'
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    subjectId: 'SUB002',
    subjectName: 'General Physics',
    examType: 'final',
    marks: 78,
    totalMarks: 100,
    percentage: 78,
    grade: 'B+',
    date: '2024-01-20',
    lecturerId: 'LEC002',
    remarks: 'Good performance, room for improvement'
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    subjectId: 'SUB003',
    subjectName: 'General Chemistry',
    examType: 'assignment',
    marks: 92,
    totalMarks: 100,
    percentage: 92,
    grade: 'A+',
    date: '2024-01-18',
    lecturerId: 'LEC003',
    remarks: 'Outstanding work'
  }
];

export const Marks: React.FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>(mockMarks);
  const [searchTerm, setSearchTerm] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);

  const filteredMarks = marks.filter(mark => {
    if (user?.role === 'student') {
      return mark.studentName.includes(user.firstName + ' ' + user.lastName);
    }
    
    const matchesSearch = 
      mark.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.grade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExamType = examTypeFilter === 'all' || mark.examType === examTypeFilter;
    const matchesGrade = gradeFilter === 'all' || mark.grade === gradeFilter;
    
    return matchesSearch && matchesExamType && matchesGrade;
  });

  const handleAddMark = () => {
    setSelectedMark(null);
    setShowAddModal(true);
  };

  const handleEditMark = (mark: Mark) => {
    setSelectedMark(mark);
    setShowAddModal(true);
  };

  const handleDeleteMark = (markId: string) => {
    if (window.confirm('Are you sure you want to delete this mark?')) {
      setMarks(marks.filter(m => m.id !== markId));
    }
  };

  const getGradeColor = (grade: string) => {
    const baseClasses = 'grade-badge';
    if (grade.startsWith('A')) return `${baseClasses} grade-a`;
    if (grade.startsWith('B')) return `${baseClasses} grade-b`;
    if (grade.startsWith('C')) return `${baseClasses} grade-c`;
    if (grade.startsWith('D')) return `${baseClasses} grade-d`;
    return `${baseClasses} grade-f`;
  };

  const getExamTypeBadge = (examType: string) => {
    const baseClasses = 'exam-type-badge';
    switch (examType) {
      case 'midterm': return `${baseClasses} exam-midterm`;
      case 'final': return `${baseClasses} exam-final`;
      case 'assignment': return `${baseClasses} exam-assignment`;
      case 'quiz': return `${baseClasses} exam-quiz`;
      default: return `${baseClasses} exam-default`;
    }
  };

  const canModify = user?.role === 'admin' || user?.role === 'lecturer';

  const totalMarks = filteredMarks.length;
  const averagePercentage = totalMarks > 0 
    ? Math.round(filteredMarks.reduce((sum, mark) => sum + mark.percentage, 0) / totalMarks)
    : 0;
  const highestScore = totalMarks > 0 
    ? Math.max(...filteredMarks.map(mark => mark.percentage))
    : 0;

  return (
    <div className="marks-container">
      {/* Header */}
      <div className="marks-header">
        <div>
          <h1>Marks</h1>
          <p className="marks-subtitle">
            {user?.role === 'student' 
              ? 'View your academic performance and grades'
              : 'Manage student marks and grades'
            }
          </p>
        </div>
        {canModify && (
          <div className="marks-header-action">
            <button
              onClick={handleAddMark}
              className="btn btn-primary"
            >
              <Plus className="icon" />
              Add Mark
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <GraduationCap className="icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Marks</p>
            <p className="stat-value">{totalMarks}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-green">
            <TrendingUp className="icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Average Score</p>
            <p className="stat-value">{averagePercentage}%</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <Award className="icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Highest Score</p>
            <p className="stat-value">{highestScore}%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {user?.role !== 'student' && (
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
                  placeholder="Search marks..."
                />
              </div>
            </div>
            <div className="filter-options">
              <div className="filter-group">
                <Filter className="icon" />
                <select
                  value={examTypeFilter}
                  onChange={(e) => setExamTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Grades</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="marks-table">
            <thead>
              <tr>
                {user?.role !== 'student' && <th>Student</th>}
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Date</th>
                {canModify && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map((mark) => (
                <tr key={mark.id} className="table-row">
                  {user?.role !== 'student' && (
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          <User className="icon" />
                        </div>
                        <div className="student-name">{mark.studentName}</div>
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="subject-cell">
                      <BookOpen className="icon" />
                      {mark.subjectName}
                    </div>
                  </td>
                  <td>
                    <span className={getExamTypeBadge(mark.examType)}>
                      {mark.examType}
                    </span>
                  </td>
                  <td>
                    <div className="score-cell">
                      <div className="score-value">{mark.marks}/{mark.totalMarks}</div>
                      <div className="score-percentage">{mark.percentage}%</div>
                    </div>
                  </td>
                  <td>
                    <span className={getGradeColor(mark.grade)}>
                      {mark.grade}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar className="icon" />
                      {new Date(mark.date).toLocaleDateString()}
                    </div>
                  </td>
                  {canModify && (
                    <td className="actions-cell">
                      <div className="actions-wrapper">
                        <button
                          onClick={() => handleEditMark(mark)}
                          className="btn-action edit"
                          title="Edit"
                        >
                          <Edit className="icon" />
                        </button>
                        <button
                          onClick={() => handleDeleteMark(mark.id)}
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
        
        {filteredMarks.length === 0 && (
          <div className="empty-state">
            <GraduationCap className="empty-icon" />
            <h3>No marks found</h3>
            <p>
              {searchTerm ? 'Try adjusting your search terms.' : 'No marks have been recorded yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Mark Modal */}
      {showAddModal && (
        <MarkFormModal
          mark={selectedMark}
          onClose={() => {
            setShowAddModal(false);
            setSelectedMark(null);
          }}
          onSave={(mark) => {
            if (selectedMark) {
              setMarks(marks.map(m => m.id === selectedMark.id ? mark : m));
            } else {
              setMarks([...marks, { ...mark, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setSelectedMark(null);
          }}
        />
      )}
    </div>
  );
};

interface MarkFormModalProps {
  mark: Mark | null;
  onClose: () => void;
  onSave: (mark: Mark) => void;
}

const MarkFormModal: React.FC<MarkFormModalProps> = ({ mark, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Mark>>(
    mark || {
      studentName: '',
      subjectName: '',
      examType: 'midterm',
      marks: 0,
      totalMarks: 100,
      percentage: 0,
      grade: '',
      date: new Date().toISOString().split('T')[0],
      remarks: ''
    }
  );

  const handleMarksChange = (marks: number, totalMarks: number) => {
    const percentage = Math.round((marks / totalMarks) * 100);
    let grade = 'F';
    
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 70) grade = 'C+';
    else if (percentage >= 65) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    
    setFormData({ ...formData, marks, totalMarks, percentage, grade });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Mark);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            {mark ? 'Edit Mark' : 'Add New Mark'}
          </h3>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                required
                value={formData.studentName || ''}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g., John Doe"
              />
            </div>
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
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Exam Type</label>
              <select
                value={formData.examType || 'midterm'}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
              >
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Marks Obtained</label>
              <input
                type="number"
                required
                min="0"
                value={formData.marks || 0}
                onChange={(e) => handleMarksChange(parseInt(e.target.value) || 0, formData.totalMarks || 100)}
              />
            </div>
            <div className="form-group">
              <label>Total Marks</label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalMarks || 100}
                onChange={(e) => handleMarksChange(formData.marks || 0, parseInt(e.target.value) || 100)}
              />
            </div>
            <div className="form-group">
              <label>Grade</label>
              <input
                type="text"
                readOnly
                value={formData.grade || ''}
                className="read-only"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Remarks (Optional)</label>
            <textarea
              value={formData.remarks || ''}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
              placeholder="Any additional comments or feedback"
            />
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
              {mark ? 'Update' : 'Add'} Mark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Marks;