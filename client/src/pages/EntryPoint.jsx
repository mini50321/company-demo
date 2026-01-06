import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiPhone, FiUser, FiArrowRight, FiClock } from 'react-icons/fi';
import '../styles/EntryPoint.css';

function EntryPoint({ setCurrentUser }) {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/identify-user', {
        identifier: identifier.trim()
      });

      const { customerExists, digilockerVerified, basicProfileCompleted } = response.data;

      if (!customerExists) {
        navigate('/register', { state: { identifier } });
      } else if (digilockerVerified && basicProfileCompleted) {
        navigate('/login', { state: { identifier } });
      } else if (digilockerVerified && !basicProfileCompleted) {
        navigate('/login', { state: { identifier, needsProfile: true } });
      } else {
        navigate('/login', { state: { identifier, needsDigilocker: true } });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (identifier.includes('@')) return <FiMail className="input-icon" />;
    if (/^\d+$/.test(identifier)) return <FiPhone className="input-icon" />;
    return <FiUser className="input-icon" />;
  };

  return (
    <div className="entry-point">
      <div className="card">
        <div className="logo">
          <div className="logo-icon">
            <FiUser />
          </div>
          <h1>Champa</h1>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Enter your email, phone, or username to continue</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <div className="input-wrapper">
              {identifier && getIcon()}
              <input
                type="text"
                placeholder="Email / Phone / Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
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
                Checking...
              </>
            ) : (
              <>
                Continue
                <FiArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <p className="helper-text">
          <FiClock className="helper-icon" />
          Takes less than 30 seconds
        </p>
      </div>
    </div>
  );
}

export default EntryPoint;

