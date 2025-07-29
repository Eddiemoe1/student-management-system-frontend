import React, { useState } from 'react';
import './lecturers.css';

interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: string[];
  status: 'active' | 'inactive';
}

interface LecturerFormData {
  name: string;
  email: string;
  department: string;
  courses: string;
}

const Lecturers: React.FC = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([
    {
      id: 'LEC001',
      name: 'Dr. Elena Moreau',
      email: 'elena.moreau@university.edu',
      department: 'Computer Science',
      courses: ['Data Structures', 'Algorithms', 'Software Engineering'],
      status: 'active'
    },
    {
      id: 'LEC002',
      name: 'Dr. Sarah ',
      email: 'sarah@university.edu',
      department: 'Mathematics',
      courses: ['Calculus I', 'Linear Algebra'],
      status: 'active'
    },
    {
      id: 'LEC003',
      name: 'Dr. Michael ',
      email: 'michael.chen@university.edu',
      department: 'Physics',
      courses: ['Quantum Mechanics', 'Thermodynamics'],
      status: 'inactive'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentLecturer, setCurrentLecturer] = useState<Lecturer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  const [formData, setFormData] = useState<LecturerFormData>({
    name: '',
    email: '',
    department: '',
    courses: ''
  });

  const departments = [...new Set(lecturers.map(lecturer => lecturer.department))];

  const filteredLecturers = lecturers.filter(lecturer => {
    const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecturer.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lecturer.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || lecturer.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLecturer: Lecturer = {
      id: `LEC${String(lecturers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      courses: formData.courses.split(',').map(course => course.trim()),
      status: 'active'
    };

    setLecturers(prev => [...prev, newLecturer]);
    setFormData({ name: '', email: '', department: '', courses: '' });
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLecturer) return;

    const updatedLecturer: Lecturer = {
      ...currentLecturer,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      courses: formData.courses.split(',').map(course => course.trim())
    };

    setLecturers(prev => prev.map(lecturer => 
      lecturer.id === currentLecturer.id ? updatedLecturer : lecturer
    ));
    setFormData({ name: '', email: '', department: '', courses: '' });
    setShowEditForm(false);
    setCurrentLecturer(null);
  };

  const handleEdit = (lecturer: Lecturer) => {
    setCurrentLecturer(lecturer);
    setFormData({
      name: lecturer.name,
      email: lecturer.email,
      department: lecturer.department,
      courses: lecturer.courses.join(', ')
    });
    setShowEditForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      setLecturers(prev => prev.filter(lecturer => lecturer.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setLecturers(prev => prev.map(lecturer => 
      lecturer.id === id 
        ? { ...lecturer, status: lecturer.status === 'active' ? 'inactive' : 'active' }
        : lecturer
    ));
  };

  return (
    <div className="lecturers-container">
      <div className="main-content">
        <div className="content-header">
          <div>
            <h1>Lecturers</h1>
            <p className="subtitle">Manage faculty members and their details</p>
          </div>
          <div className="header-actions">
            <button 
              className="add-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add Lecturer
            </button>
          </div>
        </div>

        <div className="content-body">
          <div className="controls-row">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search lecturers..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-section">
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                className="filter-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="lecturers-table">
              <thead>
                <tr>
                  <th>LECTURER ID</th>
                  <th>NAME & EMAIL</th>
                  <th>DEPARTMENT</th>
                  <th>COURSES</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.map(lecturer => (
                  <tr key={lecturer.id}>
                    <td>
                      <div className="lecturer-id">{lecturer.id}</div>
                    </td>
                    <td>
                      <div className="lecturer-info">
                        <div className="lecturer-name">{lecturer.name}</div>
                        <div className="lecturer-email">{lecturer.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="department">
                        <span className="dept-icon">🏛️</span>
                        {lecturer.department}
                      </div>
                    </td>
                    <td>
                      <div className="courses-list">
                        {lecturer.courses.map((course, index) => (
                          <span key={index} className="course-tag">
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${lecturer.status}`}>
                        {lecturer.status}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEdit(lecturer)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn toggle"
                          onClick={() => toggleStatus(lecturer.id)}
                          title={lecturer.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {lecturer.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(lecturer.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Lecturer</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="lecturer-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter lecturer's full name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter department name"
                />
              </div>
              <div className="form-group">
                <label>Courses (comma-separated)</label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter courses separated by commas"
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Lecturer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && currentLecturer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Lecturer</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditForm(false);
                  setCurrentLecturer(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="lecturer-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter lecturer's full name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter department name"
                />
              </div>
              <div className="form-group">
                <label>Courses (comma-separated)</label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter courses separated by commas"
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentLecturer(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lecturers;