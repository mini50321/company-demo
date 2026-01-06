import { useNavigate } from 'react-router-dom';
import { FiMail, FiShield, FiUser, FiCheck, FiX, FiLogOut, FiHome } from 'react-icons/fi';
import '../styles/HomePage.css';

function HomePage({ user, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="home-page">
      <div className="card">
        <div className="welcome-header">
          <div className="welcome-icon">
            <FiHome />
          </div>
          <h1>Welcome to Champa!</h1>
        </div>
        <div className="user-info">
          <div className="info-item">
            <FiMail className="info-icon" />
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email || 'N/A'}</span>
            </div>
          </div>
          <div className="info-item">
            <FiShield className="info-icon" />
            <div className="info-content">
              <span className="info-label">DigiLocker Verified</span>
              <span className={`info-value ${user?.digilockerVerified ? 'verified' : 'not-verified'}`}>
                {user?.digilockerVerified ? (
                  <>
                    <FiCheck className="status-icon" />
                    Yes
                  </>
                ) : (
                  <>
                    <FiX className="status-icon" />
                    No
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="info-item">
            <FiUser className="info-icon" />
            <div className="info-content">
              <span className="info-label">Profile Completed</span>
              <span className={`info-value ${user?.basicProfileCompleted ? 'verified' : 'not-verified'}`}>
                {user?.basicProfileCompleted ? (
                  <>
                    <FiCheck className="status-icon" />
                    Yes
                  </>
                ) : (
                  <>
                    <FiX className="status-icon" />
                    No
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          <FiLogOut className="btn-icon" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default HomePage;

