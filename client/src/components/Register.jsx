import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

const Register = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

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
      }
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      
      if (!values.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(values.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
      
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: values.userType,
          rating: 5.0,
          completedChores: 0,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        
        onLogin(userData);
        setLoading(false);
      }, 1000);
    }
  });

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
                  className="form-input"
                  placeholder="Enter your full name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
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
                  className="form-input"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
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
                  className="form-input"
                  placeholder="Enter your phone number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
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
                >
                  <option value="poster">Post Chores Only</option>
                  <option value="runner">Complete Chores Only</option>
                  <option value="both">Both - Post & Complete Chores</option>
                </select>
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
                  className="form-input"
                  placeholder="Create a password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="form-error">{formik.errors.password}</div>
                )}
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
                  className="form-input"
                  placeholder="Confirm your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="form-error">{formik.errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? <div className="loading" /> : <UserPlus size={16} />}
                {loading ? 'Creating Account...' : 'Create Account'}
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