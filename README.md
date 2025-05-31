# ICE Programming Club Website

Welcome to the official website of the ICE Programming Club, a dedicated platform for competitive programming enthusiasts at the Department of Information and Communication Engineering, University of Rajshahi. This website showcases our coders, tracks contest rankings, and provides a modern, user-friendly interface for the programming community.

## Features

- **Coders List**: View a comprehensive list of club members with their profiles on platforms like Codeforces, Vjudge, Atcoder, and Codechef, sourced from a Google Sheet.
- **Contest Rankings**: Explore detailed rankings for ICE Programming Club contests, including scores, penalties, and problem statuses, pulled from Google Sheets.
- **Modern Design**: Features a sleek navbar with glassmorphism, animated logo, and responsive layout.
- **Animations**: Smooth Framer Motion animations for page transitions, table rows, and interactive elements.
- **Dark/Light Mode**: Toggle between themes with an animated sliding switch (sun/moon icons).
- **Progressive Web App (PWA)**: Installable on devices with offline support.
- **Routes**:
  - `/` or `/home`: Landing page with club information.
  - `/coders`: Coders list with filtering.
  - `/contests`: Contest rankings with contest selection and filtering.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Framer Motion
- **Data**: PapaParse for CSV parsing from Google Sheets
- **Deployment**: GitHub Pages
- **Build Tools**: Create React App, PostCSS, Autoprefixer

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/saifullahmnsur-again/icepc-contests.git
   cd icepc-contests
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm start
   ```
   - Open `http://localhost:3000/icepc-contests` in your browser.
   - The root URL (`http://localhost:3000/`) redirects to `/icepc-contests`.

### Project Structure

```
icepc-contests/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
├── src/
│   ├── Components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Home.jsx
│   │   ├── Coders.jsx
│   │   ├── Contests.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
```

## Deployment

The website is hosted on GitHub Pages at `https://saifullahmnsur-again.github.io/icepc-contests`.

### Deploying to GitHub Pages

1. **Update `package.json`**:
   - Ensure `"homepage": "https://saifullahmnsur-again.github.io/icepc-contests"`.
   - Replace `saifullahmnsur-again  ` with your GitHub username.

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
     ```bash
     npm run deploy
     ```

4. **Configure GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Set **Source** to `gh-pages` branch, `/ (root)` folder.
   - Save and wait 1–5 minutes.
   - Access the site at `https://saifullah123.github.io/icepc-contests`.

## Data Sources

- **Coders**: [Google Sheet CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vS_rvXyZpvU4zsqMZ10-px2NULkBw5rfCTGUD2HHVYDAjUdZuDuxbgjtkjGtIWHD-lPkvHzLjlnC9Tq/pub?gid=0&single=true&output=csv)
- **Contests**: [Google Sheet CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vSXSB-zO1tuSWPCZEgENWdwJJezIyqmlksdwAulBsawNFVekKYlGn6dS0imxMq5qRNjHtB8MUWF0QLX/pub?gid=1861808501&single=true&output=csv)
- Ensure sheets are published as CSVs (`File > Share > Publish to web > CSV`).

## Troubleshooting

- **Blank Page Locally**:
  - Use `http://localhost:3000/icepc-contests`.
  - Clear cache:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    npm start
    ```
  - Check DevTools (`Ctrl+Shift+I`) for errors.

- **Deployment Issues**:
  - Verify `gh-pages` branch exists.
  - Check GitHub Pages settings.
  - Ensure `package.json` scripts include `predeploy` and `deploy`.

- **CSV Errors**:
  - Test CSV URLs in a browser.
  - Republish Google Sheets if inaccessible.

## Contributing

Contributions are welcome! Please fork the repository, create a branch, and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For inquiries, contact the ICE Programming Club at the Department of Information and Communication Engineering, University of Rajshahi.

---
Built with ❤️ for competitive programming enthusiasts and lots of AI!