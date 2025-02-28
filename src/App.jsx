import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import './App.css';

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;