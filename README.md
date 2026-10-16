# 🧭 OptiTour — Travelling Salesperson Route Visualizer

> **Untangling complexity. Finding the shortest path.**  
> An interactive, high-performance Artificial Intelligence GUI project demonstrating the **Travelling Salesperson Problem (TSP)** using **Hill Climbing with 2-Opt Local Search Heuristics**.

---

## 👨‍💻 Authors & Academic Credits

* **Nisarg Jayesh Delvadiya**
* **Rishan Mazumdar**

*Course / Track: Artificial Intelligence GUI Mini Project*

---

## 🌟 Key Features

* **Interactive City Placement**: Click anywhere on the map to place custom nodes or drag nodes dynamically to watch the tour adapt in real time.
* **Razor-Sharp Retina Graphics**: HTML5 Canvas pixel buffers dynamically scale to match `window.devicePixelRatio` (2x/3x), eliminating blurriness on Mac and High-DPI screens.
* **Deterministic 2-Opt Heuristic Engine**: Iteratively reverses crossed segments to untangle intersecting road networks and minimize Euclidean distance.
* **Step-by-Step Viva Mode**: Advance one local search step at a time via the `STEP` button to demonstrate path untangling to examiners and professors.
* **Dynamic Smart Floating Navbar**: Auto-hides on scroll-down to provide maximum canvas focus and slides back down smoothly when scrolling up.
* **Developer Terminal Aesthetic**: Modern dark theme (`#080b11`) powered by **JetBrains Mono** monospace typography, code-style prompts, and clean telemetry.
* **Security Hardened**: Protected with Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options (Clickjacking defense), and input sanitization boundaries.

---

## 🧠 Algorithm Overview: Hill Climbing (2-Opt)

The **Travelling Salesperson Problem (TSP)** is an NP-hard combinatorial problem with a search space of $\frac{(N-1)!}{2}$. Brute-force exhaustive search is mathematically intractable for $N > 15$.

### The 2-Opt Heuristic
1. **Initial State**: A random closed-loop tour permutation connecting all nodes: $[0, 1, 2, \dots, N-1, 0]$.
2. **Neighborhood Evaluation**: Select pairs of non-adjacent edges $(u_i, u_{i+1})$ and $(u_j, u_{j+1})$. In 2D Euclidean geometry, crossed segments violate the triangle inequality:
   $$\text{dist}(u_i, u_j) + \text{dist}(u_{i+1}, u_{j+1}) < \text{dist}(u_i, u_{i+1}) + \text{dist}(u_j, u_{j+1})$$
3. **Move Operator**: Invert the sub-segment between $i+1$ and $j$, reversing the order of intermediate nodes to eliminate the crossing.
4. **Steepest Ascent**: Sample neighboring 2-Opt inversions and select the move yielding the greatest distance reduction.
5. **Random-Restart**: If the search reaches a local optimum (no improving 2-Opt move found for consecutive probes), the engine restarts from a new permutation while safeguarding the all-time shortest route.

---

## 📂 Project Architecture

```
src/
├── algorithms/
│   ├── distance.js          # Euclidean metric & closed-loop circular path calculations
│   └── hillClimbing.js      # HillClimbingRunner class with 2-Opt move operators
│
├── components/
│   ├── Logo.jsx             # Dedicated SVG vector logo (geometric Hamiltonian cycle)
│   ├── Navbar.jsx           # Centered floating pill with smart hide-on-scroll
│   ├── MinimalStatsHUD.jsx  # Telemetry bar (Total Distance, % Shorter, Step count)
│   ├── MinimalControls.jsx  # Control dock (RUN, STEP, RESET, MAP PRESETS, SPEED, CONFIG)
│   ├── TSPVisualizerCanvas.jsx # High-DPI Retina canvas with vector paths and node pins
│   ├── SettingsModal.jsx    # Accessible modal for tuning 2-Opt sample size & strategy
│   └── Footer.jsx           # 3-Column developer footer with system specs & Back to Top
│
├── data/
│   └── presetCities.js      # Benchmarks: College Campus (12 nodes), Circle, Clusters
│
└── app/
    ├── page.js              # Application controller tying canvas loop & user inputs
    ├── layout.js            # Root layout with JetBrains Mono font & SEO metadata
    └── globals.css          # Tailwind CSS v4 design system
```

---

## 🔒 Security Hardening

This application implements production-grade security practices in `next.config.mjs` and runtime handlers:

* **Content-Security-Policy (CSP)**: Restricts script execution, styles, fonts, and network connections to trusted origin boundaries.
* **X-Frame-Options: DENY**: Blocks unauthorized iframe embedding to defend against Clickjacking.
* **X-Content-Type-Options: nosniff**: Prevents MIME-type sniffing vulnerabilities.
* **Strict-Transport-Security (HSTS)**: Forces encrypted HTTPS communication with preloading.
* **Input Boundary Sanitization**: Node creation coordinates are sanitized and clamped within canvas boundaries ($X \in [20, 940]$, $Y \in [20, 500]$) to protect against buffer overflow or resource exhaustion.
* **Server Fingerprint Removal**: `poweredByHeader: false` suppresses the `X-Powered-By: Next.js` header.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18.18.0 or higher
* **npm** v9.0.0 or higher

### Installation & Launch

1. **Clone or open the workspace**:
   ```bash
   cd /Users/nisargdelvadiya/.gemini/antigravity-ide/scratch/tsp-route-visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the visualizer**:
   Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ⚙️ Technologies Used

* **Next.js 16 (App Router)** — React-based web application framework
* **Tailwind CSS v4** — High-performance utility CSS design system
* **HTML5 Canvas API** — Hardware-accelerated 2D graphics with devicePixelRatio scaling
* **JetBrains Mono** — Developer monospace typography via `next/font/google`
* **Lucide React** — Minimalist vector iconography

---

## 📜 License & Credits

Developed by **Nisarg Jayesh Delvadiya** and **Rishan Mazumdar** as an Artificial Intelligence GUI Mini Project.  
Released under the MIT License.
