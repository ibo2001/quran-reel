import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import VideoGenerator from './components/Create/VideoGenerator';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
        <Routes>
          <Route path="/" element={<VideoGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
