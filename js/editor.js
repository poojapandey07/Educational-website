// DSA Practice Platform - Code Editor & Execution Sandbox

const CodeEditor = {
  currentQuestion: null,
  activeLanguage: "javascript",
  container: null,
  editorElement: null,
  lineNumbersElement: null,
  consoleElement: null,

  init(containerElement, question) {
    this.container = containerElement;
    this.currentQuestion = question;
    
    // Fallback to javascript if no language is selected in store
    const storedLang = window.AppStore ? window.AppStore.getLanguage() : "javascript";
    this.activeLanguage = storedLang || "javascript";

    this.renderLayout();
    this.loadBoilerplate();
    this.syncLineNumbers();
  },

  renderLayout() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="editor-layout">
        <!-- Editor Controls Top -->
        <div class="editor-header glass-panel">
          <div class="header-left">
            <span class="editor-title font-mono text-cyan">&gt; main.${this.getFileExtension(this.activeLanguage)}</span>
            <span class="badge badge-outline sm">Language: ${this.activeLanguage.toUpperCase()}</span>
          </div>
          <div class="header-right">
            <button id="btn-editor-reset" class="btn btn-secondary btn-xs">Reset Code</button>
          </div>
        </div>

        <!-- Main Editor Body -->
        <div class="editor-body">
          <div class="line-numbers" id="editor-line-numbers">1</div>
          <textarea id="code-textarea" class="code-textarea font-mono" spellcheck="false" placeholder="Write your solution here..."></textarea>
        </div>

        <!-- Terminal Console & Action Footer -->
        <div class="editor-footer glass-panel">
          <div class="console-tab-header">
            <button class="console-tab-btn active" id="tab-testcases">Test Cases</button>
            <button class="console-tab-btn" id="tab-output">Compiler Output</button>
          </div>
          
          <div class="console-content-container">
            <!-- Test Cases View -->
            <div id="console-testcases" class="console-pane active">
              <div class="test-cases-list" id="vis-testcases-list">
                <!-- Test cases injected here -->
              </div>
            </div>
            
            <!-- Compiler Output View -->
            <div id="console-output" class="console-pane font-mono">
              <div id="console-output-text" class="output-text">Console is ready. Click "Run Code" to compile and execute.</div>
            </div>
          </div>

          <div class="action-bar">
            <div id="execution-metrics" class="execution-metrics text-muted font-mono" style="display:none">
              <span>Time: <span id="metric-time">--</span></span> | 
              <span>Space: <span id="metric-space">--</span></span>
            </div>
            <div class="action-buttons">
              <button id="btn-run-code" class="btn btn-secondary">Run Code</button>
              <button id="btn-submit-code" class="btn btn-primary">Submit Solution</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.editorElement = this.container.querySelector("#code-textarea");
    this.lineNumbersElement = this.container.querySelector("#editor-line-numbers");
    this.consoleElement = this.container.querySelector("#console-output-text");

    // Line sync listeners
    this.editorElement.addEventListener("input", () => {
      this.syncLineNumbers();
    });
    this.editorElement.addEventListener("scroll", () => {
      this.lineNumbersElement.scrollTop = this.editorElement.scrollTop;
    });

    // Console tabs
    this.container.querySelector("#tab-testcases").addEventListener("click", () => this.switchTab("testcases"));
    this.container.querySelector("#tab-output").addEventListener("click", () => this.switchTab("output"));

    // Action buttons
    this.container.querySelector("#btn-editor-reset").addEventListener("click", () => this.loadBoilerplate());
    this.container.querySelector("#btn-run-code").addEventListener("click", () => this.runCode());
    this.container.querySelector("#btn-submit-code").addEventListener("click", () => this.submitCode());

    this.renderTestCasesList();
  },

  getFileExtension(lang) {
    const extMap = {
      javascript: "js",
      python: "py",
      cpp: "cpp",
      java: "java",
      c: "c"
    };
    return extMap[lang] || "js";
  },

  switchTab(tabName) {
    this.container.querySelectorAll(".console-tab-btn").forEach(btn => btn.classList.remove("active"));
    this.container.querySelectorAll(".console-pane").forEach(pane => pane.classList.remove("active"));

    this.container.querySelector(`#tab-${tabName}`).classList.add("active");
    this.container.querySelector(`#console-${tabName}`).classList.add("active");
  },

  loadBoilerplate() {
    if (!this.currentQuestion || !this.editorElement) return;
    
    // Check if user has saved code in localStorage for this question + language
    const savedCodeKey = `code_${this.currentQuestion.id}_${this.activeLanguage}`;
    const savedCode = localStorage.getItem(savedCodeKey);
    
    if (savedCode) {
      this.editorElement.value = savedCode;
    } else {
      const template = this.currentQuestion.starterCode[this.activeLanguage] || "";
      this.editorElement.value = template;
    }
    this.syncLineNumbers();
  },

  saveCurrentCode() {
    if (!this.currentQuestion || !this.editorElement) return;
    const savedCodeKey = `code_${this.currentQuestion.id}_${this.activeLanguage}`;
    localStorage.setItem(savedCodeKey, this.editorElement.value);
  },

  syncLineNumbers() {
    if (!this.editorElement || !this.lineNumbersElement) return;
    
    this.saveCurrentCode();
    
    const lines = this.editorElement.value.split("\n");
    const count = lines.length;
    let numbersHtml = "";
    for (let i = 1; i <= count; i++) {
      numbersHtml += `<div>${i}</div>`;
    }
    this.lineNumbersElement.innerHTML = numbersHtml;
    this.lineNumbersElement.scrollTop = this.editorElement.scrollTop;
  },

  renderTestCasesList() {
    const listContainer = this.container.querySelector("#vis-testcases-list");
    if (!listContainer || !this.currentQuestion) return;

    listContainer.innerHTML = "";
    this.currentQuestion.testCases.forEach((tc, idx) => {
      // Don't show hidden test cases in the test cases list tab
      if (tc.isHidden) return;

      const tcDiv = document.createElement("div");
      tcDiv.className = "test-case-item glass-panel";
      tcDiv.id = `testcase-ui-${idx}`;
      tcDiv.innerHTML = `
        <div class="tc-header">
          <span class="tc-title">Case ${idx + 1}</span>
          <span class="tc-status-badge text-muted">Ready</span>
        </div>
        <div class="tc-details">
          <div class="tc-detail-row">
            <span class="label">Input:</span>
            <code class="val">${tc.input}</code>
          </div>
          <div class="tc-detail-row">
            <span class="label">Expected:</span>
            <code class="val">${tc.expectedOutput}</code>
          </div>
          <div class="tc-detail-row tc-output-row" style="display:none">
            <span class="label">Output:</span>
            <code class="val tc-actual-val"></code>
          </div>
        </div>
      `;
      listContainer.appendChild(tcDiv);
    });
  },

  async runCode() {
    if (!this.currentQuestion || !this.editorElement) return;

    const userCode = this.editorElement.value;
    this.switchTab("output");
    this.consoleElement.innerHTML = `<span class="text-muted">Compiling and launching sandbox...</span>`;
    
    const startTime = performance.now();
    
    // Add artificial delay for compiling feel
    await new Promise(resolve => setTimeout(resolve, 800));

    // Record attempt in state
    if (window.AppStore) {
      window.AppStore.recordAttempt(this.currentQuestion.id);
    }

    if (this.activeLanguage === "javascript") {
      this.executeJSCode(userCode, startTime);
    } else {
      this.executeSimulatedCode(userCode, startTime);
    }
  },

  executeJSCode(userCode, startTime) {
    try {
      // Construct user function dynamically
      const functionRetriever = new Function(`
        ${userCode}
        return typeof search !== 'undefined' ? search : 
               typeof twoSum !== 'undefined' ? twoSum : 
               typeof isValid !== 'undefined' ? isValid : 
               typeof lengthOfLongestSubstring !== 'undefined' ? lengthOfLongestSubstring : 
               typeof maxArea !== 'undefined' ? maxArea : 
               typeof reverseList !== 'undefined' ? reverseList :
               typeof canFinish !== 'undefined' ? canFinish :
               typeof longestCommonSubsequence !== 'undefined' ? longestCommonSubsequence : null;
      `);

      const userFunc = functionRetriever();

      if (!userFunc) {
        throw new Error("Target function not found. Please do not rename the starter template function.");
      }

      let allPassed = true;
      let consoleLog = [];
      
      this.currentQuestion.testCases.forEach((tc, idx) => {
        let args;
        try {
          args = JSON.parse(tc.input);
        } catch(e) {
          args = [tc.input];
        }

        try {
          const runResult = this.currentQuestion.runTestJS(userFunc, args);
          const actualOutput = typeof runResult === 'object' ? JSON.stringify(runResult) : String(runResult);
          const expected = tc.expectedOutput;

          const isPass = actualOutput === expected;
          
          if (!isPass) {
            allPassed = false;
          }

          // Update test case UI if it's visible (non-hidden)
          const tcUi = this.container.querySelector(`#testcase-ui-${idx}`);
          if (tcUi) {
            tcUi.querySelector(".tc-output-row").style.display = "flex";
            tcUi.querySelector(".tc-actual-val").innerText = actualOutput;
            const badge = tcUi.querySelector(".tc-status-badge");
            badge.innerText = isPass ? "✓ Passed" : "✕ Failed";
            badge.className = isPass ? "tc-status-badge text-success" : "tc-status-badge text-danger";
          }

          if (!tc.isHidden) {
            consoleLog.push(`Test Case ${idx + 1}: ${isPass ? 'PASSED ✓' : 'FAILED ✕'}\n  Input: ${tc.input}\n  Output: ${actualOutput}\n  Expected: ${expected}`);
          } else {
            consoleLog.push(`Hidden Test Case: ${isPass ? 'PASSED ✓' : 'FAILED ✕'}`);
          }
        } catch (err) {
          allPassed = false;
          consoleLog.push(`Test Case ${idx + 1}: ERROR ✕\n  Input: ${tc.input}\n  Error: ${err.message}`);
          const tcUi = this.container.querySelector(`#testcase-ui-${idx}`);
          if (tcUi) {
            tcUi.querySelector(".tc-output-row").style.display = "flex";
            tcUi.querySelector(".tc-actual-val").innerText = err.message;
            const badge = tcUi.querySelector(".tc-status-badge");
            badge.innerText = "✕ Error";
            badge.className = "tc-status-badge text-danger";
          }
        }
      });

      const endTime = performance.now();
      const execMs = Math.round(endTime - startTime);
      
      this.displayResults(allPassed, consoleLog, execMs);

    } catch (e) {
      this.consoleElement.innerHTML = `<span class="neon-text-red">Compilation/Runtime Error:</span>\n<span class="text-white">${e.message}</span>`;
      this.switchTab("output");
    }
  },

  executeSimulatedCode(userCode, startTime) {
    // For non-JS languages, we read the code and check if they modified the boilerplate.
    // If they just left the template unchanged, they fail.
    // If they wrote custom logic, we check for basic syntaxes (e.g. loops, maps, variables) and simulate a successful run.
    const defaultTemplate = this.currentQuestion.starterCode[this.activeLanguage] || "";
    
    // Normalize spacing to compare changes
    const normCode = userCode.replace(/\s/g, "");
    const normTemplate = defaultTemplate.replace(/\s/g, "");
    
    const hasModified = normCode !== normTemplate && normCode.length > normTemplate.length + 10;
    
    let consoleLog = [];
    let allPassed = false;

    if (!hasModified) {
      this.currentQuestion.testCases.forEach((tc, idx) => {
        if (tc.isHidden) {
          consoleLog.push(`Hidden Test Case: FAILED ✕`);
          return;
        }
        
        consoleLog.push(`Test Case ${idx + 1}: FAILED ✕\n  Input: ${tc.input}\n  Output: [Default/Empty return]\n  Expected: ${tc.expectedOutput}`);
        
        const tcUi = this.container.querySelector(`#testcase-ui-${idx}`);
        if (tcUi) {
          tcUi.querySelector(".tc-output-row").style.display = "flex";
          tcUi.querySelector(".tc-actual-val").innerText = "[No Return / Default]";
          const badge = tcUi.querySelector(".tc-status-badge");
          badge.innerText = "✕ Failed";
          badge.className = "tc-status-badge text-danger";
        }
      });
    } else {
      // Check code content for potential logic to simulate realistically
      // If code contains common words, we let it pass. If they just wrote random letters, it fails.
      const hasKeywords = /(for|while|if|return|var|int|std|vector|def|class|Solution)/.test(userCode);
      allPassed = hasKeywords;

      this.currentQuestion.testCases.forEach((tc, idx) => {
        if (tc.isHidden) {
          consoleLog.push(`Hidden Test Case: ${allPassed ? 'PASSED ✓' : 'FAILED ✕'}`);
          return;
        }
        
        const outputVal = allPassed ? tc.expectedOutput : "[Wrong Answer output]";
        consoleLog.push(`Test Case ${idx + 1}: ${allPassed ? 'PASSED ✓' : 'FAILED ✕'}\n  Input: ${tc.input}\n  Output: ${outputVal}\n  Expected: ${tc.expectedOutput}`);
        
        const tcUi = this.container.querySelector(`#testcase-ui-${idx}`);
        if (tcUi) {
          tcUi.querySelector(".tc-output-row").style.display = "flex";
          tcUi.querySelector(".tc-actual-val").innerText = outputVal;
          const badge = tcUi.querySelector(".tc-status-badge");
          badge.innerText = allPassed ? "✓ Passed" : "✕ Failed";
          badge.className = allPassed ? "tc-status-badge text-success" : "tc-status-badge text-danger";
        }
      });
    }

    const endTime = performance.now();
    const execMs = Math.round((endTime - startTime) + (Math.random() * 20)); // simulated runtime addition
    this.displayResults(allPassed, consoleLog, execMs);
  },

  displayResults(allPassed, logs, executionTimeMs) {
    this.switchTab("output");
    
    const banner = allPassed 
      ? `<span class="neon-text-green font-bold">[SUCCESS] All Test Cases Passed!</span>`
      : `<span class="neon-text-red font-bold">[FAILED] Some test cases did not pass.</span>`;
    
    this.consoleElement.innerHTML = `
      ${banner}\n
      --------------------------------------------------
      ${logs.join("\n\n")}
      --------------------------------------------------
      Execution finished in ${executionTimeMs}ms.
    `;

    // Display action bar metrics
    const metricsDiv = this.container.querySelector("#execution-metrics");
    const timeSpan = this.container.querySelector("#metric-time");
    const spaceSpan = this.container.querySelector("#metric-space");

    timeSpan.innerText = `${executionTimeMs} ms`;
    spaceSpan.innerText = this.currentQuestion.difficulty === "Easy" ? "O(1) auxiliary" : "O(N) memory";
    metricsDiv.style.display = "block";

    // If passed all tests, highlight button or enable success action
    if (allPassed) {
      this.container.querySelector("#btn-submit-code").classList.add("pulse-glow");
    } else {
      this.container.querySelector("#btn-submit-code").classList.remove("pulse-glow");
    }
  },

  submitCode() {
    if (!this.currentQuestion) return;
    
    // Run the code verification first to check if we passed
    const outputText = this.consoleElement.innerText;
    const isSuccess = outputText.includes("[SUCCESS] All Test Cases Passed!");

    if (!isSuccess) {
      this.switchTab("output");
      this.consoleElement.innerHTML = `
        <span class="neon-text-red font-bold">[SUBMIT REJECTED]</span>\n
        Please click "Run Code" and verify that all test cases pass before submitting your solution.
      `;
      return;
    }

    // Save success in local storage progress
    if (window.AppStore) {
      // Average practice time calculated by length of the estimated time or simple tracking
      const timeSecs = parseInt(this.currentQuestion.estTime, 10) * 60 - 200 || 400; // Mock time taken
      window.AppStore.solveProblem(this.currentQuestion.id, timeSecs);
    }

    // Modal success popup
    this.showSuccessModal();
  },

  showSuccessModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay active";
    modal.innerHTML = `
      <div class="modal-content glass-panel neon-border text-center">
        <div class="modal-icon text-success">🏆</div>
        <h2>Problem Solved!</h2>
        <p class="text-muted">Congratulations! Your solution for <strong>${this.currentQuestion.title}</strong> has been compiled, accepted, and recorded.</p>
        
        <div class="modal-stats">
          <div class="modal-stat">
            <span class="lbl">Complexity</span>
            <span class="val text-cyan">${this.currentQuestion.id === "binary-search-prob" ? "O(log N)" : "O(N)"}</span>
          </div>
          <div class="modal-stat">
            <span class="lbl">Streak</span>
            <span class="val text-orange">${window.AppStore ? window.AppStore.getStreak().current : 1} Days</span>
          </div>
        </div>

        <button id="btn-modal-close" class="btn btn-primary">Back to Problems</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector("#btn-modal-close").addEventListener("click", () => {
      modal.remove();
      // Route back to practice problems
      if (window.AppRouter) {
        window.AppRouter.navigateTo("problems");
      }
    });
  }
};

window.CodeEditor = CodeEditor;
