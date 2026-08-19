// DSA Practice Platform - State Manager

const DEFAULT_STATE = {
  selectedLanguage: "",
  streak: {
    current: 0,
    longest: 0,
    lastSolvedDate: null
  },
  solvedProblems: {}, // questionId -> { timeTaken, solvedAt, attempts }
  quizHistory: [], // Array of { topic, difficulty, score, total, timeTaken, date }
  interviewHistory: [], // Array of { roundId, score, type, date }
  achievements: [] // Array of achievementIds
};

const AppStore = {
  state: JSON.parse(JSON.stringify(DEFAULT_STATE)),

  init() {
    const saved = localStorage.getItem("dsa_practice_platform_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with DEFAULT_STATE to handle newly added fields if any
        this.state = { ...DEFAULT_STATE, ...parsed };
        
        // Deep copy nested objects
        this.state.streak = { ...DEFAULT_STATE.streak, ...parsed.streak };
        this.state.solvedProblems = { ...DEFAULT_STATE.solvedProblems, ...parsed.solvedProblems };
        this.state.quizHistory = parsed.quizHistory || [];
        this.state.interviewHistory = parsed.interviewHistory || [];
        this.state.achievements = parsed.achievements || [];
      } catch (e) {
        console.error("Failed to parse local storage state", e);
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    this.checkStreakIntegrity();
    this.save();
  },

  save() {
    localStorage.setItem("dsa_practice_platform_state", JSON.stringify(this.state));
  },

  getLanguage() {
    return this.state.selectedLanguage;
  },

  setLanguage(lang) {
    this.state.selectedLanguage = lang;
    this.save();
  },

  // Streaks
  checkStreakIntegrity() {
    if (!this.state.streak.lastSolvedDate) return;
    
    const todayStr = this.getTodayDateString();
    const lastSolvedStr = this.state.streak.lastSolvedDate;
    
    if (todayStr === lastSolvedStr) return;
    
    const today = new Date(todayStr);
    const lastSolved = new Date(lastSolvedStr);
    const diffTime = Math.abs(today - lastSolved);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If the difference is greater than 1 day, the streak is broken
    if (diffDays > 1) {
      this.state.streak.current = 0;
    }
  },

  updateStreak() {
    const todayStr = this.getTodayDateString();
    const lastSolvedStr = this.state.streak.lastSolvedDate;
    
    if (lastSolvedStr === todayStr) return; // Already updated today
    
    if (!lastSolvedStr) {
      this.state.streak.current = 1;
    } else {
      const lastSolved = new Date(lastSolvedStr);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today - lastSolved);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.state.streak.current += 1;
      } else if (diffDays > 1) {
        this.state.streak.current = 1;
      }
    }
    
    if (this.state.streak.current > this.state.streak.longest) {
      this.state.streak.longest = this.state.streak.current;
    }
    
    this.state.streak.lastSolvedDate = todayStr;
    this.save();
    this.checkAchievements();
  },

  getStreak() {
    this.checkStreakIntegrity();
    return this.state.streak;
  },

  // Problems solved
  solveProblem(questionId, timeTaken) {
    const todayStr = this.getTodayDateString();
    
    if (!this.state.solvedProblems[questionId]) {
      this.state.solvedProblems[questionId] = {
        timeTaken: timeTaken,
        solvedAt: todayStr,
        attempts: 1
      };
    } else {
      this.state.solvedProblems[questionId].timeTaken = Math.min(
        this.state.solvedProblems[questionId].timeTaken,
        timeTaken
      );
      this.state.solvedProblems[questionId].attempts += 1;
      this.state.solvedProblems[questionId].solvedAt = todayStr;
    }
    
    this.updateStreak();
    this.save();
    this.checkAchievements();
  },

  recordAttempt(questionId) {
    if (!this.state.solvedProblems[questionId]) {
      this.state.solvedProblems[questionId] = {
        timeTaken: 0,
        solvedAt: null,
        attempts: 1
      };
    } else {
      this.state.solvedProblems[questionId].attempts += 1;
    }
    this.save();
  },

  isProblemSolved(questionId) {
    return !!(this.state.solvedProblems[questionId] && this.state.solvedProblems[questionId].solvedAt);
  },

  getSolvedCount() {
    return Object.keys(this.state.solvedProblems).filter(id => this.isProblemSolved(id)).length;
  },

  // Quizzes
  saveQuizScore(topic, difficulty, score, total, timeTaken) {
    const record = {
      topic,
      difficulty,
      score,
      total,
      timeTaken,
      date: this.getTodayDateString()
    };
    this.state.quizHistory.push(record);
    this.save();
    this.checkAchievements();
  },

  // Interviews
  saveInterviewScore(roundId, score, type) {
    const record = {
      roundId,
      score,
      type,
      date: this.getTodayDateString()
    };
    this.state.interviewHistory.push(record);
    this.save();
    this.checkAchievements();
  },

  isRoundUnlocked(roundId) {
    if (roundId === 1) return true;
    
    // Check if the previous round has been completed successfully (score >= 70)
    const prevRoundId = roundId - 1;
    const completedPrev = this.state.interviewHistory.some(h => h.roundId === prevRoundId && h.score >= 70);
    return completedPrev;
  },

  // Dynamic statistics
  getStats() {
    const solvedIds = Object.keys(this.state.solvedProblems).filter(id => this.isProblemSolved(id));
    const solvedCount = solvedIds.length;
    
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSolvingTime = 0;
    
    solvedIds.forEach(id => {
      const q = window.dsaQuestions.find(dq => dq.id === id);
      if (q) {
        if (q.difficulty === "Easy") easySolved++;
        else if (q.difficulty === "Medium") mediumSolved++;
        else if (q.difficulty === "Hard") hardSolved++;
      }
      totalSolvingTime += this.state.solvedProblems[id].timeTaken;
    });

    const avgSolvingTime = solvedCount > 0 ? Math.round(totalSolvingTime / solvedCount) : 0;

    // Calculate accuracy (based on quiz performance + code run attempts)
    let totalAttempts = 0;
    let successfulAttempts = 0;
    
    // Add practice problem attempts
    Object.keys(this.state.solvedProblems).forEach(id => {
      const record = this.state.solvedProblems[id];
      totalAttempts += record.attempts;
      if (record.solvedAt) {
        successfulAttempts += 1; // Count first success as 1 correct submission
      }
    });

    // Add quiz attempts
    this.state.quizHistory.forEach(q => {
      totalAttempts += q.total;
      successfulAttempts += q.score;
    });

    const accuracy = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0;
    
    // Interview readiness calculation
    // Max 100%. Formulated by:
    // - Problems solved (up to 40%): e.g. (solvedCount / totalQuestions) * 40
    // - Average Quiz Score (up to 30%): (avgQuizPercent) * 0.3
    // - High Mock Interview Round unlocked/cleared (up to 30%): (maxRoundCleared / 5) * 30
    const totalQCount = window.dsaQuestions ? window.dsaQuestions.length : 1;
    const problemWeight = Math.min(40, (solvedCount / totalQCount) * 40);
    
    let quizSum = 0;
    this.state.quizHistory.forEach(q => {
      quizSum += (q.score / q.total) * 100;
    });
    const avgQuiz = this.state.quizHistory.length > 0 ? quizSum / this.state.quizHistory.length : 0;
    const quizWeight = (avgQuiz / 100) * 30;
    
    let maxRoundCleared = 0;
    this.state.interviewHistory.forEach(h => {
      if (h.score >= 70 && h.roundId > maxRoundCleared) {
        maxRoundCleared = h.roundId;
      }
    });
    const interviewWeight = (maxRoundCleared / 5) * 30;
    const interviewReadiness = Math.min(100, Math.round(problemWeight + quizWeight + interviewWeight));

    // Daily statistics (solved today)
    const todayStr = this.getTodayDateString();
    const solvedToday = solvedIds.filter(id => this.state.solvedProblems[id].solvedAt === todayStr).length;

    return {
      solvedCount,
      easySolved,
      mediumSolved,
      hardSolved,
      avgSolvingTime,
      accuracy,
      interviewReadiness,
      solvedToday,
      currentStreak: this.getStreak().current,
      longestStreak: this.getStreak().longest
    };
  },

  // Achievements checking
  checkAchievements() {
    const newAchievements = [];
    const stats = this.getStats();
    
    // First Problem
    if (stats.solvedCount >= 1 && !this.state.achievements.includes("first_problem")) {
      newAchievements.push("first_problem");
    }
    
    // 7 Day Streak
    if (stats.currentStreak >= 7 && !this.state.achievements.includes("seven_day_streak")) {
      newAchievements.push("seven_day_streak");
    }
    
    // Speed Solver
    if (stats.solvedCount >= 2 && stats.avgSolvingTime > 0 && stats.avgSolvingTime < 300 && !this.state.achievements.includes("speed_solver")) {
      newAchievements.push("speed_solver");
    }
    
    // 90% Accuracy
    if (stats.solvedCount >= 2 && stats.accuracy >= 90 && !this.state.achievements.includes("ninety_accuracy")) {
      newAchievements.push("ninety_accuracy");
    }
    
    // 5 Problems Solved (Scaled down from 50 due to list size)
    if (stats.solvedCount >= 5 && !this.state.achievements.includes("five_problems")) {
      newAchievements.push("five_problems");
    }
    
    // Interview Ready
    if (stats.interviewReadiness >= 80 && !this.state.achievements.includes("interview_ready")) {
      newAchievements.push("interview_ready");
    }

    if (newAchievements.length > 0) {
      this.state.achievements = [...this.state.achievements, ...newAchievements];
      this.save();
      // Dispatch custom event to notify app UI
      window.dispatchEvent(new CustomEvent("achievements-unlocked", { detail: newAchievements }));
    }
  },

  // Helper date functions
  getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  resetAll() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
};

// Export or bind to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppStore;
} else {
  window.AppStore = AppStore;
}
AppStore.init();
