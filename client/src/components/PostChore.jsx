import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Plus, DollarSign, MapPin, Clock, Tag, FileText } from 'lucide-react';

const PostChore = ({ onAddChore }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Shopping', 'Errands', 'Delivery', 'Pet Care', 'Home Services', 
    'Entertainment', 'Personal', 'Business', 'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'success' },
    { value: 'medium', label: 'Medium Priority', color: 'warning' },
    { value: 'high', label: 'High Priority', color: 'error' }
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      timeEstimate: '',
      priority: 'medium',
      category: 'Errands'
    },
    validate: values => {
      const errors = {};
      
      if (!values.title) {
        errors.title = 'Title is required';
      } else if (values.title.length < 5) {
        errors.title = 'Title must be at least 5 characters';
      }
      
      if (!values.description) {
        errors.description = 'Description is required';
      } else if (values.description.length < 20) {
        errors.description = 'Description must be at least 20 characters';
      }
      
      if (!values.price) {
        errors.price = 'Price is required';
      } else if (isNaN(values.price) || parseFloat(values.price) <= 0) {
        errors.price = 'Price must be a valid number greater than 0';
      } else if (parseFloat(values.price) > 1000) {
        errors.price = 'Price cannot exceed $1000';
      }
      
      if (!values.location) {
        errors.location = 'Location is required';
      } else if (values.location.length < 3) {
        errors.location = 'Please provide a more specific location';
      }
      
      if (!values.timeEstimate) {
        errors.timeEstimate = 'Time estimate is required';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        onAddChore({
          ...values,
          price: parseFloat(values.price)
        });
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    }
  });

  return (
    <div className="py-8">
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card-header text-center">
            <Plus size={32} className="text-primary mb-4" />
            <h2>Post a New Chore</h2>
            <p className="text-gray-600">Tell us what you need done and set your price</p>
          </div>
          
          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <FileText size={16} />
                  Chore Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Pick up dry cleaning from Main Street"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="form-error">{formik.errors.title}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Provide detailed instructions about what needs to be done, any special requirements, and any other important information..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="form-error">{formik.errors.description}</div>
                )}
              </div>

              <div className="dashboard-grid">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    <DollarSign size={16} />
                    Price ($)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    max="1000"
                    step="0.01"
                    className="form-input"
                    placeholder="25.00"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="form-error">{formik.errors.price}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="timeEstimate" className="form-label">
                    <Clock size={16} />
                    Time Estimate
                  </label>
                  <select
                    id="timeEstimate"
                    name="timeEstimate"
                    className="form-select"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.timeEstimate}
                  >
                    <option value="">Select time estimate</option>
                    <option value="15 mins">15 minutes</option>
                    <option value="30 mins">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3+ hours">3+ hours</option>
                  </select>
                  {formik.touched.timeEstimate && formik.errors.timeEstimate && (
                    <div className="form-error">{formik.errors.timeEstimate}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Downtown, Westside, Near City Mall"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location}
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="form-error">{formik.errors.location}</div>
                )}
              </div>

              <div className="dashboard-grid">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    <Tag size={16} />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority" className="form-label">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.priority}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  {loading ? <div className="loading" /> : <Plus size={16} />}
                  {loading ? 'Posting Chore...' : 'Post Chore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostChore;