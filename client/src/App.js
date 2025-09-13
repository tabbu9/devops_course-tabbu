import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SubtopicsPage from './pages/SubtopicsPage';
import TestPage from './pages/TestPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => { setUser(data.user); setLoading(false); })
        .catch(() => { setLoading(false); });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Box>
  );

  return (
    <Box
      bgGradient="linear(to-br, teal.50, cyan.100)"
      bgAttachment="fixed"
      minH="100vh"
    >
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={
          user ? <Dashboard user={user} /> : <AuthPage setUser={setUser} />
        } />
        <Route path="/topics/:topicKey" element={<SubtopicsPage user={user} />} />
        <Route path="/test/:topicKey" element={<TestPage user={user} />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} /> : <AuthPage setUser={setUser} />} />
      </Routes>
    </Box>
  );
}

export default App;