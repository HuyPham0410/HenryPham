# Huy Pham — Personal Portfolio

A personal website for **Huy (Henry) Pham**, a Computer Science graduate from The University of Texas at San Antonio.

This portfolio brings together my background, technical skills, academic projects, and interests in software engineering, web development, and machine learning.

## About Me

I graduated from UTSA with a **B.S. in Computer Science in May 2026**. My project experience includes web application development, debugging, database integration, machine learning model validation, and technical research.

I am seeking entry-level opportunities where I can contribute, collaborate, and continue developing my skills.

## Explore the Website

- **Home** — A personal introduction, education highlights, and selected projects.
- **Work** — Project descriptions and my contributions to individual and team projects.
- **Resume** — Education, technical skills, languages, and a downloadable CV.
- **Contact** — Email, GitHub, and a contact form.

The interface uses a responsive monochrome design with rounded shapes, subtle motion, and keyboard-accessible navigation.

## Featured Projects

### NiceFit
A team clothing shop management website built with Node.js, EJS, MySQL, and JavaScript. My contributions focused on debugging application logic, integrating product data and images, and resolving page-rendering issues.

### Email Classification
A Python-based machine learning team project. My work included training and testing models, debugging training code, and validating prediction behavior.

### Federated Learning for Healthcare
Undergraduate research exploring privacy-preserving machine learning, including tradeoffs between predictive performance, privacy, and communication efficiency.

### Personal Portfolio
This website, built with reusable EJS templates, a Node.js backend, and a responsive Bootstrap layout.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Interface | EJS, HTML, CSS, Bootstrap 5.3.8 |
| Server | Node.js, Express |
| Contact storage | SQLite |
| Request protection | Helmet, CSRF protection, rate limiting |
| Testing | Node.js test runner, Supertest |
| Development | CommonJS, dotenv, nodemon |

## Run Locally

**Requirements:** Node.js 24 LTS recommended; minimum supported version is Node.js 22.12.

Clone the repository:

```bash
git clone https://github.com/HuyPham0410/HenryPham.git
cd HenryPham
npm ci
```

Create your local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

If you already have a `.env` file, keep your existing settings.

Start the development server:

```bash
npm run dev
```

Open **http://127.0.0.1:3000**.

If port `3000` is already in use, set another port in `.env`, then restart:

```env
PORT=3001
```

The application uses Node.js's built-in SQLite support. An experimental SQLite warning may appear on Node.js 22.12.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with automatic restarts |
| `npm start` | Start the server without file watching |
| `npm test` | Run automated tests |
| `npm run messages` | Read the latest contact messages locally as the server owner |

## Project Structure

```text
server.js                    Application entry point
nodemon.json                 Development watcher configuration
src/
  server.js                  HTTP server lifecycle
  app.js                     Express application setup
  config.js                  Environment configuration
  routes/                    URL routing
  controllers/               Request and response handling
  services/                  Contact validation
  repositories/              SQLite access
  middleware/                Request protection
  data/content.js            Portfolio and resume content
  views/
    pages/                   Home, Work, Resume, Contact, and status pages
    partials/                Shared header and footer
public/
  css/                       Custom styles
  images/                    Portfolio images
  documents/                 Downloadable CV
  vendor/bootstrap/          Locally bundled Bootstrap CSS and license
scripts/                     Local maintenance utilities
test/                        Automated tests
docs/                        Development and maintenance notes
data/                        Runtime database files, excluded from Git
```

## Updating the Portfolio

- Edit **`src/data/content.js`** to update biography, education, skills, and project descriptions.
- Edit **`src/views/pages/`** to change page layouts.
- Edit **`src/views/partials/`** to update shared navigation and footer content.
- Edit **`public/css/site.css`** to customize the visual design.
- Replace **`public/documents/Huy-Pham-CV.pdf`** to update the downloadable CV. Keep the filename consistent with the link in `content.js`.

## Contact Form

The contact form validates submissions on the server and stores accepted messages in SQLite. It includes CSRF protection, request-size limits, and rate limiting.

Messages are **stored on the server, not sent by email**. There is currently no public administration dashboard or login system.

Environment secrets and runtime database files are excluded from version control.

## Deployment

This application requires a hosting environment that runs **Node.js**. GitHub stores the source code; **GitHub Pages cannot run the Express/EJS backend**.

For deployment, configure HTTPS, production environment variables, and persistent storage for SQLite. See the [security and deployment notes](docs/03-BAO-MAT-TRIEN-KHAI.md) for configuration details.

## Connect

- **GitHub:** [HuyPham0410](https://github.com/HuyPham0410)
- **Email:** [giahuyphamm@gmail.com](mailto:giahuyphamm@gmail.com)
