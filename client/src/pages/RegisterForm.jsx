import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiPhone, FiUser, FiLock, FiShield, FiCheck, FiArrowRight } from 'react-icons/fi';
import '../styles/RegisterForm.css';

function RegisterForm({ setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [useDigilocker, setUseDigilocker] = useState(false);
  const [digilockerVerified, setDigilockerVerified] = useState(false);
  const [digilockerData, setDigilockerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.identifier) {
      const identifier = location.state.identifier;
      if (identifier.includes('@')) {
        setFormData(prev => ({ ...prev, email: identifier }));
      } else if (/^\d+$/.test(identifier)) {
        setFormData(prev => ({ ...prev, phone: identifier }));
      } else {
        setFormData(prev => ({ ...prev, username: identifier }));
      }
    }

    if (location.state?.digilockerData) {
      const verifiedData = location.state.digilockerData;
      setDigilockerData(verifiedData);
      setDigilockerVerified(location.state.digilockerVerified || false);
      setUseDigilocker(true);

      if (location.state.formData) {
        setFormData(location.state.formData);
      }

      if (verifiedData.fullName) {
        setFormData(prev => ({ ...prev, fullName: verifiedData.fullName }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDigilockerClick = () => {
    if (useDigilocker) {
      navigate('/digilocker-verify', { state: { fromRegister: true, formData } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (useDigilocker && !digilockerVerified) {
      navigate('/digilocker-verify', { state: { fromRegister: true, formData } });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        digilockerVerified: digilockerVerified,
        verifiedData: digilockerData || {}
      });

      setCurrentUser(response.data.user);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <div className="card">
        <h2>Create Account</h2>
        <p className="subtitle">Step 1 of 2</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username (Optional)"
                value={formData.username}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useDigilocker}
                onChange={(e) => {
                  if (!digilockerVerified) {
                    setUseDigilocker(e.target.checked);
                  }
                }}
                disabled={digilockerVerified}
                className="checkbox"
              />
              <span className="checkbox-text">
                {digilockerVerified ? (
                  <>
                    <FiShield className="checkbox-icon verified" />
                    Verified Using DigiLocker
                  </>
                ) : (
                  <>
                    <FiShield className="checkbox-icon" />
                    Verify Using DigiLocker (Recommended)
                  </>
                )}
              </span>
            </label>
            <p className="helper-text-small">
              {digilockerVerified 
                ? 'Your identity has been verified. You can review and submit the form.'
                : 'Verify your identity instantly using DigiLocker for faster onboarding.'}
            </p>
            {digilockerVerified && digilockerData && (
              <p className="helper-text-small verified-message">
                <FiCheck className="verified-icon" />
                Basic information has been auto-filled from DigiLocker
              </p>
            )}
          </div>

          {error && (
            <div className="error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating...
              </>
            ) : (
              <>
                Create Account
                <FiArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;

