import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';

function Contests() {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [rankData, setRankData] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const CONTEST_METADATA_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXSB-zO1tuSWPCZEgENWdwJJezIyqmlksdwAulBsawNFVekKYlGn6dS0imxMq5qRNjHtB8MUWF0QLX/pub?gid=1861808501&single=true&output=csv";

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          const error = new Error(`HTTP error: ${response.status}`);
          error.status = response.status;
          throw error;
        }
        return response;
      } catch (error) {
        if (i === retries - 1 || error.status !== 404) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchContests = async () => {
    try {
      const response = await fetchWithRetry(CONTEST_METADATA_CSV_URL);
      const csv = await response.text();
      const parsed = Papa.parse(csv.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });
      if (parsed.errors.length > 0) {
        throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
      }
      const contestsData = parsed.data
        .map(row => ({
          name: row.name || 'Unknown Contest',
          date: row.date || 'Unknown Date',
          description: row.description || 'No description available.',
          sheet: row.sheet || '',
          link: row.link || '#',
          problem_setters: row.problem_setters || 'N/A',
          coders: row.coders || ''
        }))
        .filter(contest => contest.sheet && contest.coders);
      setContests(contestsData);
      if (contestsData.length > 0) {
        setSelectedContest(contestsData[0]);
      }
    } catch (err) {
      setError(`Error fetching contest metadata: ${err.message}`);
      setContests([{
        name: 'ICE Coders Drill #26',
        date: '2025-05-30 10:00',
        description: 'ICE Coders Drill #26 competitive programming contest',
        sheet: '',
        link: '#',
        problem_setters: 'N/A',
        coders: ''
      }]);
      setSelectedContest(contests[0]);
    }
  };

  const fetchCoders = async (codersCsvUrl) => {
    try {
      const response = await fetchWithRetry(codersCsvUrl);
      const csv = await response.text();
      const parsed = Papa.parse(csv.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });
      if (parsed.errors.length > 0) {
        throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
      }
      return parsed.data.reduce((map, coder) => {
        if (coder.Vjudge && coder.Name && coder.Name.trim() !== '') {
          map[coder.Vjudge] = coder.Name;
        }
        return map;
      }, {});
    } catch (error) {
      console.warn('Error fetching coders data:', error);
      return {};
    }
  };

  const parseSubmission = (submission) => {
    if (!submission || submission.trim() === '') return { isSolved: false, seconds: 0, incorrect: 0 };
    const solvedMatch = submission.match(/^(\d+):(\d{2}):(\d{2})(\n\(-(\d+)\))?$/);
    if (solvedMatch) {
      const hours = parseInt(solvedMatch[1], 10);
      const minutes = parseInt(solvedMatch[2], 10);
      const seconds = parseInt(solvedMatch[3], 10);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const incorrect = solvedMatch[5] ? parseInt(solvedMatch[5], 10) : 0;
      return { isSolved: true, seconds: totalSeconds, incorrect };
    }
    const unsolvedMatch = submission.match(/^\(-(\d+)\)$/);
    if (unsolvedMatch) {
      return { isSolved: false, seconds: 0, incorrect: parseInt(unsolvedMatch[1], 10) };
    }
    return { isSolved: false, seconds: 0, incorrect: 0 };
  };

  const loadContestData = async (contest) => {
    setError(null);
    setRankData([]);
    try {
      const response = await fetchWithRetry(contest.sheet);
      const csv = await response.text();
      const parsed = Papa.parse(csv.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });

      if (parsed.errors.length > 0) {
        throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
      }

      const data = parsed.data;
      if (!data || data.length === 0) {
        throw new Error('No valid data rows found in CSV');
      }

      const headers = Object.keys(data[0] || {});
      if (headers.length < 4) {
        throw new Error('Insufficient headers in CSV');
      }

      const problemColumns = headers
        .slice(4)
        .map(col => {
          if (!col || typeof col !== 'string') return '';
          const match = col.match(/([A-Za-z])\s*(\d+)\s*\/\s*(\d+)/);
          return match ? `${match[1]} (${match[2]}/${match[3]})` : col;
        })
        .filter(col => col);

      const firstSolvers = {};
      problemColumns.forEach((_, colIndex) => {
        const colName = headers[4 + colIndex] || '';
        let earliestTime = Infinity;
        let earliestRowIndex = -1;
        data.forEach((row, rowIndex) => {
          const submission = row[colName] || '';
          const { isSolved, seconds } = parseSubmission(submission);
          if (isSolved && seconds < earliestTime) {
            earliestTime = seconds;
            earliestRowIndex = rowIndex;
          }
        });
        if (earliestRowIndex !== -1) {
          firstSolvers[colName] = earliestRowIndex;
        }
      });

      const vjudgeToName = await fetchCoders(contest.coders);
      const rankedData = [];
      data.forEach((row, rowIndex) => {
        const team = row['Team'] || '';
        const score = row['Score'] || '0';
        if (!team) return;
        const vjudgeHandleMatch = team.match(/^([^\(]+)\(/);
        const vjudgeHandle = vjudgeHandleMatch ? vjudgeHandleMatch[1].trim() : team;
        const name = vjudgeToName[vjudgeHandle];
        if (!name || name.trim() === '') return;

        let totalSeconds = 0;
        problemColumns.forEach((_, colIndex) => {
          const colName = headers[4 + colIndex] || '';
          const submission = row[colName] || '';
          const { isSolved, seconds, incorrect } = parseSubmission(submission);
          if (isSolved) {
            totalSeconds += seconds + incorrect * 1200;
          }
        });
        const totalPenalty = Math.floor(totalSeconds / 60);

        rankedData.push({
          rowIndex,
          name,
          vjudgeHandle,
          score,
          totalPenalty,
          rowData: row
        });
      });

      rankedData.sort((a, b) => {
        if (parseInt(b.score) !== parseInt(a.score)) {
          return parseInt(b.score) - parseInt(a.score);
        }
        return a.totalPenalty - b.totalPenalty;
      });

      setRankData({ headers, problemColumns, rankedData, firstSolvers });
    } catch (err) {
      let errorMessage = `Error loading contest data: ${err.message}`;
      if (err.status === 404) {
        errorMessage += '. Please verify the contest or coders CSV URL in the metadata sheet.';
      }
      setError(errorMessage);
      console.error('Error fetching contest data:', err.message, { sheetUrl: contest.sheet, coders: contest.coders });
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (selectedContest) {
      loadContestData(selectedContest);
    }
  }, [selectedContest]);

  const filteredRankData = rankData.rankedData?.filter(entry =>
    entry.name.toLowerCase().includes(filter.toLowerCase()) ||
    entry.vjudgeHandle.toLowerCase().includes(filter.toLowerCase()) ||
    String(entry.rowIndex + 1).includes(filter.toLowerCase())
  ) || [];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-6"
    >
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-4xl font-bold mb-2"
      >
        <a
          href={selectedContest?.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-700 dark:text-indigo-300 hover:underline"
        >
          {selectedContest?.name || 'Contest Name'}
        </a>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-2"
      >
        {selectedContest?.date || 'Date and Time'}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-2"
      >
        {selectedContest?.description || 'No description available.'}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-6"
      >
        Problem Setter(s): {selectedContest?.problem_setters || 'N/A'}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="contest-select" className="font-semibold">Select Contest:</label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            id="contest-select"
            value={selectedContest ? JSON.stringify(selectedContest) : ''}
            onChange={(e) => setSelectedContest(JSON.parse(e.target.value))}
            className="px-3 py-2 rounded-md border border-gray-300 dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {contests.map(contest => (
              <option key={contest.name} value={JSON.stringify(contest)}>
                {contest.name}
              </option>
            ))}
          </motion.select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Filter by name, Vjudge, or rank..."
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
        transition={{ delay: 0.8 }}
        className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl"
      >
        {error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : rankData.rankedData?.length > 0 ? (
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-indigo-100 dark:bg-gray-700 dark:text-white">
              <tr>
                <th className="px-6 py-3 border-b">Rank</th>
                <th className="px-3 sm:px-4 py-3 border-b">Name</th>
                <th className="px-3 sm:px-4 py-3 border-b">Vjudge</th>
                <th className="px-6 py-3 border-b">Solved</th>
                <th className="px-6 py-3 border-b">Penalty</th>
                {rankData?.problemColumns?.map(col => (
                  <th key={col} className="px-2 sm:px-4 py-2 border-b">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRankData.map((entry, index) => (
                <motion.tr
                  key={entry.vjudgeHandle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-2 border-b">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-2 border-b">{entry.name}</td>
                  <td className="px-6 py-2 border-b">
                    <a
                      href={`https://vjudge.net/user/${entry.vjudgeHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {entry.vjudgeHandle}
                    </a>
                  </td>
                  <td className="px-6 py-2 border-b">{entry.score}</td>
                  <td className="px-6 py-2 border-b">{entry.totalPenalty}</td>
                  {rankData?.problemColumns?.map((col, colIndex) => {
                    const colName = rankData.headers[4 + colIndex] || '';
                    const cellValue = entry.rowData[colName] || '';
                    const { isSolved, incorrect } = parseSubmission(cellValue);
                    const isFirstSolver = rankData.firstSolvers[colName] === entry.rowIndex;
                    const cellClass = isSolved
                      ? isFirstSolver
                        ? 'bg-green-500 dark:bg-green-700'
                        : 'bg-green-100 dark:bg-green-900'
                      : incorrect > 0
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : '';
                    return (
                      <td key={col} className={`px-2 sm:px-4 py-2 border-b ${cellClass}`}>
                        {cellValue}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No valid participants found with matching Vjudge handles.
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}

export default Contests;