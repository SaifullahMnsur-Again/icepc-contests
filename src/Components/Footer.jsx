import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-indigo-800 dark:bg-indigo-950 text-white p-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">
          © 2025 ICE Programming Club, Department of Information and Communication Engineering, University of Rajshahi.
        </p>
        <p className="text-sm mt-2">
          <a
            href="https://github.com/saifullahmnsur-again/icepc-contests"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-200 hover:text-white underline"
          >
            View Source on GitHub
          </a>
        </p>
        <p className="text-xs mt-2 opacity-75">
          Built with ❤️ for competitive programming enthusiasts. (and onekkhani AI!)
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;