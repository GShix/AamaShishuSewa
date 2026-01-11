import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Page Components
import Home from './pages/Home';
import Services from './pages/Services';
import JoinPro from './pages/Join';
import Contact from './pages/contact';
import BookService from './pages/BookService';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/join" element={<JoinPro />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookService />} />
        
        {/* Catch-all route for 404s */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;