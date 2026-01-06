import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiArrowRight, FiUser } from 'react-icons/fi';
import '../styles/LoginPassword.css';

function LoginPassword({ setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const identifier = location.state?.identifier || '';
  const needsProfile = location.state?.needsProfile || false;
  const needsDigilocker = location.state?.needsDigilocker || false;

  useEffect(() => {
    if (!identifier) {
      navigate('/');
    }
  }, [identifier, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
        password
      });

      const user = response.data.user;
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));

      if (needsProfile) {
        navigate('/complete-profile');
      } else if (needsDigilocker) {
        navigate('/digilocker-reminder');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-password">
      <div className="card">
        <div className="header-icon">
          <FiUser />
        </div>
        <h2>Enter Password</h2>
        <p className="subtitle">Welcome back, {identifier}</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight className="btn-icon" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPassword;

