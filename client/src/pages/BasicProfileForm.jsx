import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiCalendar, FiUsers, FiMapPin, FiArrowRight } from 'react-icons/fi';
import '../styles/BasicProfileForm.css';

function BasicProfileForm({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser?.verifiedData) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.verifiedData.fullName || '',
        dob: currentUser.verifiedData.dob || '',
        gender: currentUser.verifiedData.gender || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser?.id) {
        navigate('/');
        return;
      }

      const response = await axios.post('/api/customer/complete-profile', {
        userId: currentUser.id,
        profileData: formData
      });

      setCurrentUser(response.data.user);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basic-profile-form">
      <div className="card">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">Step 2 of 2</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiCalendar className="input-icon" />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiUsers className="input-icon" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FiMapPin className="input-icon" />
              <input
                type="text"
                name="address"
                placeholder="Address (Optional)"
                value={formData.address}
                onChange={handleChange}
                className="input"
              />
            </div>
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
                Saving...
              </>
            ) : (
              <>
                Complete Profile
                <FiArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BasicProfileForm;

