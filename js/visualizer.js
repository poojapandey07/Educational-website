// DSA Practice Platform - Binary Search Interactive Visualizer

const BinarySearchVisualizer = {
  array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  low: 0,
  high: 9,
  mid: -1,
  target: 23,
  stepCount: 0,
  isFinished: false,
  found: false,
  phase: "calculate-mid", // "calculate-mid" or "compare-and-shrink"
  container: null,

  init(containerElement, targetValue = 23) {
    this.container = containerElement;
    this.target = parseInt(targetValue, 10) || 23;
    this.low = 0;
    this.high = this.array.length - 1;
    this.mid = -1;
    this.stepCount = 0;
    this.isFinished = false;
    this.found = false;
    this.phase = "calculate-mid";

    this.renderInitialUI();
  },

  renderInitialUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="visualizer-card glass-panel neon-border">
        <div class="visualizer-header">
          <h3>Binary Search Simulator</h3>
          <div class="visualizer-controls">
            <div class="input-group">
              <label for="search-target">Target:</label>
              <input type="number" id="search-target" value="${this.target}" class="tech-input">
            </div>
            <button id="btn-vis-reset" class="btn btn-secondary btn-sm">Reset</button>
            <button id="btn-vis-step" class="btn btn-primary btn-sm">Next Step</button>
          </div>
        </div>

        <div class="visualizer-body">
          <div id="vis-array-container" class="vis-array"></div>
          
          <div class="vis-pointers-container">
            <div id="pointer-low" class="vis-pointer pointer-low"><span>Low</span><div class="arrow">▲</div></div>
            <div id="pointer-mid" class="vis-pointer pointer-mid" style="display:none"><span>Mid</span><div class="arrow">▲</div></div>
            <div id="pointer-high" class="vis-pointer pointer-high"><span>High</span><div class="arrow">▲</div></div>
          </div>

          <div class="visualizer-status">
            <div class="status-metric">
              <span>Step:</span> <span id="vis-step-val" class="neon-text-blue">0</span>
            </div>
            <div class="status-metric">
              <span>Search Space:</span> <span id="vis-range-val">0 to 9</span>
            </div>
          </div>

          <div id="vis-explanation" class="vis-explanation glass-panel">
            Initialize low pointer to 0 and high pointer to 9. Click <strong>Next Step</strong> to calculate the middle element.
          </div>
        </div>
      </div>
    `;

    // Render Array Nodes
    const arrContainer = this.container.querySelector("#vis-array-container");
    arrContainer.innerHTML = "";
    this.array.forEach((val, index) => {
      const node = document.createElement("div");
      node.className = "vis-node";
      node.id = `vis-node-${index}`;
      node.innerHTML = `
        <div class="vis-node-index">${index}</div>
        <div class="vis-node-val">${val}</div>
      `;
      arrContainer.appendChild(node);
    });

    // Add Event Listeners
    this.container.querySelector("#search-target").addEventListener("change", (e) => {
      this.init(this.container, e.target.value);
    });

    this.container.querySelector("#btn-vis-reset").addEventListener("click", () => {
      const inputVal = this.container.querySelector("#search-target").value;
      this.init(this.container, inputVal);
    });

    this.container.querySelector("#btn-vis-step").addEventListener("click", () => {
      this.step();
    });

    this.updatePointers();
  },

  updatePointers() {
    if (!this.container) return;

    // Reset styles and active classes on nodes
    for (let i = 0; i < this.array.length; i++) {
      const node = this.container.querySelector(`#vis-node-${i}`);
      node.classList.remove("node-active", "node-low", "node-high", "node-mid", "node-success", "node-eliminated");
      
      // If index is outside current search space, mark it as eliminated
      if (i < this.low || i > this.high) {
        node.classList.add("node-eliminated");
      }
    }

    // Set classes for low, high, and mid
    if (this.low < this.array.length && this.low >= 0) {
      this.container.querySelector(`#vis-node-${this.low}`).classList.add("node-low");
    }
    if (this.high < this.array.length && this.high >= 0) {
      this.container.querySelector(`#vis-node-${this.high}`).classList.add("node-high");
    }

    // Align pointers visually
    const arrNodeWidth = 60; // Approximate width + margin
    const pointerLow = this.container.querySelector("#pointer-low");
    const pointerHigh = this.container.querySelector("#pointer-high");
    const pointerMid = this.container.querySelector("#pointer-mid");

    if (this.low <= this.high) {
      pointerLow.style.left = `${this.low * arrNodeWidth + 15}px`;
      pointerLow.style.display = "flex";
      pointerHigh.style.left = `${this.high * arrNodeWidth + 15}px`;
      pointerHigh.style.display = "flex";
    } else {
      pointerLow.style.display = "none";
      pointerHigh.style.display = "none";
    }

    if (this.mid !== -1 && this.low <= this.high) {
      pointerMid.style.left = `${this.mid * arrNodeWidth + 15}px`;
      pointerMid.style.display = "flex";
      
      const midNode = this.container.querySelector(`#vis-node-${this.mid}`);
      midNode.classList.add("node-mid");
      if (this.found) {
        midNode.classList.add("node-success");
      }
    } else {
      pointerMid.style.display = "none";
    }

    // Update statuses
    this.container.querySelector("#vis-step-val").innerText = this.stepCount;
    this.container.querySelector("#vis-range-val").innerText = this.low <= this.high ? `[index ${this.low} to ${this.high}]` : "Empty space";
  },

  step() {
    if (this.isFinished) {
      this.setExplanation("The search has finished. Click <strong>Reset</strong> to try another search target.");
      return;
    }

    this.stepCount++;

    if (this.low > this.high) {
      this.isFinished = true;
      this.found = false;
      this.updatePointers();
      this.setExplanation(`<span class="neon-text-red">Target ${this.target} not found!</span> The search space is now empty (\`low > high\`), meaning the element is not present in the array. Binary Search terminated.`);
      return;
    }

    if (this.phase === "calculate-mid") {
      // Step: Calculate mid
      this.mid = Math.floor(this.low + (this.high - this.low) / 2);
      this.updatePointers();
      
      const midVal = this.array[this.mid];
      this.setExplanation(`<strong>Step ${this.stepCount} (Calculate Mid):</strong> We calculate the middle index of the search space.<br>
        <code>mid = low + Math.floor((high - low) / 2)</code><br>
        <code>mid = ${this.low} + Math.floor((${this.high} - ${this.low}) / 2) = ${this.mid}</code>.<br>
        The value at index <strong>${this.mid}</strong> is <strong>${midVal}</strong>.`);
      
      this.phase = "compare-and-shrink";
    } else {
      // Step: Compare and shrink
      const midVal = this.array[this.mid];
      
      if (midVal === this.target) {
        this.found = true;
        this.isFinished = true;
        this.updatePointers();
        this.setExplanation(`<strong>Step ${this.stepCount} (Found!):</strong> We compare value at mid (<code>${midVal}</code>) with target (<code>${this.target}</code>).<br>
          <span class="neon-text-green">Match found!</span> Target is at index <strong>${this.mid}</strong>. Binary Search successful!`);
      } else if (midVal < this.target) {
        const oldLow = this.low;
        this.low = this.mid + 1;
        this.updatePointers();
        this.setExplanation(`<strong>Step ${this.stepCount} (Shrink Left):</strong> We compare mid value (<code>${midVal}</code>) with target (<code>${this.target}</code>).<br>
          Since <code>${midVal} &lt; ${this.target}</code>, the target must lie in the right half of the array.<br>
          We eliminate indices ${oldLow} to ${this.mid} and set <code>low = mid + 1</code> (index <strong>${this.low}</strong>).`);
        this.mid = -1; // clear mid highlight
        this.phase = "calculate-mid";
      } else {
        const oldHigh = this.high;
        this.high = this.mid - 1;
        this.updatePointers();
        this.setExplanation(`<strong>Step ${this.stepCount} (Shrink Right):</strong> We compare mid value (<code>${midVal}</code>) with target (<code>${this.target}</code>).<br>
          Since <code>${midVal} &gt; ${this.target}</code>, the target must lie in the left half of the array.<br>
          We eliminate indices ${this.mid} to ${oldHigh} and set <code>high = mid - 1</code> (index <strong>${this.high}</strong>).`);
        this.mid = -1; // clear mid highlight
        this.phase = "calculate-mid";
      }

      // Check if low > high after updating
      if (this.low > this.high && !this.isFinished) {
        // Prepare final step for next click
        this.phase = "calculate-mid";
      }
    }
  },

  setExplanation(text) {
    if (this.container) {
      this.container.querySelector("#vis-explanation").innerHTML = text;
    }
  }
};

// Bind to window
window.BinarySearchVisualizer = BinarySearchVisualizer;
