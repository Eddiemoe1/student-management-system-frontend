import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookMarked,
  Calendar,
  UserCheck,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './layout.css';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'lecturer', 'student'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'lecturer'] },
  { name: 'Staff', href: '/staff', icon: UserCheck, roles: ['admin'] },
  { name: 'Subjects', href: '/subjects', icon: BookMarked, roles: ['admin', 'lecturer'] },
  { name: 'Lectures', href: '/lectures', icon: Calendar, roles: ['admin', 'lecturer', 'student'] },
  { name: 'Marks', href: '/marks', icon: GraduationCap, roles: ['admin', 'lecturer', 'student'] },
];

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="layout-container">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          <div className="mobile-sidebar">
            <div className="mobile-sidebar-close">
              <button
                type="button"
                className="mobile-sidebar-close-button"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="mobile-sidebar-close-icon" />
              </button>
            </div>
            <SidebarContent filteredNavigation={filteredNavigation} currentPath={location.pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <SidebarContent filteredNavigation={filteredNavigation} currentPath={location.pathname} />
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <div className="top-bar-inner">
            <div className="top-bar-left">
              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="mobile-menu-icon" />
              </button>
              <h1 className="app-title">
                <span className="app-title-icon">
                  <GraduationCap className="app-icon" />
                </span>
                STUDENT MANAGEMENT SYSTEM
              </h1>
            </div>
            
            <div className="user-controls">
              <div 
                className="user-profile"                 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="user-avatar">
                  <User className="user-avatar-icon" />
                </div>
                <div className="user-info">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                {profileDropdownOpen ? (
                  <ChevronUp className="dropdown-chevron" />
                ) : (
                  <ChevronDown className="dropdown-chevron" />
                )}
              </div>
              
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-role">
                    Role: {user?.role}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-logout-button"
                  >
                    <LogOut className="logout-icon" />
                    <span className="logout-text">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="page-content">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  filteredNavigation: any[];
  currentPath: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ filteredNavigation, currentPath }) => {
  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
      </div>
      <div className="sidebar-nav-container">
        <nav className="sidebar-nav">
          {filteredNavigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon
                  className={`nav-icon ${isActive ? 'active-icon' : ''}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
export default Layout;