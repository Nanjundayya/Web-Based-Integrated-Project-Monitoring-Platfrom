/**
 * ProjectPulse Unified Client API Connector
 * Seamlessly connects frontend pages to the backend REST API & SQLite database.
 * If the backend is running at http://localhost:5050, it synchronizes with SQLite.
 * If the backend is offline, it gracefully falls back to localStorage.
 */

const API_BASE_URL = window.location.origin.includes('5050')
  ? `${window.location.origin}/api`
  : 'http://localhost:5050/api';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('projectPulseUser') || 'null');
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const user = getCurrentUser();
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
}

const ProjectPulseAPI = {
  // Test backend availability
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Login
  async login(email, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('projectPulseUser', JSON.stringify(data.user));
        return data;
      }
      throw new Error(data.message || 'Invalid credentials');
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;

      // LocalStorage fallback for all demo and registered accounts
      const fallbackAccounts = {
        'admin@projectpulse.com': { password: 'admin123', name: 'Alex Rivera (Admin)', role: 'Administrator' },
        'pm@projectpulse.com': { password: 'pm123', name: 'Sarah Jenkins (PM)', role: 'Project Manager' },
        'dev@projectpulse.com': { password: 'dev123', name: 'David Chen (Dev)', role: 'Team Member' },
        'analyst@projectpulse.com': { password: 'analyst123', name: 'Elena Rostova (Analyst)', role: 'Team Member' },
        'designer@projectpulse.com': { password: 'designer123', name: 'Marcus Novak (UI/UX)', role: 'Team Member' },
        'frontend@projectpulse.com': { password: 'frontend123', name: 'Aisha Al-Mansoor (Dev)', role: 'Team Member' }
      };

      // Check registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('projectPulseRegisteredUsers') || '{}');
      const allAccounts = { ...fallbackAccounts, ...registeredUsers };

      const matched = allAccounts[email];
      if (matched && matched.password === password) {
        const user = {
          email,
          name: matched.name,
          role: matched.role || 'Project Creator',
          isScopedUser: matched.isScopedUser || false,
          loggedIn: true
        };
        localStorage.setItem('projectPulseUser', JSON.stringify(user));
        return { success: true, user };
      }
      throw err;
    }
  },

  // Auth: Register New User
  async register(name, email, password, role = 'Project Creator') {
    const allowedRoles = ['Project Creator', 'Project Manager', 'Team Member'];
    if (!allowedRoles.includes(role)) {
      throw new Error('Registration is only allowed for user roles.');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('projectPulseUser', JSON.stringify(data.user));
        return data;
      }
      throw new Error(data.message || 'Failed to register account');
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      console.warn('Backend offline or registration error, saving to localStorage:', err);
      // LocalStorage fallback for registration
      const registeredUsers = JSON.parse(localStorage.getItem('projectPulseRegisteredUsers') || '{}');
      if (registeredUsers[email]) {
        throw new Error('An account with this email address already exists.');
      }

      registeredUsers[email] = {
        name,
        email,
        password,
        role,
        isScopedUser: true
      };
      localStorage.setItem('projectPulseRegisteredUsers', JSON.stringify(registeredUsers));

      const newUser = {
        name,
        email,
        role,
        isScopedUser: true,
        loggedIn: true,
        token: `jwt_local_${Date.now()}`
      };
      localStorage.setItem('projectPulseUser', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  },

  // Projects: Get All (supports status, search, and createdBy filtering)
  async getProjects(status = 'All', search = '', createdBy = '') {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/projects?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        // Sync with localStorage
        localStorage.setItem('projectPulseProjects', JSON.stringify(json.data));
        return json.data;
      }
      if (res.status === 401 || res.status === 403) return [];
    } catch (e) {
      console.warn('Backend unavailable, using localStorage fallback', e);
    }

    const user = getCurrentUser();
    let localProjects = JSON.parse(localStorage.getItem('projectPulseProjects') || '[]');
    if (!user || user.role !== 'Administrator') {
      localProjects = localProjects.filter(p => user && (p.created_by === user.email || p.createdBy === user.email));
    }
    if (status && status !== 'All') {
      localProjects = localProjects.filter(p => p.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      localProjects = localProjects.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.id && p.id.toLowerCase().includes(q)));
    }
    return localProjects;
  },

  // Projects: Create New
  async createProject(projectData) {
    const user = getCurrentUser();
    projectData.createdBy = user && user.email;

    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      if (res.status === 401 || res.status === 403) {
        const error = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error('Your session expired or is invalid. Sign out and sign in again, then retry.');
        }
        throw new Error(error.message || 'Your session is not authorized to create projects. Sign in again and retry.');
      }
    } catch (e) {
      if (!(e instanceof TypeError)) throw e;
      console.warn('Backend unavailable, saving locally', e);
    }

    // Local fallback
    const localProjects = JSON.parse(localStorage.getItem('projectPulseProjects') || '[]');
    const nextId = `PRJ-${100 + localProjects.length + 1}`;
    const initialProg = Number(projectData.progress) || 0;
    const newProj = {
      id: nextId,
      ...projectData,
      progress: initialProg,
      created_by: projectData.createdBy,
      folder_name: projectData.folderName || projectData.folder_name || '',
      files_count: projectData.filesCount || projectData.files_count || 0,
      tech_stack: projectData.techStack || projectData.tech_stack || '',
      budget: 150000,
      budget_used: Math.round((initialProg / 100) * 150000),
      risk_score: projectData.status === 'Delayed' ? 82 : (projectData.status === 'Planned' ? 40 : 25),
      risk_level: projectData.status === 'Delayed' ? 'High Risk' : (projectData.status === 'Planned' ? 'Medium Risk' : 'Low Risk'),
      tasks_completed: Math.round((initialProg / 100) * 20),
      tasks_total: 20,
      milestones_completed: Math.round((initialProg / 100) * 5),
      milestones_total: 5
    };
    localProjects.unshift(newProj);
    localStorage.setItem('projectPulseProjects', JSON.stringify(localProjects));
    return newProj;
  },

  // Projects: Update Progress
  async updateProgress(projectId, progress, note = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ progress, note })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      if (res.status === 401 || res.status === 403) return null;
    } catch (e) {
      console.warn('Backend unavailable, updating locally', e);
    }

    // Local fallback
    const localProjects = JSON.parse(localStorage.getItem('projectPulseProjects') || '[]');
    const index = localProjects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      localProjects[index].progress = Number(progress);
      if (Number(progress) === 100) localProjects[index].status = 'Completed';
      localStorage.setItem('projectPulseProjects', JSON.stringify(localProjects));
      return localProjects[index];
    }
    return null;
  },

  // Chatbot: PulseAI Project Copilot
  async chat(projectId, message) {
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ projectId, message })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      if (res.status === 401 || res.status === 403) {
        return { reply: 'You do not have access to this project.' };
      }
    } catch (e) {
      console.warn('Backend chat offline, using intelligent frontend analytics generator', e);
    }

    // Intelligent local fallback generator grounded in active project
    let project = null;
    const stored = localStorage.getItem('projectPulseSelectedProject');
    if (stored) {
      try {
        const p = JSON.parse(stored);
        if (p.id === projectId) project = p;
      } catch {}
    }

    if (!project) {
      const list = JSON.parse(localStorage.getItem('projectPulseProjects') || '[]');
      project = list.find(p => p.id === projectId) || {
        id: projectId,
        name: 'Active Project',
        progress: 75,
        status: 'In Progress',
        budget: 150000,
        budget_used: 112500,
        deadline: '2026-10-30',
        milestones_completed: 3,
        milestones_total: 5,
        tasks_completed: 18,
        tasks_total: 24,
        risk_score: 25,
        risk_level: 'Low Risk'
      };
    }

    const budgetBurnPct = Math.round(((project.budget_used || 0) / (project.budget || 150000)) * 100);
    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('status') || msg.includes('overview') || msg.includes('health') || msg.includes('summary')) {
      reply = `📊 **Executive Status for ${project.name} (${project.id})**:\n\n` +
        `• **Current Progress:** ${project.progress}% completed\n` +
        `• **Lifecycle Phase:** ${project.status}\n` +
        `• **Target Deadline:** ${project.deadline || '2026-10-30'}\n` +
        `• **Milestone Sign-Offs:** ${project.milestones_completed || 3} of ${project.milestones_total || 5} stages verified\n` +
        `• **Sprint Tasks:** ${project.tasks_completed || 18}/${project.tasks_total || 24} deliverables closed\n\n` +
        (project.status === 'Delayed'
          ? `⚠️ *Attention Required: This project is flagged as Delayed due to milestone bottlenecks.*`
          : `✓ *Operating on target delivery velocity.*`);
    } else if (msg.includes('budget') || msg.includes('cost') || msg.includes('burn') || msg.includes('financial') || msg.includes('money')) {
      const budgetRemaining = (project.budget || 150000) - (project.budget_used || 0);
      reply = `💰 **Financial & Budget Audit for ${project.name}**:\n\n` +
        `• **Total Allocated Ceiling:** ₹${(project.budget || 150000).toLocaleString('en-IN')}\n` +
        `• **Capital Burned to Date:** ₹${(project.budget_used || 0).toLocaleString('en-IN')} (${budgetBurnPct}%)\n` +
        `• **Remaining Runway:** ₹${budgetRemaining.toLocaleString('en-IN')}\n\n` +
        (budgetBurnPct > 80
          ? `⚠️ **Warning:** Budget burn rate (${budgetBurnPct}%) is outpacing progress (${project.progress}%). We recommend financial throttling on external vendor APIs.`
          : `✓ Financial consumption is healthy and aligned with the sprint burn curve.`);
    } else if (msg.includes('risk') || msg.includes('delay') || msg.includes('mitigat') || msg.includes('threat') || msg.includes('problem')) {
      reply = `⚠️ **AI Risk & Delay Analysis for ${project.name}**:\n\n` +
        `• **Composite Risk Score:** ${project.risk_score || 25}/100 (${project.risk_level || 'Low Risk'})\n` +
        `• **Current Status:** ${project.status}\n\n` +
        `🎯 **Recommended Mitigations:**\n` +
        `1. Reallocate 1–2 developers from completed initiatives to accelerate high-priority tasks.\n` +
        `2. Automate regression testing before the upcoming milestone sign-off.\n` +
        `3. Conduct a 15-minute daily cross-squad standup to resolve blocking dependencies early.`;
    } else if (msg.includes('milestone') || msg.includes('timeline') || msg.includes('next') || msg.includes('sprint') || msg.includes('roadmap') || msg.includes('step')) {
      reply = `🎯 **Milestone & Sprint Roadmap for ${project.name}**:\n\n` +
        `• **Completed Milestones:** ${project.milestones_completed || 3}/${project.milestones_total || 5}\n` +
        `• **Upcoming Major Gate:** Phase ${(project.milestones_completed || 3) + 1} validation review\n` +
        `• **Sprint Tasks Pending:** ${(project.tasks_total || 24) - (project.tasks_completed || 18)} deliverable items\n` +
        `• **Target Delivery Date:** ${project.deadline || '2026-10-30'}\n\n` +
        `💡 *Recommendation:* Focus sprint efforts on closing open API schema reviews to unlock staging validation.`;
    } else {
      reply = `🤖 **PulseAI Copilot Intelligence for ${project.name}**:\n\n` +
        `I am continuously monitoring real-time telemetry for **${project.name} (${project.id})**.\n\n` +
        `• **Progress:** ${project.progress}%\n` +
        `• **Status:** ${project.status}\n` +
        `• **Risk Score:** ${project.risk_score || 25}/100 (${project.risk_level || 'Low Risk'})\n` +
        `• **Budget Burn:** ₹${(project.budget_used || 0).toLocaleString('en-IN')} / ₹${(project.budget || 150000).toLocaleString('en-IN')} (${budgetBurnPct}%)\n` +
        `• **Deadline:** ${project.deadline || '2026-10-30'}\n\n` +
        `You can ask me to **"Audit budget"**, **"Analyze delays"**, **"List risks"**, or **"Recommend next steps"**!`;
    }

    return {
      reply,
      timestamp: new Date().toISOString(),
      projectName: project.name,
      projectId: project.id
    };
  },

  // Team: Get All Members
  async getTeam(role = 'All', search = '') {
    try {
      const params = new URLSearchParams();
      if (role !== 'All') params.append('role', role);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/team?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem('projectPulseTeam', JSON.stringify(json.data));
        return json.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, using localStorage fallback', e);
    }
    return JSON.parse(localStorage.getItem('projectPulseTeam') || '[]');
  },

  // Team: Add Member
  async addTeamMember(memberData) {
    try {
      const res = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, saving member locally', e);
    }

    const localTeam = JSON.parse(localStorage.getItem('projectPulseTeam') || '[]');
    const newMember = { id: `TM-${localTeam.length + 1}`, ...memberData };
    localTeam.unshift(newMember);
    localStorage.setItem('projectPulseTeam', JSON.stringify(localTeam));
    return newMember;
  },

  // KPIs: Summary
  async getKPIs() {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/kpis`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Backend unavailable, calculating locally', e);
    }
    return null;
  }
};

window.ProjectPulseAPI = ProjectPulseAPI;
