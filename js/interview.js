// DSA Practice Platform - Interview Round Simulator

const InterviewSimulator = {
  activeRound: null,
  activeQuestions: [],
  userAnswers: [],
  currentIndex: 0,
  timeLeft: 0,
  timerInterval: null,
  
  // MCQ state inside interview rounds
  isInterviewSession: false,

  init() {
    this.renderRoundsList();
  },

  renderRoundsList() {
    const container = document.getElementById("view-interviews");
    if (!container) return;

    let roundsHtml = "";
    
    window.interviewRounds.forEach(round => {
      const isUnlocked = window.AppStore ? window.AppStore.isRoundUnlocked(round.id) : (round.id === 1);
      
      // Get best score if attempted
      const attempts = window.AppStore ? window.AppStore.state.interviewHistory.filter(h => h.roundId === round.id) : [];
      let bestScoreHtml = "";
      let clearedBadge = "";
      
      if (attempts.length > 0) {
        const maxScore = Math.max(...attempts.map(a => a.score));
        bestScoreHtml = `<span class="best-score text-cyan font-mono">Best Score: ${maxScore}%</span>`;
        if (maxScore >= 70) {
          clearedBadge = `<span class="badge badge-success ml-sm">Cleared</span>`;
        }
      }

      roundsHtml += `
        <div class="interview-round-card glass-panel neon-border ${!isUnlocked ? 'locked' : ''}">
          <div class="round-status-top">
            <span class="badge ${round.difficulty.toLowerCase()}">${round.difficulty}</span>
            ${clearedBadge}
          </div>
          
          <div class="round-card-body">
            <div class="round-lock-icon">${isUnlocked ? '🔓' : '🔒'}</div>
            <h3 class="round-title">${round.name}</h3>
            <p class="round-desc text-muted">${round.description}</p>
            
            <div class="round-meta">
              <span>Time Limit: <strong>${Math.round(round.timeLimit / 60)} mins</strong></span>
              <span>Type: <strong>${round.type === 'mcq' ? 'Conceptual MCQ' : round.type === 'coding' ? 'Coding Challenge' : 'Speed Round'}</strong></span>
            </div>
          </div>
          
          <div class="round-card-footer mt-md">
            ${bestScoreHtml}
            <button class="btn btn-primary btn-start-round" data-round-id="${round.id}" ${!isUnlocked ? 'disabled' : ''}>
              ${isUnlocked ? (attempts.length > 0 ? 'Retake Round' : 'Start Round') : 'Locked'}
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="interview-layout">
        <div class="interview-intro mb-lg">
          <h2 class="section-title">Interview Round Simulator</h2>
          <p class="text-muted">Simulate actual company hiring pipelines. Clear each stage with a score of <strong>70% or higher</strong> to unlock the next round.</p>
        </div>
        
        <div class="interview-rounds-grid">
          ${roundsHtml}
        </div>
      </div>
    `;

    // Attach listeners to buttons
    container.querySelectorAll(".btn-start-round").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const roundId = parseInt(e.target.getAttribute("data-round-id"), 10);
        this.startRound(roundId);
      });
    });
  },

  startRound(roundId) {
    const round = window.interviewRounds.find(r => r.id === roundId);
    if (!round) return;

    this.activeRound = round;
    this.isInterviewSession = true;

    if (round.type === "mcq") {
      this.activeQuestions = round.questions;
      this.userAnswers = new Array(this.activeQuestions.length).fill(-1);
      this.currentIndex = 0;
      this.timeLeft = round.timeLimit;
      
      this.renderInterviewMCQLayout();
      this.startInterviewTimer();
      this.showMCQQuestion(0);
    } else if (round.type === "coding") {
      // Find question object
      const question = window.dsaQuestions.find(q => q.id === round.questionId);
      if (!question) return;

      alert(`Starting Coding Round! Solve ${question.title} within ${Math.round(round.timeLimit / 60)} minutes to clear the round.`);
      
      // Navigate to IDE preloaded
      if (window.AppRouter) {
        window.AppRouter.navigateTo("ide");
        window.CodeEditor.init(document.getElementById("view-ide"), question);
        
        // Setup specialized interview timer in IDE header
        const editorHeader = document.querySelector(".editor-header .header-left");
        if (editorHeader) {
          const timerSpan = document.createElement("span");
          timerSpan.className = "interview-timer badge badge-warning ml-md font-mono";
          timerSpan.id = "editor-interview-timer";
          editorHeader.appendChild(timerSpan);
          
          this.timeLeft = round.timeLimit;
          if (this.timerInterval) clearInterval(this.timerInterval);
          this.timerInterval = setInterval(() => {
            this.timeLeft--;
            const mins = Math.floor(this.timeLeft / 60);
            const secs = this.timeLeft % 60;
            timerSpan.innerText = `⏱ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            if (this.timeLeft <= 0) {
              clearInterval(this.timerInterval);
              alert("Time limit reached for the coding interview round!");
              this.endCodingRound(false);
            }
          }, 1000);
        }
      }
    } else if (round.type === "rapid-fire") {
      RapidFireMode.start();
    }
  },

  renderInterviewMCQLayout() {
    if (window.AppRouter) {
      window.AppRouter.navigateTo("quiz-active"); // Reuse quiz panel template, but customize UI
    }

    const activeContainer = document.getElementById("view-quiz-active");
    if (!activeContainer) return;

    activeContainer.innerHTML = `
      <div class="quiz-container interview-mcq-theme">
        <div class="quiz-header glass-panel neon-border">
          <div class="quiz-meta-info">
            <span class="quiz-topic text-cyan">${this.activeRound.name}</span>
            <span class="divider">|</span>
            <span class="quiz-difficulty badge hard">INTERVIEW ROUND</span>
          </div>
          <div class="quiz-timer-box" id="quiz-timer-box">
            <span class="timer-label">Time Remaining:</span>
            <span id="quiz-timer" class="timer-countdown font-mono text-cyan">00:00</span>
          </div>
        </div>

        <div class="quiz-grid">
          <div class="quiz-main-panel glass-panel neon-border">
            <div class="quiz-progress-section">
              <div class="progress-labels">
                <span>Question <span id="q-index-num">1</span> of ${this.activeQuestions.length}</span>
              </div>
              <div class="quiz-progress-bar-bg">
                <div class="quiz-progress-bar-fill" id="quiz-progress-bar" style="width: 20%"></div>
              </div>
            </div>

            <div class="quiz-question-body">
              <h3 id="quiz-question-text" class="question-text">Loading question...</h3>
              <div class="quiz-options-list" id="quiz-options-container"></div>
            </div>

            <div class="quiz-footer-nav">
              <button id="btn-quiz-prev" class="btn btn-secondary">Previous</button>
              <div></div>
              <div class="footer-nav-right">
                <button id="btn-quiz-next" class="btn btn-primary">Next</button>
                <button id="btn-quiz-submit" class="btn btn-success" style="display:none">Submit Round</button>
              </div>
            </div>
          </div>

          <div class="quiz-side-panel glass-panel neon-border">
            <h4>Round Status</h4>
            <div class="question-num-grid" id="question-num-grid"></div>
            <div class="nav-legend">
              <div class="legend-item"><span class="legend-circle current"></span> <span>Current</span></div>
              <div class="legend-item"><span class="legend-circle answered"></span> <span>Answered</span></div>
              <div class="legend-item"><span class="legend-circle empty"></span> <span>Unvisited</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    activeContainer.querySelector("#btn-quiz-prev").addEventListener("click", () => this.navigateMCQ(-1));
    activeContainer.querySelector("#btn-quiz-next").addEventListener("click", () => this.navigateMCQ(1));
    activeContainer.querySelector("#btn-quiz-submit").addEventListener("click", () => this.confirmSubmitMCQ());
  },

  startInterviewTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.updateInterviewTimerUI();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateInterviewTimerUI();
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        alert("Time is up! Your interview answers are being auto-submitted.");
        this.submitInterviewMCQ();
      }
    }, 1000);
  },

  updateInterviewTimerUI() {
    const timerElem = document.getElementById("quiz-timer");
    const timerBox = document.getElementById("quiz-timer-box");
    if (!timerElem) return;

    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    
    timerElem.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    if (this.timeLeft < 60) {
      timerElem.className = "timer-countdown font-mono text-danger pulse-anim";
      timerBox.classList.add("timer-warning");
    } else {
      timerElem.className = "timer-countdown font-mono text-cyan";
    }
  },

  showMCQQuestion(index) {
    this.currentIndex = index;
    const q = this.activeQuestions[index];
    if (!q) return;

    const activeContainer = document.getElementById("view-quiz-active");
    if (!activeContainer) return;

    activeContainer.querySelector("#q-index-num").innerText = index + 1;
    const progressPercent = ((index + 1) / this.activeQuestions.length) * 100;
    activeContainer.querySelector("#quiz-progress-bar").style.width = `${progressPercent}%`;
    activeContainer.querySelector("#quiz-question-text").innerText = q.question;

    const optContainer = activeContainer.querySelector("#quiz-options-container");
    optContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-card glass-panel";
      if (this.userAnswers[index] === idx) {
        btn.classList.add("selected");
      }
      btn.innerHTML = `
        <span class="option-prefix">${String.fromCharCode(65 + idx)}</span>
        <span class="option-text">${opt}</span>
      `;
      btn.addEventListener("click", () => this.selectMCQOption(idx));
      optContainer.appendChild(btn);
    });

    const prevBtn = activeContainer.querySelector("#btn-quiz-prev");
    const nextBtn = activeContainer.querySelector("#btn-quiz-next");
    const submitBtn = activeContainer.querySelector("#btn-quiz-submit");

    prevBtn.disabled = index === 0;

    if (index === this.activeQuestions.length - 1) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }

    this.renderMCQSideGrid();
  },

  selectMCQOption(optionIndex) {
    this.userAnswers[this.currentIndex] = optionIndex;
    this.showMCQQuestion(this.currentIndex);
  },

  navigateMCQ(direction) {
    const nextIdx = this.currentIndex + direction;
    if (nextIdx >= 0 && nextIdx < this.activeQuestions.length) {
      this.showMCQQuestion(nextIdx);
    }
  },

  renderMCQSideGrid() {
    const grid = document.getElementById("question-num-grid");
    if (!grid) return;

    grid.innerHTML = "";
    this.activeQuestions.forEach((_, idx) => {
      const circle = document.createElement("div");
      circle.className = "question-num-circle";
      circle.innerText = idx + 1;
      
      if (idx === this.currentIndex) {
        circle.classList.add("current");
      }
      
      if (this.userAnswers[idx] !== -1) {
        circle.classList.add("answered");
      }

      circle.addEventListener("click", () => this.showMCQQuestion(idx));
      grid.appendChild(circle);
    });
  },

  confirmSubmitMCQ() {
    if (confirm("Submit interview round responses?")) {
      this.submitInterviewMCQ();
    }
  },

  submitInterviewMCQ() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isInterviewSession = false;

    // Calculate score
    let correctCount = 0;
    this.activeQuestions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / this.activeQuestions.length) * 100);

    // Save score
    if (window.AppStore) {
      window.AppStore.saveInterviewScore(this.activeRound.id, scorePercent, "mcq");
    }

    this.renderInterviewResults(scorePercent);
  },

  // Called from outside (editor.js) when a coding round question is submitted successfully
  endCodingRound(success) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (!this.activeRound) return;

    const scorePercent = success ? 100 : 0;
    
    if (window.AppStore) {
      window.AppStore.saveInterviewScore(this.activeRound.id, scorePercent, "coding");
    }

    this.activeRound = null;
    this.isInterviewSession = false;

    // Clean up IDE header elements
    const timerSpan = document.getElementById("editor-interview-timer");
    if (timerSpan) timerSpan.remove();

    this.renderInterviewResults(scorePercent);
  },

  renderInterviewResults(scorePercent) {
    if (window.AppRouter) {
      window.AppRouter.navigateTo("quiz-results");
    }

    const container = document.getElementById("view-quiz-results");
    if (!container) return;

    const cleared = scorePercent >= 70;

    container.innerHTML = `
      <div class="results-layout text-center">
        <div class="interview-result-banner ${cleared ? 'cleared' : 'failed'}">
          <div class="result-badge">${cleared ? '🏆' : '✕'}</div>
          <h2>${cleared ? 'Interview Round Cleared!' : 'Round Failed'}</h2>
          <p>${cleared ? 'Excellent job! You performed exceptionally and met the passing criteria.' : 'Unfortunately, you did not meet the passing mark of 70%. Please study and attempt again.'}</p>
        </div>

        <div class="results-dashboard-grid mt-lg justify-center">
          <div class="summary-card glass-panel neon-border" style="max-width: 400px; margin: 0 auto;">
            <h3>Results Scorecard</h3>
            <div class="score-display font-mono text-cyan mt-md" style="font-size: 3rem;">
              ${scorePercent}%
            </div>
            <div class="mt-md font-bold text-white">
              Status: ${cleared ? '<span class="text-success">PASSED</span>' : '<span class="text-danger">FAILED</span>'}
            </div>
            <p class="text-muted mt-sm">Required Score: 70%</p>
          </div>
        </div>

        <div class="results-actions text-center mt-xl">
          <button id="btn-interview-back" class="btn btn-primary">Back to Simulator</button>
        </div>
      </div>
    `;

    container.querySelector("#btn-interview-back").addEventListener("click", () => {
      if (window.AppRouter) {
        window.AppRouter.navigateTo("interviews");
        this.renderRoundsList(); // Re-render to update locks
      }
    });
  }
};

const RapidFireMode = {
  questions: [],
  currentIndex: 0,
  userAnswers: [],
  responseTimes: [],
  score: 0,
  timeLeft: 15,
  timerInterval: null,
  questionStartTime: 0,

  start() {
    // Generate questions pool
    this.questions = [...window.rapidFireQuestions].sort(() => 0.5 - Math.random());
    this.currentIndex = 0;
    this.userAnswers = [];
    this.responseTimes = [];
    this.score = 0;

    if (window.AppRouter) {
      window.AppRouter.navigateTo("rapid-fire");
    }

    this.renderLayout();
    this.nextQuestion();
  },

  renderLayout() {
    const container = document.getElementById("view-rapid-fire");
    if (!container) return;

    container.innerHTML = `
      <div class="rapid-fire-wrapper">
        <div class="rapid-fire-header glass-panel neon-border">
          <div class="header-left">
            <span class="text-orange font-bold">⚡ RAPID FIRE MODE</span>
          </div>
          <div class="header-right">
            <span>Progress: <strong id="rf-progress">1 / 10</strong></span>
          </div>
        </div>

        <div class="rapid-fire-card glass-panel neon-border text-center">
          <!-- Circular Timer -->
          <div class="rf-timer-circle" id="rf-timer-circle">
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle class="timer-track" cx="50" cy="50" r="45"></circle>
              <circle class="timer-fill" cx="50" cy="50" r="45" id="rf-timer-fill" stroke-dasharray="282.7" stroke-dashoffset="0"></circle>
            </svg>
            <span class="rf-timer-text font-mono" id="rf-timer-text">15</span>
          </div>

          <h3 id="rf-question-text" class="rf-question-text mt-lg">Loading Question...</h3>

          <div class="rf-options-grid mt-xl" id="rf-options-container">
            <!-- 4 rapid options -->
          </div>
        </div>
      </div>
    `;
  },

  nextQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finish();
      return;
    }

    // Set up timer
    this.timeLeft = 15;
    this.questionStartTime = performance.now();
    this.updateTimerUI();

    const q = this.questions[this.currentIndex];
    
    // Update labels
    document.getElementById("rf-progress").innerText = `${this.currentIndex + 1} / ${this.questions.length}`;
    document.getElementById("rf-question-text").innerText = q.question;

    const optContainer = document.getElementById("rf-options-container");
    optContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "rf-option-btn glass-panel font-mono";
      btn.innerText = opt;
      btn.addEventListener("click", () => this.answer(idx));
      optContainer.appendChild(btn);
    });

    // Start timer interval
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.1;
      this.updateTimerUI();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.answer(-1); // Answer timeout
      }
    }, 100);
  },

  updateTimerUI() {
    const textElem = document.getElementById("rf-timer-text");
    const fillElem = document.getElementById("rf-timer-fill");
    if (!textElem || !fillElem) return;

    const displayVal = Math.max(0, Math.ceil(this.timeLeft));
    textElem.innerText = displayVal;

    // Dash offset manipulation
    const perimeter = 282.7; // 2 * pi * r
    const fraction = this.timeLeft / 15;
    const offset = perimeter * (1 - fraction);
    fillElem.style.strokeDashoffset = offset;

    // Color changing
    const circle = document.getElementById("rf-timer-circle");
    if (this.timeLeft < 4) {
      circle.className = "rf-timer-circle warning pulse-anim";
    } else {
      circle.className = "rf-timer-circle";
    }
  },

  answer(optionIndex) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const q = this.questions[this.currentIndex];
    const isCorrect = optionIndex === q.answerIndex;
    const timeTaken = (performance.now() - this.questionStartTime) / 1000;
    
    this.userAnswers.push(optionIndex);
    this.responseTimes.push(timeTaken);

    if (isCorrect) {
      this.score++;
    }

    // Brief highlight flash effect
    const optContainer = document.getElementById("rf-options-container");
    const btns = optContainer.querySelectorAll(".rf-option-btn");
    
    if (optionIndex !== -1 && btns[optionIndex]) {
      btns[optionIndex].classList.add(isCorrect ? "success-flash" : "danger-flash");
    }
    
    // Highlight correct answer if failed/timed out
    if (!isCorrect && q.answerIndex !== -1 && btns[q.answerIndex]) {
      btns[q.answerIndex].classList.add("success-flash");
    }

    // Wait 600ms then move to next
    setTimeout(() => {
      this.currentIndex++;
      this.nextQuestion();
    }, 600);
  },

  finish() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    const finalPercent = Math.round((this.score / this.questions.length) * 100);
    
    // Save to AppStore
    if (window.AppStore) {
      window.AppStore.saveInterviewScore(5, finalPercent, "rapid-fire");
    }

    // Calculate ratings
    const avgResponseTime = this.responseTimes.reduce((a,b) => a+b, 0) / this.responseTimes.length;
    
    let speedRating = "Average";
    if (avgResponseTime < 3) speedRating = "Lightning Fast ⚡";
    else if (avgResponseTime < 6) speedRating = "Rapid";
    else if (avgResponseTime > 10) speedRating = "Slow";

    let accuracyRating = `${finalPercent}%`;
    
    let strength = "Novice";
    if (finalPercent >= 80) strength = "Elite 🔥";
    else if (finalPercent >= 60) strength = "Intermediate";

    if (window.AppRouter) {
      window.AppRouter.navigateTo("quiz-results");
    }

    const container = document.getElementById("view-quiz-results");
    if (!container) return;

    container.innerHTML = `
      <div class="results-layout text-center">
        <h2 class="section-title text-orange font-bold">⚡ Rapid Fire Results</h2>

        <div class="results-dashboard-grid mt-lg">
          <!-- Summary card -->
          <div class="summary-card glass-panel neon-border text-center">
            <h3>Exam Completed</h3>
            <div class="score-display text-orange mt-md" style="font-size: 3.5rem; font-family: monospace;">
              ${this.score} / ${this.questions.length}
            </div>
            <p class="text-muted mt-sm">Correct answers verified</p>
          </div>

          <!-- Quick metrics -->
          <div class="metrics-card-grid">
            <div class="metric-card glass-panel">
              <span class="label text-muted">Response Speed</span>
              <span class="val text-cyan font-mono">${speedRating}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Accuracy Tally</span>
              <span class="val text-success">${accuracyRating}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Concept Strength</span>
              <span class="val text-orange">${strength}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Average Time</span>
              <span class="val text-white font-mono">${avgResponseTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        <div class="results-actions text-center mt-xl">
          <button id="btn-rf-back" class="btn btn-primary">Back to Simulator</button>
        </div>
      </div>
    `;

    container.querySelector("#btn-rf-back").addEventListener("click", () => {
      if (window.AppRouter) {
        window.AppRouter.navigateTo("interviews");
        window.InterviewSimulator.renderRoundsList();
      }
    });
  }
};

window.InterviewSimulator = InterviewSimulator;
window.RapidFireMode = RapidFireMode;
