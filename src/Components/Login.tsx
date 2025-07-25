import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../Contexts/AuthContext';
import { User, BookOpen, Lock, Mail } from 'lucide-react';
import './login.css';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface LoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string>('');
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoginError('');
      await login(data.email, data.password);
    } catch (error) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <BookOpen className="logo-icon" />
          </div>
          <h2 className="login-title">
            Student Management System
          </h2>
          <p className="login-subtitle">
            Sign in to your account
          </p>
        </div>

        <div className="demo-accounts">
          <h3 className="demo-title">Demo Accounts:</h3>
          <div className="demo-list">
            <p><strong>Admin:</strong> admin@school.com / password</p>
            <p><strong>Lecturer:</strong> lecturer@school.com / password</p>
            <p><strong>Student:</strong> student@school.com / password</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Mail className="icon" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
          </div>

          {loginError && (
            <div className="error-alert">
              <p className="error-text">{loginError}</p>
            </div>
          )}

          <div className="form-submit">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="submit-button"
            >
              {isSubmitting || isLoading ? (
                <>
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <User className="user-icon" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login; 