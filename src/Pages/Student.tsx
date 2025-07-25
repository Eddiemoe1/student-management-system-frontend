import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { type Student } from '../Types/Index';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import './Student.css';

// My Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.com',
    phone: '+1234567890',
    dateOfBirth: '2000-05-15',
    address: '123 Main St, City, State',
    enrollmentDate: '2023-09-01',
    status: 'active'
  },
  {
    id: '2',
    studentId: 'STU002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@student.com',
    phone: '+1234567891',
    dateOfBirth: '1999-12-20',
    address: '456 Oak Ave, City, State',
    enrollmentDate: '2023-09-01',
    status: 'active'
  },
  {
    id: '3',
    studentId: 'STU003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@student.com',
    phone: '+1234567892',
    dateOfBirth: '2001-03-10',
    address: '789 Pine Rd, City, State',
    enrollmentDate: '2023-09-01',
    status: 'inactive'
  }
];

export const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'graduated'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowAddModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowAddModal(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'status-badge';
    switch (status) {
      case 'active':
        return `${baseClasses} status-active`;
      case 'inactive':
        return `${baseClasses} status-inactive`;
      case 'graduated':
        return `${baseClasses} status-graduated`;
      default:
        return `${baseClasses} status-default`;
    }
  };

  return (
    <div className="students-container">
      {/* Header */}
      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p className="students-subtitle">
            Manage student information and enrollment
          </p>
        </div>
        {user?.role === 'admin' && (
          <div className="students-header-action">
            <button
              onClick={handleAddStudent}
              className="btn btn-primary"
            >
              <Plus className="icon" />
              Add Student
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
                placeholder="Search students..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Enrollment Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="table-row">
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        <div className="avatar-circle">
                          <User className="icon" />
                        </div>
                      </div>
                      <div className="student-details">
                        <div className="student-name">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="student-id">
                    {student.studentId}
                  </td>
                  <td className="student-contact">
                    <div>{student.phone}</div>
                    <div className="student-address">
                      {student.address}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusBadge(student.status)}>
                      {student.status}
                    </span>
                  </td>
                  <td className="enrollment-date">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="btn-action view"
                        title="View Details"
                      >
                        <Eye className="icon" />
                      </button>
                      {user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="btn-action edit"
                            title="Edit"
                          >
                            <Edit className="icon" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="btn-action delete"
                            title="Delete"
                          >
                            <Trash2 className="icon" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="empty-state">
            <User className="empty-icon" />
            <h3>No students found</h3>
            <p>
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new student.'}
            </p>
          </div>
        )}
      </div>

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <StudentViewModal
          student={selectedStudent}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <StudentFormModal
          student={selectedStudent}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStudent(null);
          }}
          onSave={(student) => {
            if (selectedStudent) {
              setStudents(students.map(s => s.id === selectedStudent.id ? student : s));
            } else {
              setStudents([...students, { ...student, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

// Student View Modal Component
interface StudentViewModalProps {
  student: Student;
  onClose: () => void;
}

const StudentViewModal: React.FC<StudentViewModalProps> = ({ student, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Student Details</h3>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="student-profile">
            <div className="profile-avatar">
              <div className="avatar-large">
                <User className="icon" />
              </div>
            </div>
            <div className="profile-info">
              <h4>
                {student.firstName} {student.lastName}
              </h4>
              <p className="student-id">{student.studentId}</p>
            </div>
          </div>
          
          <div className="details-grid">
            <div className="details-column">
              <div className="detail-item">
                <Mail className="icon" />
                <span>{student.email}</span>
              </div>
              <div className="detail-item">
                <Phone className="icon" />
                <span>{student.phone}</span>
              </div>
              <div className="detail-item">
                <MapPin className="icon" />
                <span>{student.address}</span>
              </div>
            </div>
            
            <div className="details-column">
              <div className="detail-item">
                <Calendar className="icon" />
                <span>Born: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <Calendar className="icon" />
                <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className={`status-badge ${
                  student.status === 'active' ? 'status-active' :
                  student.status === 'inactive' ? 'status-inactive' :
                  'status-graduated'
                }`}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Student Form Modal Component
interface StudentFormModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Student);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            {student ? 'Edit Student' : 'Add New Student'}
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
              <label>First Name</label>
              <input
                type="text"
                required
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea
              required
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="form-textarea"
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Enrollment Date</label>
              <input
                type="date"
                required
                value={formData.enrollmentDate || ''}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
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
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Students;