import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShield, FiCheck, FiArrowRight, FiX } from 'react-icons/fi';
import '../styles/DigiLockerReminder.css';

function DigiLockerReminder({ setCurrentUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;

  const handleVerifyNow = () => {
    navigate('/digilocker-verify', { state: { fromReminder: true } });
  };

  const handleSkip = async () => {
    if (userId) {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
        navigate('/home');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="digilocker-reminder">
      <div className="card">
        <div className="icon-wrapper">
          <FiShield className="icon" />
        </div>
        <h2>Verify Your Identity</h2>
        <p className="description">
          DigiLocker verification helps keep your account secure and unlocks additional features. You can also do this later.
        </p>

        <div className="button-group">
          <button 
            onClick={handleVerifyNow} 
            className="btn-primary"
            disabled={loading}
          >
            <FiCheck className="btn-icon" />
            Verify Now
          </button>
          <button 
            onClick={handleSkip} 
            className="btn-secondary"
            disabled={loading}
          >
            <FiX className="btn-icon" />
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigiLockerReminder;

