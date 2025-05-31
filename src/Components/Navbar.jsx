import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="bg-indigo-600/70 dark:bg-indigo-900/70 backdrop-blur-lg text-white p-4 sticky top-0 z-20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-indigo-200"
            >
              ⚙️
            </motion.span>
            ICEPC
          </motion.h1>
          <button
            className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div
          className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 items-start sm:items-center w-full sm:w-auto transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block' : 'hidden sm:flex'
          }`}
        >
          {['/', '/coders', '/contests'].map((path, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-md text-white hover:text-indigo-100 transition-colors duration-200 ${
                    isActive ? 'font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {path === '/' ? 'Home' : path.charAt(1).toUpperCase() + path.slice(2)}
                    {isActive && (
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-300"
                        layoutId="underline"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <label
              htmlFor="theme-toggle"
              className="text-sm font-medium text-white cursor-pointer select-none"
            >
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </label>
            <div
              className={`relative w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                isDark ? 'bg-indigo-800' : 'bg-gray-300'
              }`}
              onClick={toggleDarkMode}
            >
              <motion.div
                className={`w-4 h-4 rounded-full shadow-md flex items-center justify-center text-xs ${
                  isDark ? 'bg-yellow-400 text-gray-900' : 'bg-white text-yellow-500'
                }`}
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {isDark ? '🌙' : '☀️'}
              </motion.div>
              <input
                id="theme-toggle"
                type="checkbox"
                className="hidden"
                checked={isDark}
                onChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;