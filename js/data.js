// DSA Practice Platform - Mock Data

const dsaConcepts = [
  {
    id: "binary-search",
    name: "Binary Search",
    category: "algorithms",
    shortDesc: "An efficient algorithm for finding an item from a sorted list of items by repeatedly halving the search interval.",
    difficulty: "Easy",
    frequency: "Very Frequently Asked",
    companies: ["Product Companies", "Startups"],
    detail: {
      definition: "Binary Search is a search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array; if they are unequal, the half in which the target cannot lie is eliminated and the search continues on the remaining half until the target is found or the search space is empty.",
      howItWorks: "Binary search works by taking advantage of the sorted nature of the array. By comparing the target value to the middle element, we can immediately discard half of the array. If the target is smaller than the middle element, it must lie in the left half. If it is larger, it must lie in the right half.",
      stepByStep: [
        "Initialize two pointers: `low = 0` and `high = length - 1`.",
        "Loop while `low <= high`.",
        "Calculate the middle index: `mid = Math.floor((low + high) / 2)`.",
        "If `array[mid] === target`, search is successful. Return `mid`.",
        "If `array[mid] < target`, the target must be in the right half. Set `low = mid + 1`.",
        "If `array[mid] > target`, the target must be in the left half. Set `high = mid - 1`.",
        "If the loop ends and `low > high`, the target is not in the array. Return `-1`."
      ],
      timeComplexity: "O(log N)",
      spaceComplexity: "O(1)",
      commonMistakes: [
        "Calculating `mid` using `(low + high) / 2` can cause integer overflow in languages like C++ or Java if the sum exceeds the maximum integer limit. Use `low + Math.floor((high - low) / 2)` instead.",
        "Incorrect loop termination condition: using `low < high` instead of `low <= high`, which can miss the target if it is at the boundary.",
        "Updating pointers incorrectly: setting `low = mid` or `high = mid` instead of `mid + 1` or `mid - 1`, leading to infinite loops."
      ],
      realInterviewUseCases: [
        "Finding an element in a sorted list.",
        "Finding the peak element in a mountain array.",
        "Finding the first or last occurrence of an element in a sorted array.",
        "Search in a rotated sorted array.",
        "Solving 'binary search on answer' problems, such as finding the minimum capacity needed to ship packages within D days."
      ]
    },
    practiceQuestions: ["binary-search-prob"]
  },
  {
    id: "arrays",
    name: "Arrays",
    category: "data-structures",
    shortDesc: "A collection of elements stored at contiguous memory locations, allowing constant time access by index.",
    difficulty: "Easy",
    frequency: "Very Frequently Asked",
    companies: ["Product Companies", "Service Companies", "Startups"],
    detail: {
      definition: "An array is a data structure consisting of a collection of elements, each identified by at least one array index or key. Elements are stored in contiguous memory locations, which makes indexing extremely fast.",
      howItWorks: "Because elements are stored contiguously, the memory address of any element can be computed using a simple formula: `address = base_address + index * element_size`. This allows O(1) random access.",
      stepByStep: [
        "Allocate a contiguous block of memory of size `capacity * element_size`.",
        "Elements are indexed starting from 0 to `size - 1`.",
        "Accessing element at index `i` reads from `base_address + i * size`.",
        "Inserting or deleting elements in the middle requires shifting subsequent elements, taking O(N) time."
      ],
      timeComplexity: "Access: O(1), Search: O(N) (O(log N) if sorted), Insertion/Deletion: O(N)",
      spaceComplexity: "O(N) to store N elements.",
      commonMistakes: [
        "Index out of bounds error: Trying to access index `N` on an array of size `N` (valid indexes are `0` to `N-1`).",
        "Forgetting that inserting an element at the beginning requires shifting all other elements, which is an O(N) operation.",
        "Fixed-size limitation: Static arrays cannot be resized after allocation."
      ],
      realInterviewUseCases: [
        "Implementing lists, stacks, queues, and hash maps.",
        "Storing raw sequence data.",
        "Solving matrix/2D-grid problems (represented as 2D arrays).",
        "Two pointer or sliding window algorithms."
      ]
    },
    practiceQuestions: ["two-sum-prob", "container-water-prob"]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    category: "algorithms",
    shortDesc: "A technique that converts nested loops into a single loop over arrays or lists to reduce time complexity.",
    difficulty: "Medium",
    frequency: "Very Frequently Asked",
    companies: ["Product Companies", "Startups"],
    detail: {
      definition: "The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s.",
      howItWorks: "Instead of recalculating the results of overlapping subsegments from scratch, we slide the window by adding the next element and removing the oldest element. This maintains a running state and avoids redundant calculations.",
      stepByStep: [
        "Define two pointers `left = 0` and `right = 0` representing the boundaries of the window.",
        "Expand the window by incrementing `right` and incorporating `array[right]` into our calculations.",
        "If the window violates a condition (e.g. too many duplicate characters), shrink it from the left by incrementing `left` and removing `array[left]` from the calculation.",
        "Update the global optimal result (e.g. max length) at each step."
      ],
      timeComplexity: "O(N) since each element is visited at most twice (once by `right`, once by `left`).",
      spaceComplexity: "O(K) where K is the size of the window (often storing elements in a Set/Map).",
      commonMistakes: [
        "Not properly updating the state when shrinking the window from the left.",
        "Off-by-one errors in calculating window sizes: the size of window `[left, right]` is `right - left + 1`.",
        "Incorrect termination conditions in the loops."
      ],
      realInterviewUseCases: [
        "Finding the maximum sum subarray of size K.",
        "Longest substring without repeating characters.",
        "Minimum size subarray sum.",
        "Permutation in string."
      ]
    },
    practiceQuestions: ["longest-substring-prob"]
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    category: "data-structures",
    shortDesc: "A linear collection of data elements whose order is not given by their physical placement in memory but by pointers.",
    difficulty: "Easy",
    frequency: "Frequently Asked",
    companies: ["Product Companies", "Service Companies"],
    detail: {
      definition: "A linked list is a linear data structure where elements are stored in nodes. Each node contains a data field and a reference (pointer) to the next node in the sequence.",
      howItWorks: "Nodes can be scattered anywhere in memory. We access elements sequentially by starting from the `head` node and traversing through the `next` pointers until we reach `null`.",
      stepByStep: [
        "Create a Node structure with `val` and `next` pointer.",
        "Store a pointer to the first node called `head`.",
        "To traverse, initialize a pointer `curr = head` and move it via `curr = curr.next`.",
        "To insert a node, adjust pointers of the surrounding nodes without shifting elements in memory (O(1) insertion at head or given node)."
      ],
      timeComplexity: "Access/Search: O(N), Insertion/Deletion: O(1) if pointer to node is known.",
      spaceComplexity: "O(N) where N is the number of nodes.",
      commonMistakes: [
        "Losing the reference to the rest of the list when modifying pointers. Always update the new node's next pointer before breaking old links.",
        "Null pointer exceptions: Attempting to access `curr.next` when `curr` is already null.",
        "Forgetting to update the `head` pointer when inserting or deleting the first element."
      ],
      realInterviewUseCases: [
        "Implementing undo-redo functionality.",
        "Adjacency list representation in graphs.",
        "Managing memory allocation (free lists).",
        "Implementing Hash Maps (chaining collision resolution)."
      ]
    },
    practiceQuestions: ["reverse-linked-list-prob"]
  },
  {
    id: "stack",
    name: "Stack",
    category: "data-structures",
    shortDesc: "A LIFO (Last In First Out) data structure where insertions and deletions happen at the same end.",
    difficulty: "Easy",
    frequency: "Frequently Asked",
    companies: ["Product Companies", "Service Companies", "Startups"],
    detail: {
      definition: "A stack is a linear data structure that follows the LIFO (Last In First Out) principle. The element inserted last is the first one to be removed.",
      howItWorks: "It supports two main operations: `push` (inserts an element to the top) and `pop` (removes the top element). Both operations are performed at a single point called the `top`.",
      stepByStep: [
        "Maintain a pointer or index indicating the top of the stack.",
        "To push, increment top and write element.",
        "To pop, read element at top and decrement top.",
        "Both push and pop are O(1) operations."
      ],
      timeComplexity: "Push: O(1), Pop: O(1), Peek: O(1), Search: O(N)",
      spaceComplexity: "O(N) to store N elements.",
      commonMistakes: [
        "Stack Underflow: Attempting to pop from an empty stack.",
        "Stack Overflow: Pushing into a fixed-size stack that is full.",
        "Using recursion instead of an explicit stack which can lead to recursion stack overflow for deep computations."
      ],
      realInterviewUseCases: [
        "Balanced parenthesis checking.",
        "Expression evaluation (infix to postfix, postfix evaluation).",
        "Backtracking algorithms (like maze solving, depth-first search).",
        "Browser history navigation (Back button)."
      ]
    },
    practiceQuestions: ["valid-parentheses-prob"]
  },
  {
    id: "graphs",
    name: "Graphs",
    category: "data-structures",
    shortDesc: "A non-linear data structure consisting of nodes (vertices) connected by edges.",
    difficulty: "Hard",
    frequency: "Very Frequently Asked",
    companies: ["Product Companies", "Startups"],
    detail: {
      definition: "A graph is a data structure consisting of a finite set of vertices (or nodes) and a set of edges that connect these vertices. Graphs can be directed/undirected and weighted/unweighted.",
      howItWorks: "Graphs are represented using either an Adjacency Matrix (a 2D grid of size V x V) or an Adjacency List (an array of lists, where index `i` contains vertices connected to vertex `i`).",
      stepByStep: [
        "Represent nodes and their connections using an adjacency list for space efficiency.",
        "Traverse using Breadth-First Search (BFS) using a Queue to visit nodes level-by-level.",
        "Traverse using Depth-First Search (DFS) using recursion/Stack to visit nodes deeply along branches.",
        "Track visited nodes to prevent cycles and infinite loops."
      ],
      timeComplexity: "Traversal (DFS/BFS): O(V + E) where V is vertices and E is edges.",
      spaceComplexity: "O(V + E) for adjacency list, O(V^2) for adjacency matrix.",
      commonMistakes: [
        "Not tracking visited nodes, resulting in infinite loops in cyclic graphs.",
        "Confusing DFS (Stack/recursion) with BFS (Queue) in implementations.",
        "Incorrectly mapping nodes in undirected graphs (edges must be added bi-directionally)."
      ],
      realInterviewUseCases: [
        "Social network friend connections.",
        "Routing algorithms (Google Maps, shortest path).",
        "Dependency resolution (e.g. package managers, compiler build orders).",
        "Network flow and connectivity analysis."
      ]
    },
    practiceQuestions: ["course-schedule-prob"]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    category: "algorithms",
    shortDesc: "A technique that solves complex problems by breaking them down into simpler subproblems and caching their solutions.",
    difficulty: "Hard",
    frequency: "Very Frequently Asked",
    companies: ["Product Companies", "Startups"],
    detail: {
      definition: "Dynamic Programming (DP) is an algorithmic paradigm that solves a given complex problem by breaking it into subproblems, storing the results of subproblems to avoid recomputing them (memoization/tabulation), and building up to the final solution.",
      howItWorks: "DP applies to problems exhibiting two properties: 1. Overlapping Subproblems (subproblems are solved repeatedly), and 2. Optimal Substructure (an optimal solution to the problem contains optimal solutions to subproblems).",
      stepByStep: [
        "Identify if the problem can be broken into subproblems.",
        "Define the state (e.g. `dp[i]` represents the answer for index `i`).",
        "Establish the state transition equation (e.g. `dp[i] = dp[i-1] + dp[i-2]`).",
        "Implement either Top-Down (recursion + memoization cache) or Bottom-Up (iterative tabulation table).",
        "Optimize space if the current state only depends on a few previous states."
      ],
      timeComplexity: "Varies; typically reduced from exponential O(2^N) to polynomial O(N) or O(N*W).",
      spaceComplexity: "O(N) or O(N*M) to store the DP table. Can often be optimized.",
      commonMistakes: [
        "Not identifying the correct base cases, leading to infinite recursion or incorrect index accesses.",
        "Incorrect state definition or transition formula.",
        "Using excessive space when only the last few states are required (e.g., using a 2D grid instead of two rows)."
      ],
      realInterviewUseCases: [
        "Fibonacci-style sequence problems.",
        "Knapsack problems (0/1 Knapsack, unbounded knapsack).",
        "String alignment and edit distance.",
        "Grid pathfinding with blockages."
      ]
    },
    practiceQuestions: ["lcs-prob"]
  }
];

const dsaQuestions = [
  {
    id: "binary-search-prob",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    frequency: "Frequently Asked",
    estTime: "15 mins",
    statement: "Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4."
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1."
      }
    ],
    constraints: [
      "\`1 <= nums.length <= 10^4\`",
      "\`-10^4 < nums[i], target < 10^4\`",
      "All the integers in \`nums\` are unique.",
      "\`nums\` is sorted in ascending order."
    ],
    starterCode: {
      javascript: `function search(nums, target) {
    // Write your code here
    return -1;
}`,
      python: `def search(nums: List[int], target: int) -> int:
    # Write your code here
    return -1`,
      cpp: `int search(vector<int>& nums, int target) {
    // Write your code here
    return -1;
}`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`,
      c: `int search(int* nums, int numsSize, int target) {
    // Write your code here
    return -1;
}`
    },
    testCases: [
      { input: "[[-1,0,3,5,9,12], 9]", expectedOutput: "4", isHidden: false },
      { input: "[[-1,0,3,5,9,12], 2]", expectedOutput: "-1", isHidden: false },
      { input: "[[5], 5]", expectedOutput: "0", isHidden: true },
      { input: "[[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23]", expectedOutput: "5", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0], args[1]);
    }
  },
  {
    id: "two-sum-prob",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    frequency: "Very Frequently Asked",
    estTime: "20 mins",
    statement: "Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "\`2 <= nums.length <= 10^4\`",
      "\`-10^9 <= nums[i] <= 10^9\`",
      "\`-10^9 <= target <= 10^9\`",
      "Only one valid answer exists."
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    return [];
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
    *returnSize = 2;
    int* res = (int*)malloc(2 * sizeof(int));
    return res;
}`
    },
    testCases: [
      { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]", isHidden: false },
      { input: "[[3,2,4], 6]", expectedOutput: "[1,2]", isHidden: false },
      { input: "[[3,3], 6]", expectedOutput: "[0,1]", isHidden: true },
      { input: "[[-1,-3,4,8,12], 9]", expectedOutput: "[0,4]", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      const res = userFunc(args[0], args[1]);
      if (!Array.isArray(res)) return JSON.stringify(res);
      return JSON.stringify(res.sort((a,b) => a-b));
    }
  },
  {
    id: "valid-parentheses-prob",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    frequency: "Frequently Asked",
    estTime: "15 mins",
    statement: "Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
        explanation: "The parentheses match."
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        explanation: "All sets of brackets match."
      },
      {
        input: "s = \"(]\"",
        output: "false",
        explanation: "Opening bracket '(' is closed by wrong type ']'."
      }
    ],
    constraints: [
      "\`1 <= s.length <= 10^4\`",
      "\`s\` consists of parentheses only \`'()[]{}'\`."
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your code here
    return false;
}`,
      python: `def isValid(s: str) -> bool:
    # Write your code here
    return False`,
      cpp: `bool isValid(string s) {
    // Write your code here
    return false;
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      c: `bool isValid(char* s) {
    // Write your code here
    return false;
}`
    },
    testCases: [
      { input: "[\"()\"]", expectedOutput: "true", isHidden: false },
      { input: "[\"()[]{}\"]", expectedOutput: "true", isHidden: false },
      { input: "[\"(]\"]", expectedOutput: "false", isHidden: false },
      { input: "[\"([)]\"]", expectedOutput: "false", isHidden: true },
      { input: "[\"{[]}\"]", expectedOutput: "true", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0]).toString();
    }
  },
  {
    id: "longest-substring-prob",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings",
    frequency: "Very Frequently Asked",
    estTime: "25 mins",
    statement: "Given a string \`s\`, find the length of the **longest substring** without repeating characters.",
    examples: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      },
      {
        input: "s = \"pwwkew\"",
        output: "3",
        explanation: "The answer is \"wke\", with the length of 3. Note that the answer must be a substring, \"wke\" is a subsequence."
      }
    ],
    constraints: [
      "\`0 <= s.length <= 5 * 10^4\`",
      "\`s\` consists of English letters, digits, symbols and spaces."
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    return 0;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    return 0`,
      cpp: `int lengthOfLongestSubstring(string s) {
    // Write your code here
    return 0;
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      c: `int lengthOfLongestSubstring(char* s) {
    // Write your code here
    return 0;
}`
    },
    testCases: [
      { input: "[\"abcabcbb\"]", expectedOutput: "3", isHidden: false },
      { input: "[\"bbbbb\"]", expectedOutput: "1", isHidden: false },
      { input: "[\"pwwkew\"]", expectedOutput: "3", isHidden: false },
      { input: "[\"\"]", expectedOutput: "0", isHidden: true },
      { input: "[\"au\"]", expectedOutput: "2", isHidden: true },
      { input: "[\"dvdf\"]", expectedOutput: "3", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0]);
    }
  },
  {
    id: "container-water-prob",
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Arrays",
    frequency: "Frequently Asked",
    estTime: "25 mins",
    statement: "You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn *the maximum amount of water a container can store*.\n\n**Notice** that you may not slant the container.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49."
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "The max area is 1*1 = 1."
      }
    ],
    constraints: [
      "\`n == height.length\`",
      "\`2 <= n <= 10^5\`",
      "\`0 <= height[i] <= 10^4\`"
    ],
    starterCode: {
      javascript: `function maxArea(height) {
    // Write your code here
    return 0;
}`,
      python: `def maxArea(height: List[int]) -> int:
    # Write your code here
    return 0`,
      cpp: `int maxArea(vector<int>& height) {
    // Write your code here
    return 0;
}`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      c: `int maxArea(int* height, int heightSize) {
    // Write your code here
    return 0;
}`
    },
    testCases: [
      { input: "[[1,8,6,2,5,4,8,3,7]]", expectedOutput: "49", isHidden: false },
      { input: "[[1,1]]", expectedOutput: "1", isHidden: false },
      { input: "[[4,3,2,1,4]]", expectedOutput: "16", isHidden: true },
      { input: "[[1,2,1]]", expectedOutput: "2", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0]);
    }
  },
  {
    id: "reverse-linked-list-prob",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    frequency: "Very Frequently Asked",
    estTime: "15 mins",
    statement: "Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.\n\n*Note: In JavaScript, standard ListNode has property \`val\` and \`next\`.*",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "head = [1,2]",
        output: "[2,1]"
      }
    ],
    constraints: [
      "The number of nodes in the list is the range \`[0, 5000]\`.",
      "\`-5000 <= Node.val <= 5000\`"
    ],
    starterCode: {
      javascript: `/*
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseList(head) {
    // Write your code here
    return head;
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    # Write your code here
    return head`,
      cpp: `ListNode* reverseList(ListNode* head) {
    // Write your code here
    return head;
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return head;
    }
}`,
      c: `struct ListNode* reverseList(struct ListNode* head) {
    // Write your code here
    return head;
}`
    },
    testCases: [
      { input: "[[1,2,3,4,5]]", expectedOutput: "[5,4,3,2,1]", isHidden: false },
      { input: "[[1,2]]", expectedOutput: "[2,1]", isHidden: false },
      { input: "[[]]", expectedOutput: "[]", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      function buildList(arr) {
        if (!arr || arr.length === 0) return null;
        let head = { val: arr[0], next: null };
        let curr = head;
        for (let i = 1; i < arr.length; i++) {
          curr.next = { val: arr[i], next: null };
          curr = curr.next;
        }
        return head;
      }
      function listToArr(head) {
        let arr = [];
        let curr = head;
        while (curr) {
          arr.push(curr.val);
          curr = curr.next;
        }
        return arr;
      }
      
      const listHead = buildList(args[0]);
      const reversedHead = userFunc(listHead);
      return JSON.stringify(listToArr(reversedHead));
    }
  },
  {
    id: "course-schedule-prob",
    title: "Course Schedule",
    difficulty: "Hard",
    topic: "Graphs",
    frequency: "Very Frequently Asked",
    estTime: "30 mins",
    statement: "There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.\n\n* For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.\n\nReturn \`true\` if you can finish all courses. Otherwise, return \`false\`.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible."
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible."
      }
    ],
    constraints: [
      "\`1 <= numCourses <= 2000\`",
      "\`0 <= prerequisites.length <= 5000\`",
      "\`prerequisites[i].length == 2\`",
      "\`0 <= ai, bi < numCourses\`",
      "All the pairs prerequisites[i] are unique."
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
    // Write your code here
    return false;
}`,
      python: `def canFinish(numCourses: int, prerequisites: List[List[int]]) -> bool:
    # Write your code here
    return False`,
      cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // Write your code here
    return false;
}`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your code here
        return false;
    }
}`,
      c: `bool canFinish(int numCourses, int** prerequisites, int prerequisitesSize, int* prerequisitesColSize) {
    // Write your code here
    return false;
}`
    },
    testCases: [
      { input: "[2, [[1,0]]]", expectedOutput: "true", isHidden: false },
      { input: "[2, [[1,0],[0,1]]]", expectedOutput: "false", isHidden: false },
      { input: "[3, [[1,0],[2,1]]]", expectedOutput: "true", isHidden: true },
      { input: "[4, [[2,0],[3,1],[3,2],[0,3]]]", expectedOutput: "false", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0], args[1]).toString();
    }
  },
  {
    id: "lcs-prob",
    title: "Longest Common Subsequence",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    frequency: "Frequently Asked",
    estTime: "30 mins",
    statement: "Given two strings \`text1\` and \`text2\`, return *the length of their longest common subsequence*. If there is no common subsequence, return \`0\`.\n\nA **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\n* For example, \`\"ace\"\` is a subsequence of \`\"abcde\"\`.\n\nA **common subsequence** of two strings is a subsequence that is common to both strings.",
    examples: [
      {
        input: "text1 = \"abcde\", text2 = \"ace\"",
        output: "3",
        explanation: "The longest common subsequence is \"ace\" and its length is 3."
      },
      {
        input: "text1 = \"abc\", text2 = \"abc\"",
        output: "3",
        explanation: "The longest common subsequence is \"abc\" and its length is 3."
      },
      {
        input: "text1 = \"abc\", text2 = \"def\"",
        output: "0",
        explanation: "There is no such common subsequence, so the result is 0."
      }
    ],
    constraints: [
      "\`1 <= text1.length, text2.length <= 1000\`",
      "\`text1\` and \`text2\` consist of lowercase English characters only."
    ],
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {
    // Write your code here
    return 0;
}`,
      python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    # Write your code here
    return 0`,
      cpp: `int longestCommonSubsequence(string text1, string text2) {
    // Write your code here
    return 0;
}`,
      java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        // Write your code here
        return 0;
    }
}`,
      c: `int longestCommonSubsequence(char* text1, char* text2) {
    // Write your code here
    return 0;
}`
    },
    testCases: [
      { input: "[\"abcde\", \"ace\"]", expectedOutput: "3", isHidden: false },
      { input: "[\"abc\", \"abc\"]", expectedOutput: "3", isHidden: false },
      { input: "[\"abc\", \"def\"]", expectedOutput: "0", isHidden: false },
      { input: "[\"ezupkr\", \"ubmrapg\"]", expectedOutput: "2", isHidden: true }
    ],
    runTestJS: function(userFunc, args) {
      return userFunc(args[0], args[1]);
    }
  }
];

const quizQuestions = {
  "Arrays": {
    "Easy": [
      {
        question: "What is the average time complexity to access an element in a static array using its index?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answerIndex: 0,
        explanation: "Accessing an element in an array using an index is a direct mathematical computation of the memory address, taking O(1) constant time."
      },
      {
        question: "Which of the following is a disadvantage of a static array?",
        options: ["Constant access time", "Sequential memory allocation", "Fixed size limit", "Elements can be stored anywhere in memory"],
        answerIndex: 2,
        explanation: "Static arrays have a fixed size which must be known at compile time or initialization. They cannot grow dynamically."
      }
    ],
    "Medium": [
      {
        question: "What is the space complexity of solving the Two Sum problem using a Hash Map?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answerIndex: 2,
        explanation: "A Hash Map stores up to N elements in the worst case (where N is the size of the array), resulting in O(N) space complexity."
      }
    ],
    "Hard": [
      {
        question: "In a dynamic array (like std::vector in C++ or ArrayList in Java), when the capacity is exceeded, what is the amortized time complexity of inserting a new element at the end?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answerIndex: 0,
        explanation: "Although resizing the array takes O(N) because elements are copied, the resizing occurs infrequently (usually doubling the capacity). Averaged over N insertions, the complexity per insertion is O(1) amortized."
      }
    ]
  },
  "Stack": {
    "Easy": [
      {
        question: "Which of the following principles does a Stack follow?",
        options: ["First In First Out (FIFO)", "Last In First Out (LIFO)", "First In Last Out (FILO)", "Last In Last Out (LILO)"],
        answerIndex: 1,
        explanation: "A stack is a Last In First Out (LIFO) data structure. The last element added is the first one to be removed."
      }
    ],
    "Medium": [
      {
        question: "Which of these is NOT a common application of stacks?",
        options: ["Checking balanced parentheses", "Depth-First Search (DFS) traversal", "Breadth-First Search (BFS) traversal", "Function call tracking in compilers"],
        answerIndex: 2,
        explanation: "BFS utilizes a Queue data structure to explore level-by-level, whereas DFS uses a Stack (or the call stack recursively)."
      }
    ]
  },
  "Linked List": {
    "Easy": [
      {
        question: "What is the time complexity to insert a node at the head of a Singly Linked List?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answerIndex: 0,
        explanation: "Inserting at the head only requires allocating the node and updating its next pointer to point to the current head, which takes O(1) time."
      }
    ]
  },
  "Trees": {
    "Medium": [
      {
        question: "Which tree traversal visits the nodes in sorted order for a Binary Search Tree (BST)?",
        options: ["Pre-order traversal", "Post-order traversal", "In-order traversal", "Level-order traversal"],
        answerIndex: 2,
        explanation: "In-order traversal visits the left subtree, then the current node, then the right subtree, which retrieves BST elements in sorted order."
      }
    ]
  },
  "Graphs": {
    "Hard": [
      {
        question: "What is the time complexity of Dijkstra's algorithm for finding the shortest path in a graph using a Binary Heap?",
        options: ["O(V + E)", "O(V log V)", "O((V + E) log V)", "O(V^2)"],
        answerIndex: 2,
        explanation: "Using an adjacency list and binary heap (priority queue), Dijkstra's algorithm has a time complexity of O((V + E) log V)."
      }
    ]
  },
  "Mixed DSA": {
    "Easy": [
      {
        question: "Which of these data structures allows O(1) average time complexity for both search and insertion?",
        options: ["Binary Search Tree", "Hash Map", "Sorted Array", "Doubly Linked List"],
        answerIndex: 1,
        explanation: "A Hash Map utilizes hashing to achieve constant O(1) time complexity on average for both insertions and lookups."
      }
    ],
    "Medium": [
      {
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(2^N)"],
        answerIndex: 2,
        explanation: "The worst-case complexity of Quick Sort is O(N^2), which happens when the pivot chosen is always the simplest or largest element (e.g. on already sorted arrays)."
      }
    ]
  }
};

const interviewRounds = [
  {
    id: 1,
    name: "Round 1 — Basic Screening",
    description: "Multiple choice questions testing core data structures, algorithms, and complexity analysis.",
    difficulty: "Easy",
    type: "mcq",
    questionCount: 5,
    timeLimit: 300,
    questions: [
      {
        question: "What is the time complexity to access an array element by index?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answerIndex: 0
      },
      {
        question: "Which data structure operates on a First In First Out (FIFO) basis?",
        options: ["Stack", "Queue", "Binary Tree", "Heap"],
        answerIndex: 1
      },
      {
        question: "What is the average time complexity of searching in a Hash Map?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answerIndex: 0
      },
      {
        question: "Which search algorithm requires the dataset to be sorted?",
        options: ["Linear Search", "Binary Search", "Depth First Search", "Breadth First Search"],
        answerIndex: 1
      },
      {
        question: "What is the space complexity of an in-place sorting algorithm?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answerIndex: 0
      }
    ]
  },
  {
    id: 2,
    name: "Round 2 — Coding Round",
    description: "Implement a coding solution to a classic intermediate problem under pressure.",
    difficulty: "Medium",
    type: "coding",
    timeLimit: 1200,
    questionId: "two-sum-prob"
  },
  {
    id: 3,
    name: "Round 3 — Problem Solving",
    description: "Solve an advanced algorithm question with edge cases and optimal constraints.",
    difficulty: "Hard",
    type: "coding",
    timeLimit: 1800,
    questionId: "course-schedule-prob"
  },
  {
    id: 4,
    name: "Round 4 — Technical Interview",
    description: "Conceptual and theoretical Q&A evaluating deeper engineering trade-offs.",
    difficulty: "Medium",
    type: "mcq",
    questionCount: 5,
    timeLimit: 480,
    questions: [
      {
        question: "Which tree traversal represents a post-order traversal sequence?",
        options: ["Root -> Left -> Right", "Left -> Right -> Root", "Left -> Root -> Right", "Root -> Right -> Left"],
        answerIndex: 1
      },
      {
        question: "What is the primary drawback of using separate chaining for hash map collisions?",
        options: ["Requires O(N) lookup in worst case", "Fixed table size", "High memory overhead for pointers", "Requires re-hashing often"],
        answerIndex: 2
      },
      {
        question: "When is dynamic programming applicable instead of simple divide-and-conquer?",
        options: ["When subproblems are independent", "When subproblems overlap", "When space complexity is O(1)", "When recursion is not possible"],
        answerIndex: 1
      },
      {
        question: "What does the 'L' in LRU Cache stand for?",
        options: ["Last", "Length", "Least", "Linked"],
        answerIndex: 2
      },
      {
        question: "Which graph representation is optimal for sparse graphs?",
        options: ["Adjacency Matrix", "Adjacency List", "Edge List", "Incidence Matrix"],
        answerIndex: 1
      }
    ]
  },
  {
    id: 5,
    name: "Round 5 — Rapid Fire",
    description: "A series of quick-fire questions where speed and accuracy are tested together.",
    difficulty: "Hard",
    type: "rapid-fire",
    timeLimit: 60,
    questionCount: 10
  }
];

const rapidFireQuestions = [
  {
    question: "What is the worst case complexity of inserting into a BST without balancing?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    answerIndex: 2
  },
  {
    question: "Which data structure is used in Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Priority Queue", "Min-Heap"],
    answerIndex: 1
  },
  {
    question: "Which sorting algorithm is stable and has O(N log N) worst-case time complexity?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
    answerIndex: 1
  },
  {
    question: "What is the time complexity to retrieve the minimum element from a Min-Heap?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    answerIndex: 0
  },
  {
    question: "What is the auxiliary space complexity of bubble sort?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    answerIndex: 0
  },
  {
    question: "Which pattern uses two pointers moving towards each other?",
    options: ["Sliding Window", "Two Pointers", "Fast & Slow Pointers", "Merge Intervals"],
    answerIndex: 1
  },
  {
    question: "What is the height of a balanced binary tree with N nodes?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    answerIndex: 1
  },
  {
    question: "Can a stack be used to reverse a string?",
    options: ["Yes, naturally LIFO", "No, stacks are not for arrays", "Yes, but only in O(N^2) time", "No, it requires double queues"],
    answerIndex: 0
  },
  {
    question: "What is the time complexity of searching a word in a Trie of length L?",
    options: ["O(1)", "O(L)", "O(log N)", "O(N)"],
    answerIndex: 1
  },
  {
    question: "What is the number of edges in a tree with N vertices?",
    options: ["N", "N - 1", "N + 1", "2N"],
    answerIndex: 1
  }
];

// Export modules if running in Node, else attach to window for browser use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { dsaConcepts, dsaQuestions, quizQuestions, interviewRounds, rapidFireQuestions };
} else {
  window.dsaConcepts = dsaConcepts;
  window.dsaQuestions = dsaQuestions;
  window.quizQuestions = quizQuestions;
  window.interviewRounds = interviewRounds;
  window.rapidFireQuestions = rapidFireQuestions;
}
