# ⚡ ProjectPulse

> **Monitor. Manage. Deliver.**
> An AI-assisted project governance and telemetry workspace: track progress, budgets, risks and team workload from a single dashboard.

![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📌 Problem Statement

Cross-functional teams often track work in disconnected tools, which leads to:

- **Blind spots in milestones**: roadblocks are found only after deadlines are missed.
- **Unchecked budget burn**: funds run out mid-project.
- **Uneven workloads**: some engineers are overloaded while others have spare capacity.
- **Reactive risk management**: problems are handled after they happen, not predicted.

## 🎯 Objective

ProjectPulse is a single-pane-of-glass platform that lets **Administrators, Project Creators, Project Managers and Team Members** monitor project health, inspect milestones, audit budgets, predict delays and act on mitigation playbooks, with an AI-style **PulseAI Copilot** to answer questions about any project.

---

## 🚀 Features

| Module | Page | What it does |
|---|---|---|
| **Landing page** | `landing.html` | Product overview and entry point to the app. |
| **Authentication** | `login.html`, `register.html` | Role-based login and sign-up, with one-click demo profiles. |
| **Executive Dashboard** | `index.html` | KPI cards (Total / Active / Completed / Delayed), planned-vs-actual progress chart, ongoing projects, alerts. |
| **Project Portfolio** | `projects.html` | Search, status filter, create-project modal, project-folder selection (file count and tech stack detection). |
| **Project Details** | `project-details.html` | Circular progress gauge, budget utilization, milestone roadmap, task tracker, *Update Progress* modal, report download, embedded Copilot. |
| **Reports & Analytics** | `reports.html` | Project and time-range filters, line and doughnut charts, cross-project audit table, executive insights. |
| **Risk Monitor** | `risk-monitor.html` | Risk scores (0–100), delay-probability prediction, risk filters, mitigation playbooks, *Run Smart Analysis*. |
| **Team & Capacity** | `team.html` | Team KPIs, role filter and search, add-member modal, workload bars. |
| **PulseAI Copilot** | `copilot.html` | Chat assistant for status, budget, risk and milestone questions about the selected project. |

### Highlights

- 🔌 **Backend-first with graceful fallback**: `api.js` talks to the REST API and SQLite database, and falls back to `localStorage` automatically if the server is offline.
- 🔐 **JWT authentication** with role-scoped access (non-admins only see their own projects).
- 🤖 **PulseAI Copilot** answers *status, budget, risk* and *milestone* queries, with a local analytics generator when the backend is unreachable.
- 📊 **Interactive charts** built with Chart.js.

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3 (custom design system with CSS variables, Grid and Flexbox)
- Vanilla ES6 JavaScript with a shared API client (`api.js`)
- [Chart.js](https://www.chartjs.org/) (CDN) for charts
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter)

**Backend**
- Node.js + Express 5 (REST API, static file hosting)
- SQLite (embedded database)
- `bcryptjs` for password hashing, `jsonwebtoken` for sessions, `cors`, `dotenv`

**Tooling**
- Vite, TypeScript, Tailwind CSS and PostCSS (configured for the optional React/TypeScript build)
- Other installed libraries: React 18, React Router, Recharts, Leaflet, jsPDF

---

## 📂 Project Structure

```text
.
├── backend/
│   ├── server.js            # Express REST API + static file host (port 5050)
│   ├── database.js          # SQLite connection, schema and seed data
│   └── projectpulse.db      # SQLite database file (generated on first run)
├── api.js                   # Frontend API client with localStorage fallback
├── landing.html             # Marketing / landing page
├── login.html               # Login
├── register.html            # Registration
├── index.html               # Executive dashboard
├── projects.html            # Project portfolio
├── project-details.html     # Single-project drill-down
├── reports.html             # Reports & analytics
├── risk-monitor.html        # Risk monitor & delay prediction
├── team.html                # Team & workload
├── copilot.html             # PulseAI Copilot Studio
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18 or newer** (22+ recommended)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5050
JWT_SECRET=change_this_to_a_long_random_string
```

> `.env` is already listed in `.gitignore`, so your secrets will not be committed.

### 4. Start the server

```bash
npm run server
```

You should see the server start on port **5050**.

### 5. Open the app

Go to **http://localhost:5050** in your browser.

> 💡 You can also open the HTML files directly. If the backend is not running, the app switches to `localStorage` mode automatically.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@projectpulse.com` | `admin123` |
| Project Manager | `pm@projectpulse.com` | `pm123` |
| Team Member (Dev) | `dev@projectpulse.com` | `dev123` |
| Team Member (Analyst) | `analyst@projectpulse.com` | `analyst123` |
| Team Member (Designer) | `designer@projectpulse.com` | `designer123` |

The login page also has quick-fill buttons for each profile. You can create your own account from the **Register** page.

> ⚠️ These credentials are for demo purposes only. Remove them before any real deployment.

---

## 🌐 REST API

Base URL: `http://localhost:5050/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend and database health check |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `POST` | `/auth/register` | Create a new account |
| `GET` | `/projects` | List projects (`?status=` and `?search=` filters) |
| `GET` | `/projects/:id` | Project details and progress history |
| `POST` | `/projects` | Create a project |
| `PUT` | `/projects/:id/progress` | Update progress and log a note |
| `GET` | `/team` | List team members (`?role=` and `?search=` filters) |
| `POST` | `/team` | Add a team member |
| `GET` | `/reports/kpis` | Aggregate portfolio KPIs |
| `POST` | `/chat` | Ask the PulseAI Copilot about a project |

Protected endpoints expect an `Authorization: Bearer <token>` header.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run server` | Start the Express + SQLite backend |
| `npm start` | Same as `npm run server` |
| `npm run dev` | Start the Vite dev server (port 3000) |
| `npm run build` | Type-check and build with Vite |
| `npm run preview` | Preview the Vite production build |

---

## 🔮 Roadmap

- [ ] Real LLM integration for PulseAI Copilot (OpenAI / Gemini / Claude API)
- [ ] ML-based delay prediction trained on historical project data
- [ ] OAuth sign-in (Google, GitHub)
- [ ] Email and Slack alerts for delays and budget overruns
- [ ] PDF and Excel export of reports
- [ ] Granular role-based access control
- [ ] Cloud database (PostgreSQL / Firebase) and deployment

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👥 Team

| Role | Name |
|---|---|
| Lead Full-Stack Developer | _Your Name_ |
| UI/UX Designer & Product Lead | _Your Name_ |
| Data & AI Specialist | _Your Name_ |

---

## 📄 License

Released under the **MIT License**. See [`LICENSE`](LICENSE) for details.
