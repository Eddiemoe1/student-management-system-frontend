import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { type Student } from '../Types/Index';
import {
  Plus, Search, Filter, Edit, Trash2, Eye, User,
  Mail, Phone, MapPin, Calendar
} from 'lucide-react';
import './Student.css';

export const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'graduated'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

 useEffect(() => {
  fetch('https://localhost:7000/api/Students')
    .then(res => res.json())
    .then(data => {
      const mappedStudents: Student[] = data.map((item: any) => ({
        ...item,
        studentId: item.studentNo,
        phone: item.phoneNumber, 
      }));
      setStudents(mappedStudents);
    })
    .catch(err => console.error('Error fetching students:', err));
}, []);


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
    const base = 'status-badge';
    switch (status) {
      case 'active': return `${base} status-active`;
      case 'inactive': return `${base} status-inactive`;
      case 'graduated': return `${base} status-graduated`;
      default: return `${base} status-default`;
    }
  };

  return (
    <div className="students-container">
      {/* Header */}
      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p className="students-subtitle">Manage student information and enrollment</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={handleAddStudent} className="btn btn-primary">
            <Plus className="icon" />
            Add Student
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-content">
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="icon" />
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
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <div className="avatar-circle"><User className="icon" /></div>
                      <div>
                        <div>{student.firstName} {student.lastName}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.studentId}</td>
                  <td>
                    <div>{student.phone}</div> 
                  </td>
                  <td><span className={getStatusBadge(student.status)}>{student.status}</span></td>
                    <td>
                      {student.enrollmentDate && !isNaN(Date.parse(student.enrollmentDate))
                        ? new Date(student.enrollmentDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  <td className="actions-cell">
                    <button onClick={() => handleViewStudent(student)} className="btn-view"><Eye className="icon" /></button>
                    {user?.role === 'admin' && (
                      <>
                        <button onClick={() => handleEditStudent(student)}  className="btn-edit"><Edit className="icon" /></button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="btn-delete"><Trash2 className="icon" /></button>
                      </>
                    )}
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
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new student.'}</p>
          </div>
        )}
      </div>

      {showViewModal && selectedStudent && (
        <StudentViewModal student={selectedStudent} onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }} />
      )}

      {showAddModal && (
        <StudentFormModal
          student={selectedStudent}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStudent(null);
          }}
          onSave={async (newStudent) => {
            const response = await fetch('https://localhost:7000/api/Students', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentNo: newStudent.studentId,
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                email: newStudent.email,
                phoneNumber: newStudent.phone,
                address: newStudent.address,
                dateOfBirth: newStudent.dateOfBirth
              })
            });

            if (response.ok) {
              const savedStudent = await response.json();
              setStudents([...students, {
                ...newStudent,
                id: savedStudent.id,
                enrollmentDate: new Date().toISOString().split('T')[0],
              }]);
              setShowAddModal(false);
              setSelectedStudent(null);
            } else {
              alert('Failed to save student');
            }
          }}
        />
      )}
    </div>
  );
};

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
      status: 'active',
      studentId: `STU${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const studentResponse = await fetch('https://localhost:7000/api/Students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          StudentNo: formData.studentId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth
        })
      });

      if (!studentResponse.ok) {
        alert('Failed to save student');
        return;
      }

      const savedStudent = await studentResponse.json();

      const defaultPassword = "Student@123"; 
      const userResponse = await fetch('https://localhost:7000/api/v1/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: savedStudent.firstname + savedStudent.lastName,
          firstName: savedStudent.firstName,
          lastName: savedStudent.lastName,
          email: savedStudent.email,
          password: defaultPassword,
          confirmPassword: defaultPassword,
          role: "student",
          studentId: savedStudent.id
        })
      });

      if (!userResponse.ok) {
        alert('Student saved but failed to create login account');
      } else {
        alert(`Student saved successfully!\nDefault password: ${defaultPassword}`);
      }

      onSave({
        ...(formData as Student),
        id: savedStudent.id,
        studentId: savedStudent.studentNo,
        enrollmentDate: new Date().toISOString().split('T')[0],
      });

      onClose();
    } catch (error) {
      console.error('Error saving student and creating user:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{student ? 'Edit Student' : 'Add New Student'}</h3>
          <button onClick={onClose} className="modal-close">✕</button>
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
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
//on this page you can render the buttin useless after its been clicked once so as to prevent the user from saving twice or more

export default Students;