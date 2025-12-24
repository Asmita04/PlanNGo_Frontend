import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import GoogleSignInButton from '../components/GoogleSignInButton';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await api.signup(signupData);
      login(response.user);
      addNotification({ message: 'Account created successfully!', type: 'success' });
      
      if (response.user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/user/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    setLoading(true);
    try {
      // Use the selected role from the form
      const response = await api.googleSignup(googleResponse.user, {
        role: formData.role,
        phone: '' // Google doesn't provide phone, user can update later
      });
      login(response.user);
      addNotification({ message: 'Google signup successful!', type: 'success' });
      
      if (response.user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/user/dashboard');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    setErrors({ submit: 'Google sign-up failed. Please try again.' });
  };

  return (
    <div className="modern-auth-page">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="modern-auth-container">
        <div className="modern-auth-card">
          <div className="modern-header">
            <div className="logo-section">
              <div className="logo-icon">✨</div>
              <h1>Join PlanNGo</h1>
            </div>
            <p>Create your account in seconds</p>
          </div>

          {errors.submit && (
            <div className="modern-error">
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <div className="modern-input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`modern-input ${errors.name ? 'error' : ''}`}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="input-row">
              <div className="input-group">
                <div className="modern-input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`modern-input ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="input-group">
                <div className="modern-input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`modern-input ${errors.phone ? 'error' : ''}`}
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="input-group">
              <div className="modern-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`modern-input ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="input-group">
              <div className="modern-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`modern-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="role-section">
              <label className="section-label">I want to</label>
              <div className="role-cards">
                <label className={`role-card ${formData.role === 'user' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-icon">🎫</div>
                    <div className="role-text">
                      <span className="role-title">Attend Events</span>
                      <span className="role-desc">Browse and book events</span>
                    </div>
                  </div>
                </label>
                
                <label className={`role-card ${formData.role === 'organizer' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={formData.role === 'organizer'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-icon">🎪</div>
                    <div className="role-text">
                      <span className="role-title">Create Events</span>
                      <span className="role-desc">Organize and manage events</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <GoogleSignInButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="Continue with Google"
          />

          <div className="modern-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
            <p className="terms-text">
              By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
