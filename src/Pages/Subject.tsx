import React, { useState } from 'react';
import { type Subject } from '../Types/Index';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  User,
  Hash,
  GraduationCap
} from 'lucide-react';
import './Subject.css';

// Mock data - replace with actual API calls
const mockSubjects: Subject[] = [
  {
    id: '1',
    code: 'MATH101',
    name: 'Calculus I',
    description: 'Introduction to differential and integral calculus',
    credits: 3,
    department: 'Mathematics',
    semester: 1,
    lecturerId: 'LEC001',
    lecturerName: 'Dr. John Smith',
    status: 'active'
  },
  {
    id: '2',
    code: 'PHYS201',
    name: 'General Physics',
    description: 'Fundamentals of mechanics, waves, and thermodynamics',
    credits: 4,
    department: 'Physics',
    semester: 2,
    lecturerId: 'LEC002',
    lecturerName: 'Prof. Sarah Johnson',
    status: 'active'
  },
  {
    id: '3',
    code: 'CHEM101',
    name: 'General Chemistry',
    description: 'Basic principles of chemistry and chemical reactions',
    credits: 3,
    department: 'Chemistry',
    semester: 1,
    lecturerId: 'LEC003',
    lecturerName: 'Dr. Michael Brown',
    status: 'inactive'
  }
];

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchTerm] = useState('');
  const [departmentFilter] = useState<string>('all');
  const [statusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || subject.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAddModal(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== subjectId));
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'status-badge';
    switch (status) {
      case 'active':
        return `${baseClasses} status-active`;
      case 'inactive':
        return `${baseClasses} status-inactive`;
      default:
        return `${baseClasses} status-default`;
    }
  };

  return (
    <div className="subjects-container">
      {/* Header */}
      <div className="subjects-header">
        <div>
          <h1>Subjects</h1>
          <p className="subjects-subtitle">
            Manage subjects and course information
          </p>
        </div>
        <div className="subjects-header-action">
          <button
            onClick={handleAddSubject}
            className="btn btn-primary"
          >
            <Plus className="icon" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            <div className="card-content">
              <div className="card-header">
                <div className="subject-info">
                  <div className="subject-icon">
                    <div className="icon-circle">
                      <BookOpen className="icon" />
                    </div>
                  </div>
                  <div className="subject-details">
                    <h3 className="subject-name">{subject.name}</h3>
                    <p className="subject-code">{subject.code}</p>
                  </div>
                </div>
                <span className={getStatusBadge(subject.status)}>
                  {subject.status}
                </span>
              </div>
              
              <p className="subject-description">
                {subject.description}
              </p>
              
              <div className="subject-meta">
                <div className="meta-item">
                  <Hash className="icon" />
                  {subject.credits} Credits • Semester {subject.semester}
                </div>
                <div className="meta-item">
                  <User className="icon" />
                  {subject.lecturerName}
                </div>
                <div className="meta-item">
                  <GraduationCap className="icon" />
                  {subject.department}
                </div>
              </div>
              
              <div className="card-footer">
                <button
                  onClick={() => handleEditSubject(subject)}
                  className="btn btn-outline"
                >
                  <Edit className="icon" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="btn btn-danger"
                >
                  <Trash2 className="icon" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="empty-state">
          <BookOpen className="empty-icon" />
          <h3>No subjects found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new subject.'}
          </p>
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showAddModal && (
        <SubjectFormModal
          subject={selectedSubject}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSubject(null);
          }}
          onSave={(subject) => {
            if (selectedSubject) {
              setSubjects(subjects.map(s => s.id === selectedSubject.id ? subject : s));
            } else {
              setSubjects([...subjects, { ...subject, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setSelectedSubject(null);
          }}
        />
      )}
    </div>
  );
};

type SubjectFormModalProps = {
  subject: Subject | null;
  onClose: () => void;
  onSave: (subject: Subject) => void;
};

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({ subject, onClose, onSave }) => {
  const [form, setForm] = useState<Subject>(
    subject ?? {
      id: '',
      code: '',
      name: '',
      description: '',
      credits: 0,
      department: '',
      semester: 1,
      lecturerId: '',
      lecturerName: '',
      status: 'active',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'credits' || name === 'semester' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{subject ? 'Edit Subject' : 'Add Subject'}</h2>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <input name="code" value={form.code} onChange={handleChange} placeholder="Code" required />
          </div>
          <div className="form-group">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          </div>
          <div className="form-group">
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
          </div>
          <div className="form-group">
            <input name="credits" type="number" value={form.credits} onChange={handleChange} placeholder="Credits" required />
          </div>
          <div className="form-group">
            <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required />
          </div>
          <div className="form-group">
            <input name="semester" type="number" value={form.semester} onChange={handleChange} placeholder="Semester" required />
          </div>
          <div className="form-group">
            <input name="lecturerId" value={form.lecturerId} onChange={handleChange} placeholder="Lecturer ID" required />
          </div>
          <div className="form-group">
            <input name="lecturerName" value={form.lecturerName} onChange={handleChange} placeholder="Lecturer Name" required />
          </div>
          <div className="form-group">
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {subject ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subjects;