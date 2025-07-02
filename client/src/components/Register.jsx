import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';

const Register = ({ onLogin, error: globalError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Clear local error when global error changes
  useEffect(() => {
    if (globalError) {
      setError(null);
    }
  }, [globalError]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userType: 'both'
    },
    validate: values => {
      const errors = {};
      
      if (!values.name) {
        errors.name = 'Name is required';
      } else if (values.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      } else if (values.name.length > 50) {
        errors.name = 'Name must be less than 50 characters';
      }
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (!values.phone) {
        errors.phone = 'Phone number is required';
      } else {
        const phoneDigits = values.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          errors.phone = 'Phone number must be at least 10 digits';
        } else if (phoneDigits.length > 15) {
          errors.phone = 'Phone number must be less than 15 digits';
        }
      }
      
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else if (values.password.length > 100) {
        errors.password = 'Password must be less than 100 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      return errors;
    },
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      setError(null);

      try {
        // Create registration function that calls the backend
        const registerUser = async (userData) => {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userData.name.trim(),
              email: userData.email.toLowerCase().trim(),
              phone: userData.phone.replace(/\D/g, ''), // Store only digits
              password: userData.password,
              userType: userData.userType
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Registration failed: ${response.status}`);
          }

          return await response.json();
        };

        // Register the user
        const userData = await registerUser(values);
        
        // Call parent's login function to set user state and fetch chores
        await onLogin(userData);
        
        // Only navigate if registration and login were successful
        if (!globalError) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Registration error:', err);
        
        // Handle specific field errors based on error message
        if (err.message.toLowerCase().includes('email')) {
          if (err.message.toLowerCase().includes('exists') || err.message.toLowerCase().includes('taken')) {
            setFieldError('email', 'This email is already registered');
          } else {
            setFieldError('email', 'Invalid email address');
          }
        } else if (err.message.toLowerCase().includes('phone')) {
          setFieldError('phone', 'Invalid phone number');
        } else if (err.message.toLowerCase().includes('name')) {
          setFieldError('name', 'Invalid name format');
        } else if (err.message.toLowerCase().includes('password')) {
          setFieldError('password', 'Password does not meet requirements');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  });

  // Clear errors when user starts typing
  const handleInputChange = (e) => {
    if (error) setError(null);
    formik.handleChange(e);
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length >= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    formik.setFieldValue('phone', formattedValue);
    if (error) setError(null);
  };

  // Determine which error to show (local takes precedence over global)
  const displayError = error || globalError;

  return (
    <div className="py-20">
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-header text-center">
            <UserPlus size={32} className="text-primary mb-4" />
            <h2>Join ChoreRun</h2>
            <p className="text-gray-600">Create your account and start getting things done</p>
          </div>
          
          <div className="card-body">
            {displayError && (
              <div 
                className="form-error text-center mb-4"
                style={{
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} />
                {displayError}
              </div>
            )}
            
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  disabled={loading}
                  autoComplete="name"
                  maxLength={50}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="form-error">{formik.errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={loading}
                  autoComplete="email"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="form-error">{formik.errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-input ${formik.touched.phone && formik.errors.phone ? 'error' : ''}`}
                  placeholder="(555) 123-4567"
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={14}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="form-error">{formik.errors.phone}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="userType" className="form-label">
                  Account Type
                </label>
                <select
                  id="userType"
                  name="userType"
                  className="form-select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userType}
                  disabled={loading}
                >
                  <option value="poster">Post Chores Only</option>
                  <option value="runner">Complete Chores Only</option>
                  <option value="both">Both - Post & Complete Chores</option>
                </select>
                <small className="text-gray-500 mt-1">
                  You can change this later in your profile settings
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  disabled={loading}
                  autoComplete="new-password"
                  maxLength={100}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="form-error">{formik.errors.password}</div>
                )}
                <small className="text-gray-500 mt-1">
                  Must include uppercase, lowercase, and number
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <Lock size={16} />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  disabled={loading}
                  autoComplete="new-password"
                  maxLength={100}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="form-error">{formik.errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading || !formik.isValid || !formik.dirty}
              >
                {loading ? (
                  <>
                    <div className="loading" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="card-footer text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;