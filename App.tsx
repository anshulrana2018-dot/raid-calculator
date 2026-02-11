import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Calculator } from './pages/Calculator';
import { Comparison } from './pages/Comparison';
import { FaultTolerance } from './pages/FaultTolerance';
import { About, Privacy, Contact, FAQ } from './pages/InfoPages';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/fault-tolerance" element={<FaultTolerance />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Navigate to="/privacy" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
