import React, { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { type Staff } from '../Types/Index';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';
import './Staff.css';

// My Mock data 
const mockStaff: Staff[] = [
  {
    id: '1',
    staffId: 'STF001',
    firstName: 'Ednah',
    lastName: '',
    email: 'ednahmoraa@school.com',
    phone: '+25474567890',
    department: 'Computer Science',
    position: 'Professor',
    hireDate: '2020-01-15',
    role: 'lecturer',
    status: 'active'
  },
  {
    id: '2',
    staffId: 'STF002',
    firstName: 'Cynthia',
    lastName: '',
    email: 'cynthia@school.com',
    phone: '+25474567891',
    department: 'Physics',
    position: 'Associate Professor',
    hireDate: '2019-08-20',
    role: 'lecturer',
    status: 'active'
  },
  {
    id: '3',
    staffId: 'STF003',
    firstName: 'Michael',
    lastName: '',
    email: 'michael@school.com',
    phone: '+25474567892',
    department: 'Administration',
    position: 'Academic Coordinator',
    hireDate: '2021-03-10',
    role: 'admin',
    status: 'active'
  }
];

export const StaffPage: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const departments = Array.from(new Set(staff.map(s => s.department)));

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setShowAddModal(true);
  };

  const handleEditStaff = (member: Staff) => {
    setSelectedStaff(member);
    setShowAddModal(true);
  };

  const handleViewStaff = (member: Staff) => {
    setSelectedStaff(member);
    setShowViewModal(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== staffId));
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

  const getRoleBadge = (role: string) => {
    const baseClasses = 'status-badge';
    switch (role) {
      case 'admin':
        return `${baseClasses} role-admin`;
      case 'lecturer':
        return `${baseClasses} role-lecturer`;
      case 'student':
        return `${baseClasses} role-student`;
      default:
        return `${baseClasses} role-default`;
    }
  };

  return (
    <div className="staff-container">
      {/* Header */}
      <div className="staff-header">
        <div>
          <h1>Staff</h1>
          <p className="staff-subtitle">
            Manage staff members and their roles
          </p>
        </div>
        <div className="staff-header-action">
          <button
            onClick={handleAddStaff}
            className="btn btn-primary"
          >
            <Plus className="icon" />
            Add Staff
          </button>
        </div>
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
                placeholder="Search staff..."
              />
            </div>
          </div>
          <div className="filter-options">
            <div className="filter-group">
              <Filter className="icon" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="staff-grid">
        {filteredStaff.map((member) => (
          <div key={member.id} className="staff-card">
            <div className="card-content">
              <div className="card-header">
                <div className="staff-info">
                  <div className="staff-avatar">
                    <div className="avatar-circle">
                      <UserCheck className="icon" />
                    </div>
                  </div>
                  <div className="staff-details">
                    <h3 className="staff-name">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="staff-id">{member.staffId}</p>
                  </div>
                </div>
                <div className="badges-container">
                  <span className={getStatusBadge(member.status)}>
                    {member.status}
                  </span>
                  <span className={getRoleBadge(member.role)}>
                    {member.role}
                  </span>
                </div>
              </div>
              
              <div className="staff-details-list">
                <div className="detail-item">
                  <Briefcase className="icon" />
                  {member.position}
                </div>
                <div className="detail-item">
                  <MapPin className="icon" />
                  {member.department}
                </div>
                <div className="detail-item">
                  <Mail className="icon" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="detail-item">
                  <Calendar className="icon" />
                  Joined {new Date(member.hireDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="card-footer">
                <button
                  onClick={() => handleViewStaff(member)}
                  className="btn btn-outline"
                >
                  <Eye className="icon" />
                  View
                </button>
                <button
                  onClick={() => handleEditStaff(member)}
                  className="btn btn-outline"
                >
                  <Edit className="icon" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStaff(member.id)}
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

      {filteredStaff.length === 0 && (
        <div className="empty-state">
          <UserCheck className="empty-icon" />
          <h3>No staff found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new staff member.'}
          </p>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <StaffViewModal
          staff={selectedStaff}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
        <StaffFormModal
          staff={selectedStaff}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStaff(null);
          }}
          onSave={(staff) => {
            if (selectedStaff) {
              setStaff(prev => prev.map(s => s.id === selectedStaff.id ? staff : s));
            } else {
              setStaff(prev => [...prev, { ...staff, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
};

// Staff View Modal Component
interface StaffViewModalProps {
  staff: Staff;
  onClose: () => void;
}

const StaffViewModal: React.FC<StaffViewModalProps> = ({ staff, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Staff Details</h3>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="staff-profile">
            <div className="profile-avatar">
              <div className="avatar-large">
                <UserCheck className="icon" />
              </div>
            </div>
            <div className="profile-info">
              <h4>
                {staff.firstName} {staff.lastName}
              </h4>
              <p className="staff-id">{staff.staffId} • {staff.position}</p>
            </div>
          </div>
          
          <div className="details-grid">
            <div className="details-column">
              <div className="detail-item">
                <Mail className="icon" />
                <span>{staff.email}</span>
              </div>
              <div className="detail-item">
                <Phone className="icon" />
                <span>{staff.phone}</span>
              </div>
              <div className="detail-item">
                <MapPin className="icon" />
                <span>{staff.department}</span>
              </div>
            </div>
            
            <div className="details-column">
              <div className="detail-item">
                <Briefcase className="icon" />
                <span>{staff.position}</span>
              </div>
              <div className="detail-item">
                <Calendar className="icon" />
                <span>Hired: {new Date(staff.hireDate).toLocaleDateString()}</span>
              </div>
              <div className="badges-container">
                <span className={`status-badge ${
                  staff.status === 'active' ? 'status-active' : 'status-inactive'
                }`}>
                  {staff.status}
                </span>
                <span className={`status-badge ${
                  staff.role === 'admin' ? 'role-admin' : 'role-lecturer'
                }`}>
                  {staff.role}
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

// Staff Form Modal Component
interface StaffFormModalProps {
  staff: Staff | null;
  onClose: () => void;
  onSave: (staff: Staff) => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ staff, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Staff>>(
    staff || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      role: 'lecturer',
      status: 'active'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate staffId if new staff
    if (!staff) {
      const staffId = 'STF' + String(Date.now()).slice(-3).padStart(3, '0');
      formData.staffId = staffId;
    }
    onSave(formData as Staff);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            {staff ? 'Edit Staff' : 'Add New Staff'}
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
              <label>Department</label>
              <input
                type="text"
                required
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                required
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="form-input"
                placeholder="e.g., Professor, Associate Professor"
              />
            </div>
            <div className="form-group">
              <label>Hire Date</label>
              <input
                type="date"
                required
                value={formData.hireDate || ''}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role || 'lecturer'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="form-select"
              >
                <option value="admin">Admin</option>
                <option value="lecturer">Lecturer</option>
              </select>
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
              {staff ? 'Update' : 'Add'} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default StaffPage;