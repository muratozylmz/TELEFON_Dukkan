import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  return (
    <Router>
      <Navbar onCategorySelect={setSelectedCategory} />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
