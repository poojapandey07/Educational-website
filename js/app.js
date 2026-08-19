// DSA Practice Platform - Main Application Controller

const AppRouter = {
  currentView: "landing",

  init() {
    // Attach nav listeners
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = e.currentTarget.getAttribute("data-view");
        this.navigateTo(targetView);
      });
    });

    // Landing screen listeners
    document.getElementById("btn-landing-enter").addEventListener("click", () => {
      this.navigateTo("dashboard");
    });
    document.getElementById("btn-hero-practice").addEventListener("click", () => {
      this.navigateTo("lang-select");
    });
    document.getElementById("btn-hero-concepts").addEventListener("click", () => {
      this.navigateTo("concepts");
    });

    // Language selection card listener
    let tempSelectedLang = "";
    document.querySelectorAll(".lang-card").forEach(card => {
      card.addEventListener("click", (e) => {
        document.querySelectorAll(".lang-card").forEach(c => c.classList.remove("selected"));
        
        const cardElem = e.currentTarget;
        cardElem.classList.add("selected");
        tempSelectedLang = cardElem.getAttribute("data-lang");
        
        document.getElementById("btn-confirm-lang").disabled = false;
      });
    });

    document.getElementById("btn-confirm-lang").addEventListener("click", () => {
      if (tempSelectedLang) {
        window.AppStore.setLanguage(tempSelectedLang);
        this.navigateTo("dashboard");
      }
    });

    // Mobile Hamburger
    const hamburger = document.getElementById("btn-hamburger");
    const sidebar = document.getElementById("app-sidebar");
    if (hamburger && sidebar) {
      hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
      
      // Close sidebar on navigation click (mobile)
      document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
          sidebar.classList.remove("mobile-open");
        });
      });
    }

    // Global Search redirect
    const searchInput = document.getElementById("global-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();
        // Force navigate to problems view to display filtered table
        if (this.currentView !== "problems") {
          this.navigateTo("problems");
        }
        this.renderProblemsTable(query);
      });
    }

    // Settings actions
    document.getElementById("btn-reset-storage").addEventListener("click", () => {
      if (confirm("This will erase all solved problems, streaks, and quiz histories. Proceed?")) {
        window.AppStore.resetAll();
        alert("Platform storage cache cleared.");
        window.location.reload();
      }
    });

    document.getElementById("btn-settings-lang-switch").addEventListener("click", () => {
      this.navigateTo("lang-select");
    });

    // Achievements unlocking toast listener
    window.addEventListener("achievements-unlocked", (e) => {
      const achievements = e.detail;
      achievements.forEach(achId => {
        this.showAchievementToast(achId);
      });
    });

    // Concept details triggers
    document.getElementById("btn-concept-back").addEventListener("click", () => {
      this.navigateTo("concepts");
    });

    // Binders for problem sorting/filters
    const filters = ["filter-topic", "filter-difficulty", "filter-frequency", "filter-status"];
    filters.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => this.renderProblemsTable());
    });
    
    document.getElementById("btn-reset-filters").addEventListener("click", () => {
      filters.forEach(id => { document.getElementById(id).value = "all"; });
      this.renderProblemsTable();
    });

    // Initial check
    this.updateHeader();
  },

  navigateTo(viewName) {
    const hasLang = window.AppStore.getLanguage();

    // Check if redirect is needed to Language Selection
    if (viewName !== "landing" && viewName !== "lang-select" && !hasLang) {
      this.navigateTo("lang-select");
      return;
    }

    this.currentView = viewName;

    // Toggle high-level container groups
    const landingView = document.getElementById("view-landing");
    const langSelectView = document.getElementById("view-lang-select");
    const mainDashboardLayout = document.getElementById("app-dashboard-layout");

    landingView.style.display = "none";
    langSelectView.style.display = "none";
    mainDashboardLayout.style.display = "none";

    if (viewName === "landing") {
      landingView.style.display = "flex";
    } else if (viewName === "lang-select") {
      langSelectView.style.display = "flex";
      // Pre-select current lang in select view if exists
      if (hasLang) {
        const activeCard = document.querySelector(`.lang-card[data-lang="${hasLang}"]`);
        if (activeCard) activeCard.click();
      }
    } else {
      mainDashboardLayout.style.display = "flex";

      // Hide all child views in main-content
      document.querySelectorAll(".content-view").forEach(v => {
        v.classList.remove("active");
      });

      // Show target child view
      const targetChild = document.getElementById(`view-${viewName}`);
      if (targetChild) {
        targetChild.classList.add("active");
      }

      // Update sidebar nav active link state
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("data-view") === viewName) {
          link.classList.add("active");
        }
      });

      // Trigger view loaders
      this.loadViewContext(viewName);
    }

    this.updateHeader();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  loadViewContext(viewName) {
    switch (viewName) {
      case "dashboard":
        this.loadDashboardView();
        break;
      case "concepts":
        this.loadConceptsView();
        break;
      case "problems":
        this.renderProblemsTable();
        break;
      case "interviews":
        window.InterviewSimulator.init();
        break;
      case "quiz-config":
        window.QuizSystem.init();
        break;
      case "progress":
        this.loadProgressView();
        break;
      case "performance":
        this.loadPerformanceView();
        break;
    }
  },

  updateHeader() {
    const lang = window.AppStore.getLanguage();
    
    // Update top header language label
    const headerLang = document.getElementById("header-lang-name");
    if (headerLang) {
      const langNames = {
        c: "C",
        cpp: "C++",
        java: "Java",
        python: "Python",
        javascript: "JavaScript"
      };
      headerLang.innerText = langNames[lang] || "Not Selected";
    }

    // Update header progress counter
    const solvedCount = window.AppStore.getSolvedCount();
    const totalQCount = window.dsaQuestions.length;
    const progressPercent = totalQCount > 0 ? (solvedCount / totalQCount) * 100 : 0;

    const countLabel = document.getElementById("header-solved-count");
    if (countLabel) countLabel.innerText = `${solvedCount}/${totalQCount}`;

    const fillBar = document.getElementById("header-solved-fill");
    if (fillBar) fillBar.style.width = `${progressPercent}%`;
  },

  // Dashboard Context Loader
  loadDashboardView() {
    const stats = window.AppStore.getStats();

    document.getElementById("dash-streak-val").innerText = stats.currentStreak;
    document.getElementById("dash-solved-val").innerText = stats.solvedToday;
    document.getElementById("dash-accuracy-val").innerText = `${stats.accuracy}%`;
    document.getElementById("dash-time-val").innerText = `${Math.round(stats.avgSolvingTime / 60)}m`;
    document.getElementById("dash-readiness-val").innerText = `${stats.interviewReadiness}%`;

    // Radial Progress wheel
    const readinessFill = document.getElementById("radial-readiness-fill");
    if (readinessFill) {
      // SVG Circle perimeter is 2 * pi * r = 2 * 3.14159 * 70 = ~440px
      const perimeter = 440;
      const offset = perimeter - (stats.interviewReadiness / 100) * perimeter;
      readinessFill.style.strokeDashoffset = offset;
    }
    const readinessText = document.getElementById("dash-readiness-radial-text");
    if (readinessText) readinessText.innerText = `${stats.interviewReadiness}%`;

    // Recommendations list
    const recsList = document.getElementById("dash-recs-list");
    if (recsList) {
      recsList.innerHTML = "";
      
      const suggestions = [];
      
      // Streak suggestions
      if (stats.currentStreak === 0) {
        suggestions.push({
          icon: "⚡",
          title: "Establish your Streak",
          desc: "Complete any practice problem or quiz today to kick off your daily coding streak!"
        });
      }

      // Solved progression suggestions
      if (stats.solvedCount === 0) {
        suggestions.push({
          icon: "💡",
          title: "Start with Binary Search",
          desc: "Learn Binary Search theory in the Concepts tab and solve your first coding challenge."
        });
      } else {
        // Find an unsolved question
        const unsolved = window.dsaQuestions.find(q => !window.AppStore.isProblemSolved(q.id));
        if (unsolved) {
          suggestions.push({
            icon: "💻",
            title: `Solve: ${unsolved.title}`,
            desc: `Expand your skills. Practice this ${unsolved.difficulty} topic [${unsolved.topic}] now.`
          });
        }
      }

      // Quiz suggestions
      const quizRecords = window.AppStore.state.quizHistory;
      if (quizRecords.length === 0) {
        suggestions.push({
          icon: "⏱",
          title: "Take a Timed Quiz",
          desc: "Simulate test pressure. Set up a quick 5-minute Arrays MCQ challenge."
        });
      }

      suggestions.slice(0, 2).forEach(s => {
        const item = document.createElement("div");
        item.className = "activity-item";
        item.innerHTML = `
          <div style="display:flex; gap:0.75rem; align-items:center;">
            <span style="font-size:1.5rem;">${s.icon}</span>
            <div class="activity-desc">
              <span class="title">${s.title}</span>
              <span class="time">${s.desc}</span>
            </div>
          </div>
        `;
        recsList.appendChild(item);
      });
    }

    // Continue Practice trigger
    const continueBtn = document.getElementById("btn-dash-continue");
    if (continueBtn) {
      continueBtn.replaceWith(continueBtn.cloneNode(true)); // remove old listeners
      document.getElementById("btn-dash-continue").addEventListener("click", () => {
        const unsolved = window.dsaQuestions.find(q => !window.AppStore.isProblemSolved(q.id));
        if (unsolved) {
          this.navigateTo("ide");
          window.CodeEditor.init(document.getElementById("view-ide"), unsolved);
        } else {
          this.navigateTo("problems");
        }
      });
    }
  },

  // Concepts list Loader
  loadConceptsView() {
    const listContainer = document.getElementById("concepts-categories-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    // Group concepts by category
    const categories = {
      basics: { name: "Basics Concepts", list: [] },
      "data-structures": { name: "Data Structures", list: [] },
      algorithms: { name: "Algorithmic Paradigms", list: [] }
    };

    window.dsaConcepts.forEach(c => {
      if (categories[c.category]) {
        categories[c.category].list.push(c);
      }
    });

    Object.keys(categories).forEach(catId => {
      const cat = categories[catId];
      if (cat.list.length === 0) return;

      const catSec = document.createElement("div");
      catSec.className = "concept-category-section mb-lg";
      catSec.innerHTML = `
        <h3>${cat.name}</h3>
        <div class="concepts-grid"></div>
      `;

      const grid = catSec.querySelector(".concepts-grid");
      
      cat.list.forEach(c => {
        const card = document.createElement("div");
        card.className = "concept-card glass-panel neon-border";
        
        let freqIcon = "○";
        if (c.frequency === "Very Frequently Asked") freqIcon = "🔥";
        else if (c.frequency === "Frequently Asked") freqIcon = "⚡";
        else if (c.frequency === "Moderately Asked") freqIcon = "⭐";

        card.innerHTML = `
          <div class="concept-card-header">
            <span class="concept-card-title">${c.name}</span>
            <span class="badge ${c.difficulty.toLowerCase()}">${c.difficulty}</span>
          </div>
          <p class="concept-card-desc">${c.shortDesc}</p>
          <div class="concept-card-footer">
            <span class="freq-indicator text-muted">${freqIcon} ${c.frequency}</span>
            <button class="btn btn-secondary btn-xs btn-view-concept" data-concept-id="${c.id}">Learn</button>
          </div>
        `;
        
        card.querySelector(".btn-view-concept").addEventListener("click", () => {
          this.showConceptDetail(c.id);
        });

        grid.appendChild(card);
      });

      listContainer.appendChild(catSec);
    });
  },

  showConceptDetail(conceptId) {
    const c = window.dsaConcepts.find(concept => concept.id === conceptId);
    if (!c) return;

    this.navigateTo("concept-detail");

    document.getElementById("concept-detail-title").innerText = c.name;
    document.getElementById("concept-detail-time").innerText = c.detail.timeComplexity;
    document.getElementById("concept-detail-space").innerText = c.detail.spaceComplexity;
    document.getElementById("concept-detail-definition").innerText = c.detail.definition;
    document.getElementById("concept-detail-works").innerText = c.detail.howItWorks;

    // Steps list
    const stepsUl = document.getElementById("concept-detail-steps");
    stepsUl.innerHTML = c.detail.stepByStep.map(s => `<li>${s}</li>`).join("");

    // Real Use cases
    const casesUl = document.getElementById("concept-detail-cases");
    casesUl.innerHTML = c.detail.realInterviewUseCases.map(s => `<li>${s}</li>`).join("");

    // Common mistakes
    const mistakesUl = document.getElementById("concept-detail-mistakes");
    mistakesUl.innerHTML = c.detail.commonMistakes.map(s => `<li>${s}</li>`).join("");

    // Practice button redirect
    const practiceBtn = document.getElementById("btn-concept-practice");
    practiceBtn.replaceWith(practiceBtn.cloneNode(true)); // clear old listeners
    
    // Find matching practice question
    const qId = c.practiceQuestions[0];
    const q = window.dsaQuestions.find(dq => dq.id === qId);

    if (q) {
      document.getElementById("btn-concept-practice").style.display = "inline-flex";
      document.getElementById("btn-concept-practice").addEventListener("click", () => {
        this.navigateTo("ide");
        window.CodeEditor.init(document.getElementById("view-ide"), q);
      });
    } else {
      document.getElementById("btn-concept-practice").style.display = "none";
    }

    // Render interactive Visualizer if Binary Search
    const visContainer = document.getElementById("concept-visualizer-container");
    visContainer.innerHTML = "";
    
    if (c.id === "binary-search") {
      window.BinarySearchVisualizer.init(visContainer, 23);
    } else {
      // Render static graphic visualization block for other categories
      visContainer.innerHTML = `
        <div class="visualizer-card glass-panel neon-border" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; height:100%;">
          <span style="font-size:4rem; display:block; animation: floatIcon 4s infinite alternate ease-in-out;">📦</span>
          <h3 class="mt-md">${c.name} Schema representation</h3>
          <p class="text-muted mt-sm" style="font-size:0.8rem; max-width:280px;">Review step-by-step definition logic details on the left. Interact with Binary Search simulator for code walk-throughs.</p>
        </div>
      `;
    }
  },

  // Problems List Table Renderer
  renderProblemsTable(searchQuery = "") {
    const tbody = document.getElementById("problems-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const topicFilter = document.getElementById("filter-topic").value;
    const diffFilter = document.getElementById("filter-difficulty").value;
    const freqFilter = document.getElementById("filter-frequency").value;
    const statusFilter = document.getElementById("filter-status").value;

    const filtered = window.dsaQuestions.filter(q => {
      // Search check
      if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase()) && !q.topic.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Topic check
      if (topicFilter !== "all" && q.topic !== topicFilter) return false;
      
      // Difficulty check
      if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
      
      // Frequency check
      if (freqFilter !== "all" && q.frequency !== freqFilter) return false;

      // Status check
      if (statusFilter !== "all") {
        const isSolved = window.AppStore.isProblemSolved(q.id);
        if (statusFilter === "solved" && !isSolved) return false;
        if (statusFilter === "unsolved" && isSolved) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2rem;">No matching problems found. Try adjusting filters.</td>
        </tr>
      `;
      return;
    }

    filtered.forEach(q => {
      const isSolved = window.AppStore.isProblemSolved(q.id);
      const row = document.createElement("tr");
      
      let freqIcon = "○";
      if (q.frequency === "Very Frequently Asked") freqIcon = "🔥";
      else if (q.frequency === "Frequently Asked") freqIcon = "⚡";

      row.innerHTML = `
        <td>
          <span class="status-dot ${isSolved ? 'solved' : 'unsolved'}"></span>
          <span class="font-mono" style="font-size:0.75rem; color:${isSolved ? 'var(--neon-green)' : 'var(--text-muted)'}">${isSolved ? 'Solved' : 'Unsolved'}</span>
        </td>
        <td>
          <span class="problem-row-title text-white font-bold">${q.title}</span>
        </td>
        <td><span class="text-muted" style="font-size:0.85rem;">${q.topic}</span></td>
        <td><span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
        <td><span style="font-size:0.8rem;">${freqIcon} ${q.frequency}</span></td>
        <td><span class="text-muted font-mono" style="font-size:0.8rem;">${q.estTime}</span></td>
        <td>
          <button class="btn btn-primary btn-xs btn-solve-problem" data-prob-id="${q.id}">
            ${isSolved ? 'Re-solve' : 'Solve'}
          </button>
        </td>
      `;

      // Attach click to solve
      row.querySelector(".btn-solve-problem").addEventListener("click", () => {
        this.navigateTo("ide");
        window.CodeEditor.init(document.getElementById("view-ide"), q);
      });
      row.querySelector(".problem-row-title").addEventListener("click", () => {
        this.navigateTo("ide");
        window.CodeEditor.init(document.getElementById("view-ide"), q);
      });

      tbody.appendChild(row);
    });
  },

  // Progress tracking page Loader
  loadProgressView() {
    const stats = window.AppStore.getStats();

    document.getElementById("prog-solved-val").innerText = stats.solvedCount;
    document.getElementById("prog-streak-val").innerText = stats.currentStreak;
    document.getElementById("prog-accuracy-val").innerText = `${stats.accuracy}%`;
    document.getElementById("prog-longest-streak-val").innerText = stats.longestStreak;

    // Chart Topics progress
    const list = document.getElementById("progress-topics-list");
    if (list) {
      list.innerHTML = "";

      // Gather topics from problems list
      const topicsMap = {};
      window.dsaQuestions.forEach(q => {
        if (!topicsMap[q.topic]) {
          topicsMap[q.topic] = { solved: 0, total: 0 };
        }
        topicsMap[q.topic].total += 1;
        if (window.AppStore.isProblemSolved(q.id)) {
          topicsMap[q.topic].solved += 1;
        }
      });

      Object.keys(topicsMap).forEach(topic => {
        const tStats = topicsMap[topic];
        const percent = Math.round((tStats.solved / tStats.total) * 100);

        const row = document.createElement("div");
        row.className = "progress-bar-row-lg";
        row.innerHTML = `
          <div class="meta">
            <span>${topic}</span>
            <span class="text-cyan">${tStats.solved} / ${tStats.total} Solved (${percent}%)</span>
          </div>
          <div class="track">
            <div class="fill" style="width: ${percent}%"></div>
          </div>
        `;
        list.appendChild(row);
      });
    }

    // Achievements Badge Grid
    const badgesGrid = document.getElementById("achievements-showcase-grid");
    if (badgesGrid) {
      badgesGrid.innerHTML = "";

      const badges = [
        { id: "first_problem", icon: "🏆", name: "First Problem", desc: "Solve a coding question." },
        { id: "seven_day_streak", icon: "🔥", name: "7 Day Streak", desc: "Maintain a 7-day practice streak." },
        { id: "speed_solver", icon: "⚡", name: "Speed Solver", desc: "Solve 2+ problems under 5m avg." },
        { id: "ninety_accuracy", icon: "🎯", name: "90% Accuracy", desc: "Maintain 90%+ correct answer accuracy." },
        { id: "five_problems", icon: "💻", name: "5 Problems", desc: "Successfully solve 5 coding tasks." },
        { id: "interview_ready", icon: "🚀", name: "Interview Ready", desc: "Achieve 80%+ mock readiness score." }
      ];

      const unlockedList = window.AppStore.state.achievements;

      badges.forEach(b => {
        const isUnlocked = unlockedList.includes(b.id);
        const card = document.createElement("div");
        card.className = `badge-neon-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="icon">${b.icon}</div>
          <span class="name">${b.name}</span>
          <span class="desc">${b.desc}</span>
        `;
        badgesGrid.appendChild(card);
      });
    }
  },

  // Performance Analysis Loader
  loadPerformanceView() {
    const stats = window.AppStore.getStats();

    // Grouping metrics for strong/weak classification
    const topicQuizScores = {};
    window.AppStore.state.quizHistory.forEach(q => {
      if (!topicQuizScores[q.topic]) {
        topicQuizScores[q.topic] = { sum: 0, count: 0 };
      }
      topicQuizScores[q.topic].sum += (q.score / q.total) * 100;
      topicQuizScores[q.topic].count += 1;
    });

    const topicSolvedStats = {};
    window.dsaQuestions.forEach(q => {
      if (!topicSolvedStats[q.topic]) {
        topicSolvedStats[q.topic] = { solved: 0, total: 0 };
      }
      topicSolvedStats[q.topic].total += 1;
      if (window.AppStore.isProblemSolved(q.id)) {
        topicSolvedStats[q.topic].solved += 1;
      }
    });

    const strongList = [];
    const weakList = [];

    // Analyze topics
    const uniqueTopics = ["Arrays", "Strings", "Linked Lists", "Stack", "Graphs", "Binary Search", "Dynamic Programming"];
    uniqueTopics.forEach(t => {
      let isStrong = false;
      let isWeak = false;

      // Check quiz scores
      if (topicQuizScores[t]) {
        const avg = topicQuizScores[t].sum / topicQuizScores[t].count;
        if (avg >= 80) isStrong = true;
        else if (avg < 60) isWeak = true;
      }

      // Check coding problems
      if (topicSolvedStats[t]) {
        const ratio = topicSolvedStats[t].solved / topicSolvedStats[t].total;
        if (ratio >= 0.7) isStrong = true;
        else if (ratio > 0 && ratio <= 0.3) isWeak = true;
      }

      if (isStrong) strongList.push(t);
      if (isWeak) weakList.push(t);
    });

    // Populate UI
    const strongDiv = document.getElementById("perf-strong-concepts");
    const weakDiv = document.getElementById("perf-weak-concepts");

    if (strongDiv) {
      if (strongList.length === 0) {
        strongDiv.innerHTML = `<span class="text-muted" style="font-size:0.8rem;">Attempt quizzes and code submissions to identify strengths.</span>`;
      } else {
        strongDiv.innerHTML = strongList.map(t => `<div class="perf-bubble strong">${t}</div>`).join("");
      }
    }

    if (weakDiv) {
      if (weakList.length === 0) {
        weakDiv.innerHTML = `<span class="text-muted" style="font-size:0.8rem;">No weak areas flagged yet. Complete more practice sets.</span>`;
      } else {
        weakDiv.innerHTML = weakList.map(t => `<div class="perf-bubble weak">${t}</div>`).join("");
      }
    }

    // Populate Personalized Recommendations suggestions list
    const recsBox = document.getElementById("perf-recs-container");
    if (recsBox) {
      recsBox.innerHTML = "";

      const suggestionCards = [];

      if (stats.solvedCount < 3) {
        suggestionCards.push({
          icon: "💡",
          text: "You are solving Easy problems comfortably. Start increasing Medium-level practice questions to test constraints handling."
        });
      }

      weakList.forEach(t => {
        suggestionCards.push({
          icon: "⚡",
          text: `Your accuracy drops when solving <strong>${t}</strong> questions. Revise traversal/pointer techniques in the Concept details page.`
        });
      });

      if (stats.avgSolvingTime > 400 && stats.solvedCount > 0) {
        suggestionCards.push({
          icon: "⏱",
          text: "Your average solving time is increasing. Focus on identifying time/space constraints early before writing the implementation."
        });
      }

      // Default recommendation fallback
      if (suggestionCards.length === 0) {
        suggestionCards.push({
          icon: "🎯",
          text: "Consistency is excellent. Continue testing yourself in the <strong>Interview Round Simulator</strong> pipelines."
        });
      }

      suggestionCards.forEach(card => {
        const div = document.createElement("div");
        div.className = "suggestion-banner";
        div.innerHTML = `
          <div class="icon">${card.icon}</div>
          <div class="text">${card.text}</div>
        `;
        recsBox.appendChild(div);
      });
    }
  },

  // Toast Achievement popup
  showAchievementToast(achId) {
    const toast = document.createElement("div");
    toast.className = "glass-panel neon-border pulse-glow";
    toast.style.position = "fixed";
    toast.style.bottom = "2rem";
    toast.style.right = "2rem";
    toast.style.zIndex = "2000";
    toast.style.padding = "1rem 1.5rem";
    toast.style.borderLeft = "4px solid var(--neon-cyan)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "1rem";
    toast.style.background = "var(--secondary-bg)";
    
    // Resolve badge name
    const badges = {
      first_problem: { name: "First Problem 🏆", desc: "Solved a coding question!" },
      seven_day_streak: { name: "7 Day Streak 🔥", desc: "Maintained a 7-day practice streak!" },
      speed_solver: { name: "Speed Solver ⚡", desc: "Solved problems under 5m average!" },
      ninety_accuracy: { name: "90% Accuracy 🎯", desc: "Maintained excellent accuracy!" },
      five_problems: { name: "5 Problems Solved 💻", desc: "Recorded 5 solved questions!" },
      interview_ready: { name: "Interview Ready 🚀", desc: "Unlocked readiness level!" }
    };

    const b = badges[achId] || { name: "Achievement Unlocked!", desc: "Milestone cleared!" };

    toast.innerHTML = `
      <div style="font-size: 2rem;">🏆</div>
      <div>
        <h4 style="color:var(--neon-cyan); margin:0;">${b.name}</h4>
        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">${b.desc}</p>
      </div>
    `;

    document.body.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }
};

window.AppRouter = AppRouter;

// Bootstrap SPA on load
document.addEventListener("DOMContentLoaded", () => {
  AppRouter.init();
  
  // Decide starting page based on stores
  const hasLang = window.AppStore.getLanguage();
  if (hasLang) {
    AppRouter.navigateTo("dashboard");
  } else {
    AppRouter.navigateTo("landing");
  }
});
