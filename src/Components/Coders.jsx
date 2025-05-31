import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';

function Coders() {
  const [coders, setCoders] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_rvXyZpvU4zsqMZ10-px2NULkBw5rfCTGUD2HHVYDAjUdZuDuxbgjtkjGtIWHD-lPkvHzLjlnC9Tq/pub?gid=0&single=true&output=csv";

  const handleLink = (handle, platform) => {
    if (!handle || handle.trim() === '') return "";
    const urls = {
      Codeforces: `https://codeforces.com/profile/${handle}`,
      Vjudge: `https://vjudge.net/user/${handle}`,
      Atcoder: `https://atcoder.jp/users/${handle}`,
      Codechef: `https://www.codechef.com/users/${handle}`
    };
    return (
      <a
        href={urls[platform]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-300 hover:underline"
      >
        {handle}
      </a>
    );
  };

  const customSortKey = (id) => {
    if (!id) return 9999;
    const digits = id.replace(/\D/g, '');
    if (digits.length < 4) return 9999;
    return parseInt(digits.slice(0, 2) + digits.slice(-2), 10);
  };

  useEffect(() => {
    const fetchCoders = async () => {
      try {
        const response = await fetch(SHEET_URL, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const csv = await response.text();
        const parsed = Papa.parse(csv.trim(), {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false
        });

        if (parsed.errors.length > 0) {
          throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
        }

        const sortedCoders = parsed.data
          .map(row => ({
            Name: row["Name"] || "Unknown",
            "Student ID": row["Student ID"] || "",
            Codeforces: row["Codeforces"] || "",
            Vjudge: row["Vjudge"] || "",
            Atcoder: row["Atcoder"] || "",
            Codechef: row["Codechef"] || "",
            sortKey: customSortKey(row["Student ID"])
          }))
          .sort((a, b) => a.sortKey - b.sortKey);

        setCoders(sortedCoders);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching coders:', err);
      }
    };

    fetchCoders();
  }, []);

  const filteredCoders = coders.filter(coder =>
    coder.Name.toLowerCase().includes(filter.toLowerCase()) ||
    coder["Student ID"].toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-300">
          Coders List
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Filter by name or ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-md border border-gray-300 dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('')}
            className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Clear Filter
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl"
      >
        {error ? (
          <div className="text-center text-red-500 py-4">Failed to load coders list: {error}</div>
        ) : (
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-indigo-100 dark:bg-gray-700 dark:text-white">
              <tr>
                <th className="px-3 sm:px-4 py-3 border-b">#</th>
                <th className="px-3 sm:px-4 py-3 border-b">Student ID</th>
                <th className="px-3 sm:px-4 py-3 border-b">Name</th>
                <th className="px-3 sm:px-4 py-3 border-b">Codeforces</th>
                <th className="px-3 sm:px-4 py-3 border-b">Vjudge</th>
                <th className="px-3 sm:px-4 py-3 border-b">Atcoder</th>
                <th className="px-3 sm:px-4 py-3 border-b">Codechef</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCoders.map((coder, index) => (
                <motion.tr
                  key={coder["Student ID"] || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-3 sm:px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{coder["Student ID"]}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{coder.Name}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{handleLink(coder.Codeforces, "Codeforces")}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{handleLink(coder.Vjudge, "Vjudge")}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{handleLink(coder.Atcoder, "Atcoder")}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{handleLink(coder.Codechef, "Codechef")}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.section>
  );
}

export default Coders;