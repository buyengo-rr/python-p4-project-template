import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = ({ onLogin, error: globalError }) => {
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
      email: '',
      password: ''
    },
    validate: values => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      return errors;
    },
    onSubmit: async (values, { setFieldError }) => {
      setLoading(true);
      setError(null);

      try {
        // Call the parent's login function instead of handling fetch directly
        await onLogin(values);
        
        // Only navigate if login was successful and no global error
        if (!globalError) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Login submission error:', err);
        
        // Handle specific field errors
        if (err.message.includes('email')) {
          setFieldError('email', 'Invalid email address');
        } else if (err.message.includes('password')) {
          setFieldError('password', 'Invalid password');
        } else {
          setError(err.message || 'Login failed. Please try again.');
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

  // Determine which error to show (local takes precedence over global)
  const displayError = error || globalError;

  return (
    <div className="py-20">
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card-header text-center">
            <LogIn size={32} className="text-primary mb-4" />
            <h2>Welcome Back</h2>
            <p className="text-gray-600">Sign in to your ChoreRun account</p>
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
                <label htmlFor="password" className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  disabled={loading}
                  autoComplete="current-password"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="form-error">{formik.errors.password}</div>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link 
                to="/forgot-password" 
                className="text-sm text-gray-600 hover:text-primary"
                style={{ textDecoration: 'none' }}
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="card-footer text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;