# ⚡ ProjectPulse
> **“Monitor. Manage. Deliver.”**  
> Modern Integrated Enterprise Project Governance & Telemetry Workspace (24-Hour Hackathon Demo Edition)

---

## 📌 Problem Statement
Modern enterprise initiatives and cross-functional technology teams often struggle with fragmented visibility across disparate tracking tools. Stakeholders, project managers, and engineers frequently experience:
- **Blind spots in milestone schedules**, discovering roadblocks only after deadlines are breached.
- **Unchecked financial burn rates**, resulting in mid-project budget exhaustion.
- **Uneven team workload distribution**, triggering engineer burnout and critical path delays.
- **Reactive rather than predictive risk management**, lacking proactive intelligence to prevent milestone slippage.

---

## 🎯 Project Objective
**ProjectPulse** provides a centralized, single-pane-of-glass project monitoring platform. It empowers Administrators, Project Managers, and Team Members to track real-time project health, inspect milestone timelines, analyze financial efficiency, predict delivery delays using AI-styled analytics, and safeguard deadlines through automated mitigation playbooks.

---

## 🚀 Core Features

### 1. Modern Split-Screen Authentication (`login.html`)
- Professional split-screen hero layout with gradient styling and feature showcase.
- Demo authentication with quick auto-fill helper for hackathon judges.
- Multi-role support: **Administrator**, **Project Manager**, **Team Member**.
- State persistence in browser `localStorage`.

### 2. Executive Dashboard (`index.html`)
- KPI summary widgets: Total Projects (24), Active (18), Completed (5), Delayed (3).
- **Chart.js** Line Chart: Planned Progress vs Actual Progress trajectory across 9 months.
- Ongoing Projects telemetry panel with real-time progress bars and direct drill-down links.
- Recent Tasks & Milestones table with priority badges.
- Live alert notifications for delayed deliverables and budget limits.

### 3. Project Portfolio Management (`projects.html`)
- Real-time search by project name or project code.
- Dynamic status filtering: *All*, *In Progress*, *Completed*, *Delayed*, *Planned*.
- Interactive **"Add New Project"** modal that generates and persists new projects to `localStorage`.
- Comprehensive project cards displaying project codes, team size, target deadline, status badge, and progress bar.

### 4. Deep Project Drill-Down (`project-details.html`)
- Synchronized with active project selected from portfolio.
- **Circular SVG progress meter** and overall completion indicator.
- Financial audit metric: Budget used vs total allocated with color-coded utilization bar.
- Five-stage **Milestone Roadmap Timeline** (Planning, UI/UX, Database/API, Dashboard, Testing/Deployment).
- Interactive **"Update Progress"** modal that updates circular gauge and progress bars instantly in the DOM and `localStorage`.
- Granular task tracker with assigned engineers, priority badges, and completion meters.

### 5. Reports & Analytics (`reports.html`)
- Filter by project selection and time horizon (Last 30 Days, Q1-Q2, Year-to-Date, Lifecycle).
- Dual analytical visualizations using **Chart.js**:
  - **Line Chart**: Planned vs Actual Milestone Delivery over 6 months.
  - **Doughnut Chart**: Granular Task Status Distribution (Completed, In Progress, Delayed, Planned).
- Cross-project performance audit table.
- **Smart Executive Insights** panel highlighting budget risks, top-performing projects, and velocity trends.

### 6. Risk Monitor & AI Prediction (`risk-monitor.html`)
- High-priority alert banner for projects requiring immediate triage.
- Risk level filtering: *All*, *High Risk*, *Medium Risk*, *Low Risk*.
- Detailed risk cards featuring composite risk scores (0–100), categories, and root cause factors.
- **AI-Style Predictive Engine**: Delay probability gauge, model prediction confidence (92%), and portfolio resiliency index.
- One-click **Executive Mitigation Playbooks** (Reassign Resources, Review Budget, Update Delivery Timeline).
- **"Run Smart Analysis"** interactive modal providing diagnostic action items.

### 7. Team & Capacity Management (`team.html`)
- Team KPIs: Total Team Members, Available, Overloaded, and Average Task Completion.
- Instant search and role filter (*Project Manager*, *Frontend Developer*, *Backend Developer*, *UI/UX Designer*, *Data Analyst*).
- **"Add Team Member"** modal with automatic initials avatar generator and `localStorage` persistence.
- Visual workload capacity bars and one-click workload audit breakdown.

---

## 💻 Technology Stack
- **HTML5**: Semantic document structuring with accessible forms and modals.
- **CSS3**: Custom design system using variables, CSS Grid, Flexbox, smooth transitions, and responsive media queries.
- **Vanilla ES6 JavaScript**: Zero-dependency logic for modals, filtering, search, and dynamic DOM rendering.
- **Chart.js (CDN)**: Interactive HTML5 Canvas data visualizations.
- **Google Fonts (Inter)**: Clean, modern enterprise typography.
- **Node.js & Express**: High-performance RESTful API microservice with CORS support.
- **SQLite Database (`node:sqlite`)**: Server-grade embedded relational database with WAL (Write-Ahead-Logging) mode and zero configuration.
- **HTML5 & CSS3**: Custom design system using CSS variables, Flexbox, Grid, and smooth transitions.
- **Vanilla ES6 JavaScript & Client API**: Zero-dependency logic with seamless fallback between SQLite and localStorage.
- **Chart.js (CDN)**: Interactive HTML5 Canvas data visualizations.
- **Google Fonts (Inter)**: Modern enterprise typography.

---

## 📂 Complete Folder Structure

```text
d:\Antigravity project/
├── backend/
│   ├── database.js         # SQLite connection, table schemas, and automated seeding
│   ├── server.js           # Express REST API server & static file host (Port 5050)
│   └── projectpulse.db     # Persistent SQLite database file
├── api.js                  # Frontend connector: calls SQLite backend or falls back to localStorage
├── login.html              # Split-screen login page with demo authentication
├── index.html              # Main executive telemetry dashboard with KPIs and Chart.js
├── projects.html           # Project portfolio management, search, filter, and creation modal
├── project-details.html    # Deep project drill-down with circular progress, timeline, and task tracker
├── reports.html            # Portfolio analytics, monthly trends, and doughnut chart distribution
├── risk-monitor.html       # AI-style risk prediction, delay probability, and mitigation playbooks
├── team.html               # Team member roster, role filtering, and capacity workload tracking
├── package.json            # Node.js project manifest and execution scripts
└── README.md               # Complete project documentation and run guide
```

---

## 🚀 How to Run the Backend & Database

### Step 1: Start the Backend Server
In your terminal or PowerShell at `D:\Antigravity project`, run:
```powershell
node backend/server.js
```
*(or using npm: `npm run server`)*

You will see:
```text
====================================================
⚡ ProjectPulse Backend Server running on port 5050
🌐 Full Application URL: http://localhost:5050
📊 REST API Root:        http://localhost:5050/api/projects
💾 Database:             SQLite (projectpulse.db)
====================================================
```

### Step 2: Open the Application
Open your browser and navigate to:
```text
http://localhost:5050
```
This loads both the frontend and connects directly to the **SQLite database**!

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & issue session |
| `GET` | `/api/projects` | List all projects (supports `?status=` and `?search=`) |
| `GET` | `/api/projects/:id` | Get project detail & progress audit history |
| `POST` | `/api/projects` | Create a new project in SQLite |
| `PUT` | `/api/projects/:id/progress` | Update project progress % and record audit log |
| `GET` | `/api/team` | List all team members (supports `?role=`) |
| `POST` | `/api/team` | Add new team member to SQLite |
| `GET` | `/api/reports/kpis` | Real-time aggregate KPIs (progress, budget, tasks) |
| `GET` | `/api/health` | Backend and database health status |

---

## 🔑 Demo Login Credentials

For testing and hackathon evaluation, click the **"Auto Fill"** button on the login screen or enter:

| Parameter | Value |
|---|---|
| **Email** | `admin@projectpulse.com` |
| **Password** | `admin123` |
| **Supported Roles** | Administrator, Project Manager, Team Member |

*Note: You can switch roles from the dropdown to experience different operational contexts.*

---

## 🔮 Future Enhancements
- **Cloud Database Integration**: Migration to Firebase Firestore or PostgreSQL for multi-tenant enterprise data.
- **Real-Time Authentication**: Firebase Authentication with OAuth (Google, GitHub, SAML SSO).
- **Automated Email & Slack Webhooks**: Immediate dispatch of delay and budget escalation alerts.
- **Production ML Risk Engine**: Python-based scikit-learn / TensorFlow pipeline trained on historical Jira/Git telemetry to predict sprint slip probabilities.
- **Client-Side Document Export**: Native client-side PDF (`jspdf`) and Excel (`xlsx`) automated executive exports.
- **Granular RBAC**: Role-based access control rules constraining write operations to authorized administrators.

---

## 👥 Hackathon Team Placeholder
- **Lead Full-Stack Developer**: Team Member 1
- **UI/UX Designer & Product Lead**: Team Member 2
- **Data & AI Systems Specialist**: Team Member 3

---

## 📄 License
This project is open-source and released under the **MIT License**.
