// DSA Practice Platform - Quiz Module

const QuizSystem = {
  activeQuestions: [],
  userAnswers: [], // Array of indices of selected options
  markedForReview: [], // Array of booleans
  currentIndex: 0,
  timeLeft: 0, // In seconds
  totalTime: 0, // In seconds
  timerInterval: null,
  config: {
    topic: "Arrays",
    difficulty: "Easy",
    timeLimit: 300 // default 5 mins
  },

  init() {
    // Register config page event listeners
    const configView = document.getElementById("view-quiz-config");
    if (!configView) return;

    // Attach start quiz listener
    const startBtn = configView.querySelector("#btn-start-quiz");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const topic = configView.querySelector("#quiz-topic-select").value;
        const difficulty = configView.querySelector("#quiz-difficulty-select").value;
        const timeLimit = parseInt(configView.querySelector("#quiz-time-select").value, 10) * 60;
        
        this.startQuiz(topic, difficulty, timeLimit);
      });
    }
  },

  startQuiz(topic, difficulty, timeLimit) {
    this.config.topic = topic;
    this.config.difficulty = difficulty;
    this.config.timeLimit = timeLimit;

    // Retrieve matching questions
    this.activeQuestions = this.retrieveQuestions(topic, difficulty);
    
    if (this.activeQuestions.length === 0) {
      alert("No questions found for this configuration. Loading Mixed DSA instead.");
      this.activeQuestions = this.retrieveQuestions("Mixed DSA", "Easy");
    }

    // Initialize quiz states
    this.userAnswers = new Array(this.activeQuestions.length).fill(-1);
    this.markedForReview = new Array(this.activeQuestions.length).fill(false);
    this.currentIndex = 0;
    this.timeLeft = timeLimit;
    this.totalTime = timeLimit;

    // Route to active quiz view
    if (window.AppRouter) {
      window.AppRouter.navigateTo("quiz-active");
    }

    this.renderQuizLayout();
    this.startTimer();
    this.showQuestion(0);
  },

  retrieveQuestions(topic, difficulty) {
    let pool = [];
    
    if (topic === "Mixed DSA") {
      // Gather all questions of matching difficulty across all topics
      Object.keys(window.quizQuestions).forEach(top => {
        if (window.quizQuestions[top][difficulty]) {
          pool = pool.concat(window.quizQuestions[top][difficulty]);
        }
      });
    } else {
      if (window.quizQuestions[topic] && window.quizQuestions[topic][difficulty]) {
        pool = window.quizQuestions[topic][difficulty];
      }
    }

    // Randomize and slice to max 5 questions to keep it structured
    pool = pool.sort(() => 0.5 - Math.random());
    return pool.slice(0, 5);
  },

  renderQuizLayout() {
    const activeContainer = document.getElementById("view-quiz-active");
    if (!activeContainer) return;

    activeContainer.innerHTML = `
      <div class="quiz-container">
        <!-- Top bar containing Title and Timer -->
        <div class="quiz-header glass-panel neon-border">
          <div class="quiz-meta-info">
            <span class="quiz-topic text-cyan">${this.config.topic}</span>
            <span class="divider">|</span>
            <span class="quiz-difficulty badge ${this.config.difficulty.toLowerCase()}">${this.config.difficulty}</span>
          </div>
          <div class="quiz-timer-box" id="quiz-timer-box">
            <span class="timer-label">Time Remaining:</span>
            <span id="quiz-timer" class="timer-countdown font-mono text-cyan">00:00</span>
          </div>
        </div>

        <div class="quiz-grid">
          <!-- Main Question Box -->
          <div class="quiz-main-panel glass-panel neon-border">
            <!-- Question Index and Progress Bar -->
            <div class="quiz-progress-section">
              <div class="progress-labels">
                <span>Question <span id="q-index-num">1</span> of ${this.activeQuestions.length}</span>
                <span id="review-tag" class="text-orange" style="display:none">★ Marked for Review</span>
              </div>
              <div class="quiz-progress-bar-bg">
                <div class="quiz-progress-bar-fill" id="quiz-progress-bar" style="width: 20%"></div>
              </div>
            </div>

            <!-- The Question -->
            <div class="quiz-question-body">
              <h3 id="quiz-question-text" class="question-text">Loading question text...</h3>
              <div class="quiz-options-list" id="quiz-options-container">
                <!-- MCQ Options Injected here -->
              </div>
            </div>

            <!-- Quiz Navigation buttons -->
            <div class="quiz-footer-nav">
              <button id="btn-quiz-prev" class="btn btn-secondary">Previous</button>
              <button id="btn-quiz-mark" class="btn btn-warning btn-outline">★ Mark for Review</button>
              <div class="footer-nav-right">
                <button id="btn-quiz-next" class="btn btn-primary">Next</button>
                <button id="btn-quiz-submit" class="btn btn-success" style="display:none">Submit Quiz</button>
              </div>
            </div>
          </div>

          <!-- Navigation Panel -->
          <div class="quiz-side-panel glass-panel neon-border">
            <h4>Quiz Navigation</h4>
            <div class="question-num-grid" id="question-num-grid">
              <!-- Question index circles here -->
            </div>
            
            <div class="nav-legend">
              <div class="legend-item"><span class="legend-circle current"></span> <span>Current</span></div>
              <div class="legend-item"><span class="legend-circle answered"></span> <span>Answered</span></div>
              <div class="legend-item"><span class="legend-circle review"></span> <span>Review</span></div>
              <div class="legend-item"><span class="legend-circle empty"></span> <span>Unvisited</span></div>
            </div>

            <button id="btn-quiz-instant-submit" class="btn btn-success w-full mt-lg">Submit Exam</button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    activeContainer.querySelector("#btn-quiz-prev").addEventListener("click", () => this.navigate(-1));
    activeContainer.querySelector("#btn-quiz-next").addEventListener("click", () => this.navigate(1));
    activeContainer.querySelector("#btn-quiz-mark").addEventListener("click", () => this.toggleMark());
    activeContainer.querySelector("#btn-quiz-submit").addEventListener("click", () => this.confirmSubmit());
    activeContainer.querySelector("#btn-quiz-instant-submit").addEventListener("click", () => this.confirmSubmit());
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.updateTimerUI();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerUI();
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        alert("Time is up! Your quiz is being auto-submitted.");
        this.submitQuiz();
      }
    }, 1000);
  },

  updateTimerUI() {
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
      timerBox.classList.remove("timer-warning");
    }
  },

  showQuestion(index) {
    this.currentIndex = index;
    const q = this.activeQuestions[index];
    if (!q) return;

    const activeContainer = document.getElementById("view-quiz-active");
    if (!activeContainer) return;

    // Update labels and progress
    activeContainer.querySelector("#q-index-num").innerText = index + 1;
    const progressPercent = ((index + 1) / this.activeQuestions.length) * 100;
    activeContainer.querySelector("#quiz-progress-bar").style.width = `${progressPercent}%`;
    activeContainer.querySelector("#quiz-question-text").innerText = q.question;

    // Toggle Marked for review badge
    const reviewTag = activeContainer.querySelector("#review-tag");
    reviewTag.style.display = this.markedForReview[index] ? "inline" : "none";

    // Mark mark button state
    const markBtn = activeContainer.querySelector("#btn-quiz-mark");
    if (this.markedForReview[index]) {
      markBtn.innerText = "★ Unmark";
      markBtn.classList.remove("btn-outline");
    } else {
      markBtn.innerText = "★ Mark for Review";
      markBtn.classList.add("btn-outline");
    }

    // Options rendering
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
      btn.addEventListener("click", () => this.selectOption(idx));
      optContainer.appendChild(btn);
    });

    // Navigation buttons display
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

    this.renderSideGrid();
  },

  selectOption(optionIndex) {
    this.userAnswers[this.currentIndex] = optionIndex;
    
    // Refresh options UI
    const optionCards = document.querySelectorAll(".quiz-option-card");
    optionCards.forEach((card, idx) => {
      if (idx === optionIndex) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });

    this.renderSideGrid();
  },

  toggleMark() {
    this.markedForReview[this.currentIndex] = !this.markedForReview[this.currentIndex];
    
    const activeContainer = document.getElementById("view-quiz-active");
    const reviewTag = activeContainer.querySelector("#review-tag");
    reviewTag.style.display = this.markedForReview[this.currentIndex] ? "inline" : "none";

    const markBtn = activeContainer.querySelector("#btn-quiz-mark");
    if (this.markedForReview[this.currentIndex]) {
      markBtn.innerText = "★ Unmark";
      markBtn.classList.remove("btn-outline");
    } else {
      markBtn.innerText = "★ Mark for Review";
      markBtn.classList.add("btn-outline");
    }

    this.renderSideGrid();
  },

  navigate(direction) {
    const nextIdx = this.currentIndex + direction;
    if (nextIdx >= 0 && nextIdx < this.activeQuestions.length) {
      this.showQuestion(nextIdx);
    }
  },

  renderSideGrid() {
    const grid = document.getElementById("question-num-grid");
    if (!grid) return;

    grid.innerHTML = "";
    this.activeQuestions.forEach((_, idx) => {
      const circle = document.createElement("div");
      circle.className = "question-num-circle";
      circle.innerText = idx + 1;
      
      // Determine status states
      if (idx === this.currentIndex) {
        circle.classList.add("current");
      }
      
      if (this.markedForReview[idx]) {
        circle.classList.add("review");
      } else if (this.userAnswers[idx] !== -1) {
        circle.classList.add("answered");
      }

      circle.addEventListener("click", () => this.showQuestion(idx));
      grid.appendChild(circle);
    });
  },

  confirmSubmit() {
    const unanswered = this.userAnswers.filter(ans => ans === -1).length;
    let confirmMsg = "Are you sure you want to submit the quiz?";
    if (unanswered > 0) {
      confirmMsg = `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`;
    }
    
    if (confirm(confirmMsg)) {
      this.submitQuiz();
    }
  },

  submitQuiz() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;
    
    this.activeQuestions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.answerIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const timeTaken = this.totalTime - this.timeLeft;
    const totalQuestions = this.activeQuestions.length;
    const finalScorePercent = Math.round((correctCount / totalQuestions) * 100);

    // Save in global state store
    if (window.AppStore) {
      window.AppStore.saveQuizScore(
        this.config.topic,
        this.config.difficulty,
        correctCount,
        totalQuestions,
        timeTaken
      );
    }

    this.renderResults(correctCount, incorrectCount, timeTaken, finalScorePercent);
  },

  renderResults(correct, incorrect, timeTaken, scorePercent) {
    if (window.AppRouter) {
      window.AppRouter.navigateTo("quiz-results");
    }

    const resultsContainer = document.getElementById("view-quiz-results");
    if (!resultsContainer) return;

    // Formatting time
    const minStr = Math.floor(timeTaken / 60) > 0 ? `${Math.floor(timeTaken / 60)}m ` : "";
    const secStr = `${timeTaken % 60}s`;

    // Calculate topic-wise metrics for visualization chart
    // We fetch quiz stats from AppStore history to chart
    const statsHistory = window.AppStore ? window.AppStore.state.quizHistory : [];
    
    // Group scores by topic
    const topicAggregates = {};
    statsHistory.forEach(record => {
      if (!topicAggregates[record.topic]) {
        topicAggregates[record.topic] = { correct: 0, total: 0 };
      }
      topicAggregates[record.topic].correct += record.score;
      topicAggregates[record.topic].total += record.total;
    });

    // Make sure current quiz is charted even if store was bypassed
    if (!topicAggregates[this.config.topic]) {
      topicAggregates[this.config.topic] = { correct: correct, total: this.activeQuestions.length };
    }

    let topicChartHtml = "";
    Object.keys(topicAggregates).forEach(topic => {
      const topicPercent = Math.round((topicAggregates[topic].correct / topicAggregates[topic].total) * 100);
      topicChartHtml += `
        <div class="chart-bar-row">
          <span class="bar-label font-mono">${topic}</span>
          <div class="bar-track-bg">
            <div class="bar-fill-indicator" style="width: ${topicPercent}%"></div>
          </div>
          <span class="bar-val text-cyan">${topicPercent}%</span>
        </div>
      `;
    });

    // Dynamic suggestions based on current score and topic
    let stepsList = [];
    if (scorePercent >= 80) {
      stepsList.push("Excellent work! You have strong conceptual clarity in this area.");
      stepsList.push(`Increase the difficulty. Try starting a <strong>Medium</strong> or <strong>Hard</strong> level quiz on ${this.config.topic}.`);
      stepsList.push(`Practice coding problems related to ${this.config.topic} in the Practice area.`);
    } else if (scorePercent >= 50) {
      stepsList.push(`${this.config.topic} fundamentals are good, but edge cases are slipping.`);
      stepsList.push(`Revise common mistakes of ${this.config.topic} in the Concept Library.`);
      stepsList.push("Attempt at least 3 Easy and 2 Medium coding problems on this topic.");
    } else {
      stepsList.push(`<span class="neon-text-red">${this.config.topic} needs reinforcement.</span>`);
      stepsList.push(`Go to the <strong>Concept Library</strong> and read the step-by-step logic explanations for ${this.config.topic}.`);
      stepsList.push("Start practicing Easy coding questions before retaking the quiz.");
    }

    resultsContainer.innerHTML = `
      <div class="results-layout">
        <h2 class="section-title">Quiz Completed!</h2>

        <div class="results-dashboard-grid">
          <!-- Summary card -->
          <div class="summary-card glass-panel neon-border text-center">
            <div class="score-radial">
              <span class="radial-num font-mono text-cyan">${scorePercent}%</span>
            </div>
            <h3 class="mt-md">${scorePercent >= 80 ? 'Well Done!' : scorePercent >= 50 ? 'Keep Improving' : 'Needs Practice'}</h3>
            <p class="text-muted">You solved ${correct} out of ${this.activeQuestions.length} questions correctly.</p>
          </div>

          <!-- Quick metrics -->
          <div class="metrics-card-grid">
            <div class="metric-card glass-panel">
              <span class="label text-muted">Correct Answers</span>
              <span class="val text-success">${correct}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Incorrect Answers</span>
              <span class="val text-danger">${incorrect}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Time Taken</span>
              <span class="val text-cyan font-mono">${minStr}${secStr}</span>
            </div>
            <div class="metric-card glass-panel">
              <span class="label text-muted">Accuracy</span>
              <span class="val text-orange">${Math.round((correct / this.activeQuestions.length) * 100)}%</span>
            </div>
          </div>
        </div>

        <div class="results-details-grid mt-lg">
          <!-- Topic performance bar chart -->
          <div class="performance-chart-card glass-panel neon-border">
            <h3>Topic-wise Performance</h3>
            <div class="bar-chart-container mt-md">
              ${topicChartHtml}
            </div>
          </div>

          <!-- Recommendations card -->
          <div class="recommendations-card glass-panel neon-border">
            <h3>Recommended Next Steps</h3>
            <ul class="recs-list mt-md">
              ${stepsList.map(step => `<li><span class="bullet text-cyan">✦</span> <span class="step-text">${step}</span></li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="results-actions text-center mt-xl">
          <button id="btn-quiz-retry" class="btn btn-secondary mr-md">Configure New Quiz</button>
          <button id="btn-quiz-dash" class="btn btn-primary">Go to Dashboard</button>
        </div>
      </div>
    `;

    resultsContainer.querySelector("#btn-quiz-retry").addEventListener("click", () => {
      if (window.AppRouter) window.AppRouter.navigateTo("quiz-config");
    });
    resultsContainer.querySelector("#btn-quiz-dash").addEventListener("click", () => {
      if (window.AppRouter) window.AppRouter.navigateTo("dashboard");
    });
  }
};

window.QuizSystem = QuizSystem;
