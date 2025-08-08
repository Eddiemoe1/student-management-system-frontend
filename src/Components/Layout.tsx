import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import logo from '../assets/greenbooks.jpg';

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

const getDashboardRoute = (role: string | undefined): string => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '/dashboards/admin';
    case 'lecturer':
      return '/dashboards/lecturer';
    case 'student':
      return '/dashboards/student';
    case 'teacher':
      return '/dashboards/lecturer';
    default:
      return '/login';
  }
};

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'lecturer', 'student', 'teacher'], dynamic: true },
  { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'lecturer', 'teacher'] },
  { name: 'Staff', href: '/staff', icon: UserCheck, roles: ['admin'] },
  { name: 'Lecturers', href: '/lecturers', icon: User, roles: ['admin'] },
  { name: 'Lectures', href: '/lectures', icon: Calendar, roles: ['admin', 'lecturer', 'student', 'teacher'] },
  { name: 'Subjects', href: '/subjects', icon: BookMarked, roles: ['admin', 'lecturer', 'teacher'] },
  { name: 'Marks', href: '/marks', icon: GraduationCap, roles: ['admin', 'lecturer', 'student', 'teacher'] },
];

export const Layout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (!user) return '';
    return user.firstName || user.email?.split('@')[0] || '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="loading-screen">Loading user data...</div>;
  }

  const normalizedRole = user?.role?.toLowerCase().trim();
  const filteredNavigation = navigation.filter(item =>
    normalizedRole && item.roles.includes(normalizedRole)
  );

  return (
    <div className="layout-container">
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
            <SidebarContent
              filteredNavigation={filteredNavigation}
              currentPath={location.pathname}
              navigate={navigate}
              userRole={normalizedRole}
            />
          </div>
        </div>
      )}

      <div className="desktop-sidebar">
        <SidebarContent
          filteredNavigation={filteredNavigation}
          currentPath={location.pathname}
          navigate={navigate}
          userRole={normalizedRole}
        />
      </div>

      <div className="main-content">
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
              <div className="app-title-icon">
                <img src={logo} alt="Logo" className="logo-image" />
              </div>
              <h1 className="app-title">STUDENT MANAGEMENT SYSTEM</h1>
            </div>

            <div className="user-controls">
              <div
                className="user-profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="user-avatar">
                  <User className="user-avatar-icon" />
                </div>
                {profileDropdownOpen ? (
                  <ChevronUp className="dropdown-chevron" />
                ) : (
                  <ChevronDown className="dropdown-chevron" />
                )}
              </div>

              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-role">Role: {user?.role}</div>
                  <button onClick={handleLogout} className="dropdown-logout-button">
                    <LogOut className="logout-icon" />
                    <span className="logout-text">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="page-content">
          <div className="content-container">
            {/* Greeting Card */}
            <div className="greeting-card">
              <h1 className="greeting-title">
                {getGreeting()}, {getUserName()}
              </h1>
              <p className="greeting-subtext">
                Welcome back to your {normalizedRole} dashboard
              </p>
            </div>

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
  navigate: ReturnType<typeof useNavigate>;
  userRole: string | undefined;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ filteredNavigation, currentPath, navigate, userRole }) => {
  return (
    <div className="sidebar-content">
      <div className="sidebar-header" />
      <div className="sidebar-nav-container">
        <nav className="sidebar-nav">
          {filteredNavigation.length === 0 ? (
            <p className="sidebar-empty">No accessible pages for your role.</p>
          ) : (
            filteredNavigation.map((item) => {
              const isActive = currentPath === item.href;
              if (item.dynamic) {
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(getDashboardRoute(userRole))}
                    className="nav-link no-bg-button"
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                  >
                    <item.icon className="nav-icon" />
                    {item.name}
                  </button>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon className={`nav-icon ${isActive ? 'active-icon' : ''}`} />
                  {item.name}
                </Link>
              );
            })
          )}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
