import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import URLInputForm from './components/URLInputForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MySearchPage from './pages/MySearchPage';
import DashboardMainPage from './pages/DashboardMainPage';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    const alreadyVisited = localStorage.getItem('alreadyVisited');

    if (!alreadyVisited) {
      setFirstVisit(true);
      localStorage.setItem('alreadyVisited', 'true');
    }
  }, []);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <Routes>
            {/* Redirect to /auth only on first visit */}
            {firstVisit && <Route path="*" element={<Navigate to="/auth" replace />} />}
            
            {/* Normal routes */}
            <Route path="/dashboard" element={<URLInputForm setResult={setResult} setLoading={setLoading} />} />
            <Route path="/result" element={<ResultDisplay result={result} />} />
            <Route path="/" element={<AuthPage />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route path="/mysearch" element={<MySearchPage />} />
            <Route path="/maindashboard" element={<DashboardMainPage />} />
          </Routes>

          {loading && <LoadingSpinner />}
        </div>
      </div>
    </Router>
  );
}

export default App;
