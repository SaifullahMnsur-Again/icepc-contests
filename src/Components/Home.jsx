import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <motion.h2
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-4xl sm:text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-6"
      >
        Welcome to ICE Programming Club
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
      >
        The ICE Programming Club, part of the Department of Information and Communication Engineering at the University of Rajshahi, is dedicated to fostering competitive programming. Join us to explore coding challenges, track contest rankings, and connect with talented coders.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <Link
          to="/coders"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-400 dark:text-gray-900 dark:hover:bg-indigo-300 transition-colors duration-200"
        >
          View Coders
        </Link>
        <Link
          to="/contests"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-400 dark:text-gray-900 dark:hover:bg-indigo-300 transition-colors duration-200"
        >
          View Contests
        </Link>
      </motion.div>
    </motion.section>
  );
}

export default Home;