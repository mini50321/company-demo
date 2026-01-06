import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiShield, FiLoader, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import '../styles/DigiLockerVerification.css';

function DigiLockerVerification({ setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fromRegister = location.state?.fromRegister || false;
  const formData = location.state?.formData;
  const fromReminder = location.state?.fromReminder || false;

  useEffect(() => {
    initiateVerification();
  }, []);

  const initiateVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/digilocker/initiate');
      
      setTimeout(() => {
        handleCallback(response.data.sessionId);
      }, 2000);
    } catch (err) {
      setError('Failed to initiate DigiLocker verification');
      setLoading(false);
    }
  };

  const handleCallback = async (sessionId) => {
    try {
      const callbackResponse = await axios.post('/api/digilocker/callback', {
        sessionId,
        code: 'mock_code_123'
      });

      const { digilockerVerified, verifiedData, nextStep } = callbackResponse.data;

      if (fromRegister && formData) {
        if (nextStep) {
          const response = await axios.post('/api/auth/register', {
            ...formData,
            digilockerVerified: true,
            verifiedData
          });
          setCurrentUser(response.data.user);
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          navigate(nextStep);
        } else {
          navigate('/register', { 
            state: { 
              formData: formData,
              digilockerData: verifiedData,
              digilockerVerified: true
            } 
          });
        }
      } else if (fromReminder) {
        await updateDigilockerStatus(verifiedData);
      } else {
        navigate('/register', { state: { digilockerData: verifiedData } });
      }
    } catch (err) {
      setError('Verification failed');
      setLoading(false);
    }
  };


  const updateDigilockerStatus = async (verifiedData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser?.id) {
        navigate('/');
        return;
      }

      const response = await axios.post('/api/customer/update-digilocker', {
        userId: currentUser.id,
        verifiedData
      });

      setCurrentUser(response.data.user);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError('Failed to update DigiLocker status');
      setLoading(false);
    }
  };

  return (
    <div className="digilocker-verification">
      <div className="card">
        <div className="icon-wrapper">
          <FiShield className="icon" />
        </div>
        <h2>Verifying with DigiLocker</h2>
        {loading ? (
          <>
            <div className="spinner-wrapper">
              <FiLoader className="spinner" />
            </div>
            <p className="status-text">Connecting to DigiLocker...</p>
            <p className="helper-text">This may take a few seconds</p>
          </>
        ) : error ? (
          <>
            <div className="error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
            <button onClick={() => navigate('/')} className="btn-primary">
              <FiArrowLeft className="btn-icon" />
              Go Back
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default DigiLockerVerification;

