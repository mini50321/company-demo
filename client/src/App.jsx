import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EntryPoint from './pages/EntryPoint';
import RegisterForm from './pages/RegisterForm';
import LoginPassword from './pages/LoginPassword';
import DigiLockerReminder from './pages/DigiLockerReminder';
import BasicProfileForm from './pages/BasicProfileForm';
import HomePage from './pages/HomePage';
import DigiLockerVerification from './pages/DigiLockerVerification';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPoint setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterForm setCurrentUser={setCurrentUser} />} />
        <Route path="/login" element={<LoginPassword setCurrentUser={setCurrentUser} />} />
        <Route path="/digilocker-reminder" element={<DigiLockerReminder setCurrentUser={setCurrentUser} />} />
        <Route path="/complete-profile" element={<BasicProfileForm setCurrentUser={setCurrentUser} />} />
        <Route path="/digilocker-verify" element={<DigiLockerVerification setCurrentUser={setCurrentUser} />} />
        <Route path="/home" element={currentUser ? <HomePage user={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

