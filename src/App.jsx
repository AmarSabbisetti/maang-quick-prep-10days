import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "./firebase";
import { ref, set, get } from "firebase/database";

const CATEGORIES = {
  "Arrays & Hashing": {
    day: "1-2",
    problems: [
      { name: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
      { name: "Valid Anagram", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
      { name: "Contains Duplicate", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
      { name: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
      { name: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
      { name: "Product of Array Except Self", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
      { name: "Encode and Decode Strings", difficulty: "Medium", url: "https://leetcode.com/problems/encode-and-decode-strings/" },
      { name: "Longest Consecutive Sequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
    ],
  },
  "Two Pointers": {
    day: "1-2",
    problems: [
      { name: "Valid Palindrome", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
      { name: "3Sum", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
      { name: "Container With Most Water", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
      { name: "Trapping Rain Water", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },
    ],
  },
  "Sliding Window": {
    day: "1-2",
    problems: [
      { name: "Best Time to Buy & Sell Stock", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { name: "Longest Substring Without Repeating", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { name: "Longest Repeating Character Replacement", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
      { name: "Minimum Window Substring", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
      { name: "Sliding Window Maximum", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },
    ],
  },
  "Stack": {
    day: "3-4",
    problems: [
      { name: "Valid Parentheses", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
      { name: "Min Stack", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
      { name: "Evaluate Reverse Polish Notation", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
      { name: "Daily Temperatures", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
      { name: "Car Fleet", difficulty: "Medium", url: "https://leetcode.com/problems/car-fleet/" },
      { name: "Largest Rectangle in Histogram", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    ],
  },
  "Linked List": {
    day: "3-4",
    problems: [
      { name: "Reverse Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
      { name: "Merge Two Sorted Lists", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { name: "Linked List Cycle", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
      { name: "Reorder List", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
      { name: "Remove Nth Node From End", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { name: "Copy List with Random Pointer", difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
      { name: "LRU Cache", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
      { name: "Merge K Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { name: "Reverse Nodes in K-Group", difficulty: "Hard", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    ],
  },
  "Trees": {
    day: "3-4",
    problems: [
      { name: "Invert Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { name: "Same Tree", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
      { name: "Subtree of Another Tree", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
      { name: "Lowest Common Ancestor of BST", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
      { name: "Binary Tree Level Order Traversal", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { name: "Validate BST", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { name: "Kth Smallest Element in BST", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { name: "Binary Tree from Preorder & Inorder", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
      { name: "Binary Tree Maximum Path Sum", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    ],
  },
  "Graphs": {
    day: "5",
    problems: [
      { name: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
      { name: "Clone Graph", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
      { name: "Pacific Atlantic Water Flow", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
      { name: "Course Schedule", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
      { name: "Course Schedule II", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
      { name: "Graph Valid Tree", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/" },
      { name: "Number of Connected Components", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
      { name: "Rotting Oranges", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
      { name: "Word Ladder", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
      { name: "Alien Dictionary", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/" },
    ],
  },
  "Dynamic Programming": {
    day: "6",
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
      { name: "House Robber", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/" },
      { name: "House Robber II", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/" },
      { name: "Longest Palindromic Substring", difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { name: "Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
      { name: "Word Break", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/" },
      { name: "Longest Increasing Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { name: "Unique Paths", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/" },
      { name: "Longest Common Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
      { name: "Edit Distance", difficulty: "Hard", url: "https://leetcode.com/problems/edit-distance/" },
      { name: "Burst Balloons", difficulty: "Hard", url: "https://leetcode.com/problems/burst-balloons/" },
    ],
  },
  "Binary Search": {
    day: "6",
    problems: [
      { name: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
      { name: "Search in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
      { name: "Koko Eating Bananas", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
      { name: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    ],
  },
  "Heap / Priority Queue": {
    day: "6",
    problems: [
      { name: "Kth Largest Element in Array", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { name: "Task Scheduler", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
      { name: "Design Twitter", difficulty: "Medium", url: "https://leetcode.com/problems/design-twitter/" },
      { name: "Find Median from Data Stream", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
    ],
  },
  "Tries": {
    day: "6",
    problems: [
      { name: "Implement Trie", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
      { name: "Design Add and Search Words", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
      { name: "Word Search II", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" },
    ],
  },
  "Backtracking": {
    day: "5",
    problems: [
      { name: "Subsets", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
      { name: "Combination Sum", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
      { name: "Permutations", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
      { name: "Word Search", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
      { name: "N-Queens", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/" },
    ],
  },
  "Intervals & Greedy": {
    day: "5",
    problems: [
      { name: "Merge Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
      { name: "Non-overlapping Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
      { name: "Insert Interval", difficulty: "Medium", url: "https://leetcode.com/problems/insert-interval/" },
      { name: "Meeting Rooms II", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
    ],
  },
};

const SYSTEM_DESIGN = [
  { name: "URL Shortener", day: "7", notes: "Hashing, DB design, read-heavy, caching" },
  { name: "Twitter/X Feed", day: "7", notes: "Fan-out, timeline generation, caching, pub/sub" },
  { name: "WhatsApp / Chat System", day: "7", notes: "WebSockets, message queue, presence, E2E encryption" },
  { name: "Notification Service", day: "7", notes: "Priority queue, rate limiting, multi-channel delivery" },
  { name: "YouTube / Netflix", day: "8", notes: "Video transcoding, CDN, adaptive bitrate, recommendations" },
  { name: "Uber / Ola", day: "8", notes: "Geospatial indexing, matching, real-time tracking, surge pricing" },
  { name: "Rate Limiter", day: "8", notes: "Token bucket, sliding window, distributed rate limiting" },
  { name: "Distributed Cache", day: "8", notes: "Consistent hashing, eviction policies, replication" },
];

const LLD_PROBLEMS = [
  { name: "Parking Lot", day: "9", notes: "Strategy pattern, vehicle types, floor management" },
  { name: "Elevator System", day: "9", notes: "State pattern, scheduling algorithms, observer" },
  { name: "Snake & Ladder", day: "9", notes: "Board abstraction, dice, game loop, player management" },
  { name: "BookMyShow", day: "10", notes: "Seat locking, concurrency, booking flow, observer" },
  { name: "Splitwise", day: "10", notes: "Graph-based debt simplification, expense types" },
  { name: "Library Management", day: "10", notes: "Singleton, factory, fine calculation, reservation" },
];

const STACK_REVISION = {
  "Python Core & OOP": {
    day: "1-3",
    icon: "🐍",
    topics: [
      { name: "Generators, iterators, yield vs return", tip: "Write a custom iterator class with __iter__ and __next__" },
      { name: "Decorators — functools.wraps, class decorators, stacking", tip: "Implement @retry, @cache, @timing from scratch" },
      { name: "Context managers — __enter__/__exit__, contextlib", tip: "Build a DB transaction context manager" },
      { name: "Metaclasses & descriptors", tip: "Know when __new__ vs __init__ is called" },
      { name: "GIL, threading vs multiprocessing vs asyncio", tip: "Explain when each is appropriate with real examples" },
      { name: "Dunder methods — __slots__, __hash__, __eq__, __repr__", tip: "Implement a custom immutable data class" },
      { name: "Abstract base classes (ABC) & Protocol", tip: "Design a payment gateway interface using ABC" },
      { name: "Dataclasses, NamedTuple, TypedDict", tip: "Know frozen=True, field(default_factory=...), post_init" },
      { name: "Type hints — generics, TypeVar, ParamSpec, overload", tip: "Annotate a real function with complex types" },
      { name: "Memory management — reference counting, gc module, weakref", tip: "Explain circular reference handling" },
    ],
  },
  "FastAPI Deep Dive": {
    day: "4-6",
    icon: "⚡",
    topics: [
      { name: "Dependency injection — Depends(), sub-dependencies, yield deps", tip: "Build auth + DB session as chained dependencies" },
      { name: "Pydantic v2 — model_validator, field_validator, computed fields", tip: "Write a request model with cross-field validation" },
      { name: "Middleware — CORS, custom middleware, order of execution", tip: "Implement request logging + timing middleware" },
      { name: "Background tasks vs Celery vs ARQ", tip: "When to use each — latency vs reliability tradeoffs" },
      { name: "WebSocket endpoints & connection manager", tip: "Build a simple chat broadcast endpoint" },
      { name: "APIRouter, tags, versioning strategies (v1/v2)", tip: "Structure a production app with router prefixes" },
      { name: "Exception handling — HTTPException, custom handlers", tip: "Global error handler with structured error responses" },
      { name: "Request lifecycle — startup/shutdown events, lifespan", tip: "DB pool init on startup, cleanup on shutdown" },
      { name: "Testing — TestClient, pytest fixtures, dependency overrides", tip: "Mock DB and auth deps in tests" },
      { name: "OpenAPI customization, response_model, status codes", tip: "Document complex endpoints with examples" },
    ],
  },
  "Django Essentials": {
    day: "4-6",
    icon: "🎸",
    topics: [
      { name: "ORM — querysets, Q objects, F expressions, annotations", tip: "Write a complex aggregation query without raw SQL" },
      { name: "Model design — abstract models, proxy models, multi-table inheritance", tip: "Know tradeoffs of each pattern" },
      { name: "Signals — pre_save, post_save, m2m_changed", tip: "When to use signals vs overriding save()" },
      { name: "Middleware pipeline — process_request/response/exception", tip: "Build rate limiting middleware" },
      { name: "Django REST Framework — serializers, viewsets, permissions", tip: "Custom permission class + nested serializer" },
      { name: "Caching — per-view, template fragment, low-level cache API", tip: "Cache invalidation strategies" },
      { name: "Migrations — RunPython, data migrations, squashing", tip: "Write a safe zero-downtime migration" },
      { name: "Celery integration — tasks, beat, result backends", tip: "Retry logic, task chaining, error handling" },
    ],
  },
  "SQLAlchemy & Databases": {
    day: "7-8",
    icon: "🗄",
    topics: [
      { name: "Session lifecycle — scoped_session, sessionmaker, commit/flush/expire", tip: "Explain flush vs commit and when each fires" },
      { name: "Relationship patterns — lazy loading, eager loading, joined/subquery", tip: "N+1 problem: joinedload vs selectinload" },
      { name: "Core vs ORM — when to use each, hybrid properties", tip: "Write a bulk upsert with ON CONFLICT" },
      { name: "Alembic migrations — autogenerate, custom ops, branching", tip: "Handle column rename without data loss" },
      { name: "Connection pooling — pool_size, max_overflow, pool_pre_ping", tip: "Configure for production with connection recycling" },
      { name: "Query optimization — EXPLAIN ANALYZE, indexes, composite indexes", tip: "Read a Postgres query plan and fix slow queries" },
      { name: "Transactions — isolation levels, savepoints, nested transactions", tip: "Implement retry logic for serialization failures" },
      { name: "Async SQLAlchemy — AsyncSession, create_async_engine", tip: "Integrate with FastAPI async endpoints" },
    ],
  },
  "Docker & Kubernetes": {
    day: "7-8",
    icon: "🐳",
    topics: [
      { name: "Dockerfile best practices — multi-stage builds, layer caching", tip: "Reduce image size from 1GB to <200MB" },
      { name: "Docker Compose — services, volumes, networks, healthchecks", tip: "App + Postgres + Redis + Celery compose file" },
      { name: "K8s core — Pods, Deployments, Services, ConfigMaps, Secrets", tip: "Write a deployment YAML from scratch" },
      { name: "K8s networking — ClusterIP, NodePort, LoadBalancer, Ingress", tip: "Explain how a request reaches your pod" },
      { name: "Liveness & readiness probes, resource limits", tip: "Configure probes for a FastAPI app" },
      { name: "HPA — Horizontal Pod Autoscaler, metrics-based scaling", tip: "Scale on CPU + custom metrics (request latency)" },
      { name: "Helm charts basics — values.yaml, templates, releases", tip: "Parameterize a deployment for dev/staging/prod" },
    ],
  },
  "AWS & Cloud Services": {
    day: "9-10",
    icon: "☁",
    topics: [
      { name: "Lambda — cold starts, layers, event sources, concurrency", tip: "Optimize cold start for Python Lambda" },
      { name: "API Gateway — REST vs HTTP API, authorizers, throttling", tip: "Lambda + API Gateway + DynamoDB pattern" },
      { name: "SQS vs SNS vs EventBridge — when to use each", tip: "Design an event-driven order processing pipeline" },
      { name: "S3 — presigned URLs, lifecycle policies, event notifications", tip: "Implement secure file upload flow" },
      { name: "RDS vs DynamoDB — modeling, capacity modes, backups", tip: "Single-table design pattern in DynamoDB" },
      { name: "Glue — ETL jobs, crawlers, Spark context, bookmarks", tip: "Write a Glue job for CSV → Parquet transformation" },
      { name: "CloudWatch — metrics, alarms, log insights queries", tip: "Set up alerting for Lambda errors + latency" },
      { name: "IAM — policies, roles, least privilege, cross-account access", tip: "Explain assume-role flow for Lambda → S3" },
    ],
  },
  "API Design & Patterns": {
    day: "9-10",
    icon: "🔌",
    topics: [
      { name: "REST best practices — resource naming, status codes, HATEOAS", tip: "Design endpoints for an e-commerce API" },
      { name: "Authentication — JWT flow, refresh tokens, OAuth2 scopes", tip: "Implement JWT auth in FastAPI with refresh rotation" },
      { name: "Rate limiting — token bucket, sliding window, distributed", tip: "Redis-based rate limiter implementation" },
      { name: "Pagination — cursor vs offset, keyset pagination", tip: "Why cursor pagination is better at scale" },
      { name: "Idempotency — idempotency keys, safe retries", tip: "Implement for payment endpoints" },
      { name: "API versioning — URL, header, content negotiation", tip: "Tradeoffs of each approach" },
      { name: "Async patterns — webhooks, polling, SSE, long-polling", tip: "When to use each for real-time updates" },
      { name: "Error handling — RFC 7807 Problem Details, error codes", tip: "Standardize error responses across services" },
    ],
  },
};

const MOCK_QUESTIONS = {
  dsa: [
    "Solve: LRU Cache — implement get() and put() in O(1)",
    "Solve: Merge K Sorted Lists using a min-heap",
    "Solve: Word Break using DP — can the string be segmented?",
    "Solve: Trapping Rain Water — two pointer approach",
    "Solve: Course Schedule II — return topological order",
    "Solve: Longest Increasing Subsequence in O(n log n)",
    "Solve: Binary Tree Maximum Path Sum",
    "Solve: Median of Two Sorted Arrays in O(log(m+n))",
    "Solve: Alien Dictionary — derive character order from sorted words",
    "Solve: Design a MinStack with O(1) getMin",
  ],
  system_design: [
    "Design a URL shortener like bit.ly",
    "Design Twitter's home timeline feed",
    "Design a real-time chat system like WhatsApp",
    "Design a video streaming platform like YouTube",
    "Design a ride-sharing service like Uber",
    "Design a distributed rate limiter",
    "Design a notification service for millions of users",
    "Design a distributed cache like Redis cluster",
  ],
  lld: [
    "Design a Parking Lot system — classes, relationships, core methods",
    "Design an Elevator System for a 40-floor building",
    "Design Splitwise — expense splitting and debt simplification",
    "Design a Library Management System",
    "Design an Online BookMyShow ticket booking system",
    "Design Snake & Ladder game with OOP principles",
  ],
};

const diffColor = (d) =>
  d === "Easy" ? "#22c55e" : d === "Medium" ? "#f59e0b" : "#ef4444";

function App() {
  const [tab, setTab] = useState("dsa");
  const [statuses, setStatuses] = useState({});
  const [sdStatuses, setSdStatuses] = useState({});
  const [lldStatuses, setLldStatuses] = useState({});
  const [stackStatuses, setStackStatuses] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [expandedStack, setExpandedStack] = useState({});
  const [mockMode, setMockMode] = useState(false);
  const [mockType, setMockType] = useState(null);
  const [mockQ, setMockQ] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mockDuration, setMockDuration] = useState(45);
  const [expandedCats, setExpandedCats] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    if (timer === 0 && timerRunning) setTimerRunning(false);
  }, [timerRunning, timer]);

  // Load all statuses from Firebase once on mount
  useEffect(() => {
    get(ref(db, "progress")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.statuses) setStatuses(data.statuses);
        if (data.sdStatuses) setSdStatuses(data.sdStatuses);
        if (data.lldStatuses) setLldStatuses(data.lldStatuses);
        if (data.stackStatuses) setStackStatuses(data.stackStatuses);
      }
      setLoaded(true);
    });
  }, []);

  // Save to Firebase on change (only after initial load)
  useEffect(() => { if (loaded) set(ref(db, "progress/statuses"), statuses); }, [statuses, loaded]);
  useEffect(() => { if (loaded) set(ref(db, "progress/sdStatuses"), sdStatuses); }, [sdStatuses, loaded]);
  useEffect(() => { if (loaded) set(ref(db, "progress/lldStatuses"), lldStatuses); }, [lldStatuses, loaded]);
  useEffect(() => { if (loaded) set(ref(db, "progress/stackStatuses"), stackStatuses); }, [stackStatuses, loaded]);

  const toggleStatus = (key) => {
    setStatuses((prev) => {
      const cur = prev[key] || "none";
      const next =
        cur === "none" ? "solved" : cur === "solved" ? "revisit" : "none";
      return { ...prev, [key]: next };
    });
  };

  const toggleSD = (key) => {
    setSdStatuses((prev) => ({
      ...prev,
      [key]: prev[key] === "done" ? "none" : "done",
    }));
  };

  const toggleLLD = (key) => {
    setLldStatuses((prev) => ({
      ...prev,
      [key]: prev[key] === "done" ? "none" : "done",
    }));
  };

  const toggleStack = (key) => {
    setStackStatuses((prev) => ({
      ...prev,
      [key]: prev[key] === "done" ? "none" : "done",
    }));
  };

  const toggleStackCat = (cat) => setExpandedStack((p) => ({ ...p, [cat]: !p[cat] }));

  const startMock = (type) => {
    const qs = MOCK_QUESTIONS[type];
    setMockType(type);
    setMockQ(qs[Math.floor(Math.random() * qs.length)]);
    setTimer(mockDuration * 60);
    setTimerRunning(true);
    setMockMode(true);
  };

  const endMock = () => {
    setMockMode(false);
    setTimerRunning(false);
    clearInterval(timerRef.current);
  };

  const totalProblems = Object.values(CATEGORIES).reduce(
    (a, c) => a + c.problems.length,
    0
  );
  const solvedCount = Object.values(statuses).filter(
    (s) => s === "solved"
  ).length;
  const revisitCount = Object.values(statuses).filter(
    (s) => s === "revisit"
  ).length;
  const sdDone = Object.values(sdStatuses).filter((s) => s === "done").length;
  const lldDone = Object.values(lldStatuses).filter((s) => s === "done").length;
  const totalStackTopics = Object.values(STACK_REVISION).reduce((a, c) => a + c.topics.length, 0);
  const stackDone = Object.values(stackStatuses).filter((s) => s === "done").length;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timerPercent = mockDuration * 60 > 0 ? (timer / (mockDuration * 60)) * 100 : 0;
  const timerColor = timerPercent > 50 ? "#22c55e" : timerPercent > 20 ? "#f59e0b" : "#ef4444";

  const toggleCat = (cat) => setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  const catSolved = (cat) => {
    const probs = CATEGORIES[cat].problems;
    return probs.filter((p) => statuses[p.name] === "solved").length;
  };

  if (mockMode) {
    return (
      <div style={styles.container}>
        <div style={styles.mockContainer}>
          <div style={styles.mockHeader}>
            <span style={styles.mockLabel}>
              {mockType === "dsa" ? "DSA" : mockType === "system_design" ? "System Design" : "LLD"} Mock
            </span>
            <button onClick={endMock} style={styles.endBtn}>
              End Mock
            </button>
          </div>

          <div style={styles.timerBlock}>
            <div style={styles.timerTrack}>
              <div
                style={{
                  ...styles.timerFill,
                  width: `${timerPercent}%`,
                  background: timerColor,
                }}
              />
            </div>
            <span style={{ ...styles.timerText, color: timerColor }}>
              {fmt(timer)}
            </span>
          </div>

          <div style={styles.questionCard}>
            <div style={styles.questionIcon}>?</div>
            <p style={styles.questionText}>{mockQ}</p>
          </div>

          <div style={styles.mockTips}>
            <p style={styles.tipTitle}>Interview Checklist</p>
            {mockType === "dsa" && (
              <div style={styles.tipList}>
                <p>1. Clarify constraints & edge cases (2 min)</p>
                <p>2. Discuss brute force approach</p>
                <p>3. Optimize — state pattern & time/space complexity</p>
                <p>4. Code the solution cleanly</p>
                <p>5. Dry run with an example</p>
                <p>6. Discuss follow-ups</p>
              </div>
            )}
            {mockType === "system_design" && (
              <div style={styles.tipList}>
                <p>1. Clarify requirements — functional & non-functional (5 min)</p>
                <p>2. API design (5 min)</p>
                <p>3. Data model & DB choice (5 min)</p>
                <p>4. High-level architecture diagram (10 min)</p>
                <p>5. Deep dive on bottlenecks (10 min)</p>
                <p>6. Scaling & trade-offs (10 min)</p>
              </div>
            )}
            {mockType === "lld" && (
              <div style={styles.tipList}>
                <p>1. Clarify requirements & use cases (5 min)</p>
                <p>2. Identify entities & relationships (5 min)</p>
                <p>3. Define class hierarchy & interfaces (10 min)</p>
                <p>4. Apply design patterns (5 min)</p>
                <p>5. Write core logic in Python (15 min)</p>
                <p>6. Walk through a scenario (5 min)</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const qs = MOCK_QUESTIONS[mockType];
              setMockQ(qs[Math.floor(Math.random() * qs.length)]);
              setTimer(mockDuration * 60);
              setTimerRunning(true);
            }}
            style={styles.nextBtn}
          >
            Next Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>MAANG Prep</h1>
        <p style={styles.subtitle}>10-Day Sprint Tracker</p>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statBox}>
          <span style={styles.statNum}>{solvedCount}</span>
          <span style={styles.statLabel}>DSA</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: "#818cf8" }}>{sdDone}/8</span>
          <span style={styles.statLabel}>HLD</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: "#f472b6" }}>{lldDone}/6</span>
          <span style={styles.statLabel}>LLD</span>
        </div>
        <div style={styles.statBox}>
          <span style={{ ...styles.statNum, color: "#34d399" }}>{stackDone}/{totalStackTopics}</span>
          <span style={styles.statLabel}>Stack</span>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progressOuter}>
        <div
          style={{
            ...styles.progressInner,
            width: `${(solvedCount / totalProblems) * 100}%`,
          }}
        />
      </div>
      <p style={styles.progressText}>
        {solvedCount}/{totalProblems} DSA problems
      </p>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          ["dsa", "DSA"],
          ["hld", "HLD"],
          ["lld", "LLD"],
          ["stack", "Stack"],
          ["mock", "Mock"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              ...styles.tab,
              ...(tab === key ? styles.tabActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* DSA Tab */}
      {tab === "dsa" && (
        <div style={styles.content}>
          {Object.entries(CATEGORIES).map(([cat, { day, problems }]) => {
            const expanded = expandedCats[cat] !== false;
            const solved = catSolved(cat);
            return (
              <div key={cat} style={styles.category}>
                <button onClick={() => toggleCat(cat)} style={styles.catHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <span style={styles.catArrow}>{expanded ? "▾" : "▸"}</span>
                    <span style={styles.catName}>{cat}</span>
                    <span style={styles.dayBadge}>Day {day}</span>
                  </div>
                  <span style={styles.catCount}>
                    {solved}/{problems.length}
                  </span>
                </button>
                {expanded &&
                  problems.map((p) => {
                    const st = statuses[p.name] || "none";
                    return (
                      <div key={p.name} style={styles.problemRow}>
                        <button
                          onClick={() => toggleStatus(p.name)}
                          style={{
                            ...styles.statusBtn,
                            background:
                              st === "solved"
                                ? "#22c55e"
                                : st === "revisit"
                                ? "#f59e0b"
                                : "transparent",
                            border:
                              st === "none"
                                ? "2px solid rgba(255,255,255,0.15)"
                                : "2px solid transparent",
                          }}
                        >
                          {st === "solved" ? "✓" : st === "revisit" ? "↻" : ""}
                        </button>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.problemName}
                        >
                          {p.name}
                        </a>
                        <span
                          style={{
                            ...styles.diffBadge,
                            color: diffColor(p.difficulty),
                            borderColor: diffColor(p.difficulty) + "44",
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}

      {/* System Design Tab */}
      {tab === "hld" && (
        <div style={styles.content}>
          {SYSTEM_DESIGN.map((sd) => (
            <div key={sd.name} style={styles.sdRow}>
              <button
                onClick={() => toggleSD(sd.name)}
                style={{
                  ...styles.statusBtn,
                  background: sdStatuses[sd.name] === "done" ? "#818cf8" : "transparent",
                  border:
                    sdStatuses[sd.name] === "done"
                      ? "2px solid transparent"
                      : "2px solid rgba(255,255,255,0.15)",
                }}
              >
                {sdStatuses[sd.name] === "done" ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={styles.sdName}>
                  {sd.name}
                  <span style={styles.dayBadge}>Day {sd.day}</span>
                </div>
                <p style={styles.sdNotes}>{sd.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LLD Tab */}
      {tab === "lld" && (
        <div style={styles.content}>
          {LLD_PROBLEMS.map((lld) => (
            <div key={lld.name} style={styles.sdRow}>
              <button
                onClick={() => toggleLLD(lld.name)}
                style={{
                  ...styles.statusBtn,
                  background: lldStatuses[lld.name] === "done" ? "#f472b6" : "transparent",
                  border:
                    lldStatuses[lld.name] === "done"
                      ? "2px solid transparent"
                      : "2px solid rgba(255,255,255,0.15)",
                }}
              >
                {lldStatuses[lld.name] === "done" ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={styles.sdName}>
                  {lld.name}
                  <span style={styles.dayBadge}>Day {lld.day}</span>
                </div>
                <p style={styles.sdNotes}>{lld.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stack Revision Tab */}
      {tab === "stack" && (
        <div style={styles.content}>
          <div style={{ background: "#18181b", borderRadius: 10, padding: "12px 14px", marginBottom: 4, border: "1px solid #27272a" }}>
            <p style={{ fontSize: 12, color: "#71717a", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "#34d399", fontWeight: 700 }}>1 hr/day</span> — Resume stack revision. Tap topics to mark done. Expand for interview tips.
            </p>
          </div>
          {Object.entries(STACK_REVISION).map(([cat, { day, icon, topics }]) => {
            const expanded = expandedStack[cat] !== false;
            const done = topics.filter((t) => stackStatuses[t.name] === "done").length;
            return (
              <div key={cat} style={styles.category}>
                <button onClick={() => toggleStackCat(cat)} style={styles.catHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={styles.catName}>{cat}</span>
                    <span style={styles.dayBadge}>Day {day}</span>
                  </div>
                  <span style={styles.catCount}>{done}/{topics.length}</span>
                </button>
                {expanded && topics.map((t) => {
                  const st = stackStatuses[t.name] || "none";
                  return (
                    <div key={t.name} style={{ ...styles.problemRow, flexDirection: "column", alignItems: "stretch", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                          onClick={() => toggleStack(t.name)}
                          style={{
                            ...styles.statusBtn,
                            background: st === "done" ? "#34d399" : "transparent",
                            border: st === "done" ? "2px solid transparent" : "2px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          {st === "done" ? "✓" : ""}
                        </button>
                        <span style={{ flex: 1, fontSize: 12, color: st === "done" ? "#52525b" : "#a1a1aa", textDecoration: st === "done" ? "line-through" : "none" }}>
                          {t.name}
                        </span>
                      </div>
                      <div style={{ marginLeft: 36, padding: "4px 10px", background: "#0c0c0f", borderRadius: 6, borderLeft: "2px solid #34d39944" }}>
                        <p style={{ fontSize: 11, color: "#52525b", margin: 0, lineHeight: 1.5 }}>
                          <span style={{ color: "#34d399", fontWeight: 600 }}>Tip:</span> {t.tip}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Mock Tab */}
      {tab === "mock" && (
        <div style={styles.content}>
          <p style={styles.mockIntro}>
            Start a timed mock interview. Pick a category and a timer duration, then solve against the clock.
          </p>

          <div style={styles.durationPicker}>
            <span style={styles.durationLabel}>Timer:</span>
            {[30, 45, 60].map((d) => (
              <button
                key={d}
                onClick={() => setMockDuration(d)}
                style={{
                  ...styles.durBtn,
                  ...(mockDuration === d ? styles.durBtnActive : {}),
                }}
              >
                {d}m
              </button>
            ))}
          </div>

          <div style={styles.mockGrid}>
            <button onClick={() => startMock("dsa")} style={styles.mockCard}>
              <span style={styles.mockCardIcon}>⚡</span>
              <span style={styles.mockCardTitle}>DSA</span>
              <span style={styles.mockCardDesc}>Coding problem</span>
            </button>
            <button onClick={() => startMock("system_design")} style={styles.mockCard}>
              <span style={styles.mockCardIcon}>🏗</span>
              <span style={styles.mockCardTitle}>System Design</span>
              <span style={styles.mockCardDesc}>Architecture round</span>
            </button>
            <button onClick={() => startMock("lld")} style={styles.mockCard}>
              <span style={styles.mockCardIcon}>🧩</span>
              <span style={styles.mockCardTitle}>LLD</span>
              <span style={styles.mockCardDesc}>OOP design round</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    background: "#0c0c0f",
    color: "#e4e4e7",
    minHeight: "100vh",
    padding: "20px 16px",
    maxWidth: 640,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    background: "linear-gradient(135deg, #818cf8, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 13,
    color: "#71717a",
    margin: "4px 0 0",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  statsBar: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    background: "#18181b",
    borderRadius: 10,
    padding: "12px 8px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: 700,
    color: "#22c55e",
  },
  statLabel: {
    fontSize: 10,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  progressOuter: {
    height: 6,
    background: "#27272a",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressInner: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #818cf8)",
    borderRadius: 3,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 11,
    color: "#52525b",
    textAlign: "right",
    margin: "0 0 16px",
  },
  tabs: {
    display: "flex",
    gap: 4,
    background: "#18181b",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: "10px 4px",
    border: "none",
    background: "transparent",
    color: "#71717a",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#27272a",
    color: "#e4e4e7",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  category: {
    background: "#18181b",
    borderRadius: 10,
    overflow: "hidden",
  },
  catHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "14px 14px",
    border: "none",
    background: "transparent",
    color: "#e4e4e7",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    textAlign: "left",
  },
  catArrow: {
    fontSize: 12,
    color: "#52525b",
    width: 16,
  },
  catName: {
    fontWeight: 600,
    fontSize: 13,
  },
  dayBadge: {
    fontSize: 10,
    color: "#818cf8",
    background: "#818cf820",
    padding: "2px 8px",
    borderRadius: 20,
    marginLeft: 8,
    fontWeight: 500,
  },
  catCount: {
    fontSize: 12,
    color: "#52525b",
    fontWeight: 600,
  },
  problemRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px 8px 24px",
    borderTop: "1px solid #27272a",
  },
  statusBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  problemName: {
    flex: 1,
    fontSize: 12,
    color: "#a1a1aa",
    textDecoration: "none",
  },
  diffBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4,
    border: "1px solid",
  },
  sdRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "#18181b",
    borderRadius: 10,
    padding: 14,
  },
  sdName: {
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  sdNotes: {
    fontSize: 11,
    color: "#71717a",
    margin: "4px 0 0",
    lineHeight: 1.5,
  },
  mockIntro: {
    fontSize: 13,
    color: "#71717a",
    margin: "0 0 20px",
    lineHeight: 1.6,
  },
  durationPicker: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  durationLabel: {
    fontSize: 12,
    color: "#71717a",
    marginRight: 4,
  },
  durBtn: {
    padding: "8px 16px",
    border: "1px solid #27272a",
    background: "#18181b",
    color: "#71717a",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
  },
  durBtnActive: {
    background: "#818cf820",
    color: "#818cf8",
    borderColor: "#818cf844",
  },
  mockGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  mockCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 16px",
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all 0.2s",
    color: "#e4e4e7",
  },
  mockCardIcon: {
    fontSize: 28,
  },
  mockCardTitle: {
    fontSize: 15,
    fontWeight: 700,
  },
  mockCardDesc: {
    fontSize: 11,
    color: "#71717a",
    marginLeft: "auto",
  },
  // Mock mode styles
  mockContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  mockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mockLabel: {
    fontSize: 18,
    fontWeight: 700,
    background: "linear-gradient(135deg, #818cf8, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  endBtn: {
    padding: "8px 16px",
    background: "#ef444420",
    color: "#ef4444",
    border: "1px solid #ef444444",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
  },
  timerBlock: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  timerTrack: {
    flex: 1,
    height: 8,
    background: "#27272a",
    borderRadius: 4,
    overflow: "hidden",
  },
  timerFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 1s linear, background 0.3s",
  },
  timerText: {
    fontSize: 24,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    minWidth: 70,
    textAlign: "right",
  },
  questionCard: {
    background: "#18181b",
    borderRadius: 14,
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    border: "1px solid #27272a",
  },
  questionIcon: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #818cf8, #f472b6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 800,
    color: "#0c0c0f",
  },
  questionText: {
    fontSize: 15,
    fontWeight: 500,
    textAlign: "center",
    lineHeight: 1.6,
    margin: 0,
    color: "#e4e4e7",
  },
  mockTips: {
    background: "#18181b",
    borderRadius: 10,
    padding: 16,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#818cf8",
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: "0 0 10px",
  },
  tipList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 12,
    color: "#a1a1aa",
    lineHeight: 1.5,
  },
  nextBtn: {
    padding: "14px",
    background: "linear-gradient(135deg, #818cf8, #f472b6)",
    color: "#0c0c0f",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
};

export default App;
