import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Coders from './Components/Coders';
import Contests from './Components/Contests';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <Router basename="/icepc-contests">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/coders" element={<Coders />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;