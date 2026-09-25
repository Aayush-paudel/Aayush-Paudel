/**
 * ============================================================
 *  SITE CONFIG — edit everything about the portfolio from here
 * ============================================================
 *  You should never need to touch index.html or the other JS
 *  files just to change your name, projects, links, etc.
 *  Every section reads from window.SITE_DATA at runtime.
 * ============================================================
 */

window.SITE_DATA = {

  // ---------------------------------------------------------
  // 1. PERSONAL_INFO
  // ---------------------------------------------------------
  PERSONAL_INFO: {
    name: "Aayush Paudel",                // <-- your full name
    initials: "AP",                       // <-- shown on the loading screen
    role: "Creative Developer & Technology Enthusiast",
    tagline:
      "Curious by default — I like exploring ideas, learning new things fast, and finding creative ways to bring them to the web.",
    location: "Khairahani, Chitwan, Nepal",
    email: "aayush123paudel123@gmail.com",
    resumeUrl: "assets/resume.pdf",       // <-- add your CV here once you have one
    avatar: "assets/avatar.jpg",          // <-- your photo
    bio: [
      "I'm Aayush, someone who's always curious and eager to learn new things. I enjoy exploring ideas, sharing knowledge, and finding creative ways to express myself — whether that's through writing, connecting with people, or diving into new experiences.",
      "I value growth, positivity and authenticity, and I try to bring those qualities into everything I do. My goal is to keep learning, stay inspired, and make meaningful connections along the way."
    ],
    education: "Studying — add your school/college and expected graduation year here",
    interests: "Learning new things, writing, connecting with people, exploring new ideas",
    goal: "Looking for a front-end internship."
  },

  STATS: [
    { label: "Years Learning", value: 6, suffix: "+" },
    { label: "Projects Completed", value: 42, suffix: "" },
    { label: "Technologies", value: 25, suffix: "+" },
    { label: "Hackathons", value: 11, suffix: "" }
  ],

  // ---------------------------------------------------------
  // 2. SKILLS
  // ---------------------------------------------------------
  SKILLS: {
    Programming: [
      { name: "JavaScript", icon: "fa-brands fa-js", level: 92 },
      { name: "Python", icon: "fa-brands fa-python", level: 88 },
      { name: "C / C++", icon: "fa-solid fa-microchip", level: 75 },
      { name: "HTML5", icon: "fa-brands fa-html5", level: 95 },
      { name: "CSS3", icon: "fa-brands fa-css3-alt", level: 90 },
      { name: "TypeScript", icon: "fa-solid fa-code", level: 70 }
    ],
    Development: [
      { name: "Web Development", icon: "fa-solid fa-globe", level: 92 },
      { name: "App Development", icon: "fa-solid fa-mobile-screen", level: 65 },
      { name: "UI / UX Design", icon: "fa-solid fa-pen-ruler", level: 80 },
      { name: "Backend & APIs", icon: "fa-solid fa-server", level: 78 },
      { name: "React / Next.js", icon: "fa-brands fa-react", level: 85 },
      { name: "Three.js / WebGL", icon: "fa-solid fa-cube", level: 82 }
    ],
    Technology: [
      { name: "Artificial Intelligence", icon: "fa-solid fa-brain", level: 74 },
      { name: "Machine Learning", icon: "fa-solid fa-diagram-project", level: 70 },
      { name: "Robotics", icon: "fa-solid fa-robot", level: 80 },
      { name: "IoT", icon: "fa-solid fa-satellite-dish", level: 68 },
      { name: "Git / GitHub", icon: "fa-brands fa-git-alt", level: 90 },
      { name: "Linux", icon: "fa-brands fa-linux", level: 72 }
    ]
  },

  // ---------------------------------------------------------
  // 3. PROJECTS
  // ---------------------------------------------------------
  PROJECTS: [
    {
      id: "orbit",
      name: "Orbit — 3D Data Explorer",
      category: "Web",
      short: "A WebGL tool for exploring high-dimensional datasets as navigable 3D constellations.",
      tech: ["Three.js", "React", "WebGL", "D3.js"],
      image: "assets/projects/orbit.svg",
      github: "https://github.com/Aayush-paudel/orbit",
      demo: "https://orbit-demo.example.com",
      featured: true,
      problem:
        "Traditional dashboards flatten multi-dimensional data into 2D charts, hiding relationships between variables.",
      solution:
        "Orbit maps each data point into 3D space using dimensionality reduction, letting users physically fly through their dataset and spot clusters visually.",
      features: [
        "Real-time dimensionality reduction (t-SNE / PCA) in the browser",
        "Custom GLSL point-cloud shaders for 100k+ points at 60fps",
        "Orbit / fly camera controls with keyboard support",
        "Exportable snapshots and shareable camera states"
      ]
    },
    {
      id: "pulse",
      name: "Pulse — Hackathon Health Wearable",
      category: "Robotics",
      short: "A wrist-worn device + companion app that detects early signs of fatigue during long study or work sessions.",
      tech: ["Arduino", "C++", "React Native", "BLE"],
      image: "assets/projects/pulse.svg",
      github: "https://github.com/Aayush-paudel/pulse",
      demo: "https://pulse-demo.example.com",
      featured: false,
      problem: "Students and engineers often push through fatigue without noticing until performance drops sharply.",
      solution:
        "Pulse combines a PPG heart-rate sensor with a lightweight on-device model to flag fatigue trends and nudge users to take a break.",
      features: [
        "Custom PCB with PPG sensor and BLE radio",
        "On-device signal processing in C++",
        "Companion app with weekly fatigue trends",
        "Won 'Best Hardware Hack' at CalHacks"
      ]
    },
    {
      id: "nimbus",
      name: "Nimbus — AI Writing Companion",
      category: "AI",
      short: "A distraction-free writing app with an inline AI assistant for tone, structure and clarity feedback.",
      tech: ["Next.js", "OpenAI API", "PostgreSQL", "Tailwind"],
      image: "assets/projects/nimbus.svg",
      github: "https://github.com/Aayush-paudel/nimbus",
      demo: "https://nimbus-demo.example.com",
      featured: false,
      problem: "Most AI writing tools interrupt the writing flow with pop-ups and full rewrites.",
      solution:
        "Nimbus surfaces lightweight, inline suggestions that writers can accept with a keystroke, keeping their own voice intact.",
      features: [
        "Inline diff-style suggestions, not full rewrites",
        "Streaming responses with minimal UI",
        "Local draft history with version diffing",
        "Keyboard-first interaction model"
      ]
    },
    {
      id: "swarm",
      name: "Swarm — Multi-Robot Pathfinding",
      category: "Robotics",
      short: "A simulator and physical demo of decentralized pathfinding for small robot swarms.",
      tech: ["Python", "ROS", "Raspberry Pi", "OpenCV"],
      image: "assets/projects/swarm.svg",
      github: "https://github.com/Aayush-paudel/swarm",
      demo: "https://swarm-demo.example.com",
      featured: false,
      problem: "Centralized robot coordination doesn't scale and creates a single point of failure.",
      solution: "Each robot in Swarm negotiates its own path locally using a lightweight decentralized protocol.",
      features: [
        "Decentralized negotiation protocol over Wi-Fi mesh",
        "Overhead-camera ground-truth tracking with OpenCV",
        "Simulated + physical demo with 6 units",
        "Presented at regional robotics symposium"
      ]
    },
    {
      id: "loop",
      name: "Loop — Habit Tracker PWA",
      category: "Apps",
      short: "An offline-first progressive web app for building habits, with a focus on calm, minimal design.",
      tech: ["Vue.js", "IndexedDB", "PWA"],
      image: "assets/projects/loop.svg",
      github: "https://github.com/Aayush-paudel/loop",
      demo: "https://loop-demo.example.com",
      featured: false,
      problem: "Habit apps often gamify streaks in ways that create anxiety rather than motivation.",
      solution: "Loop favors gentle, non-punishing visual feedback and works fully offline.",
      features: [
        "100% offline-first with background sync",
        "Installable PWA with push reminders",
        "No streak-shaming — missed days simply fade, not break",
        "Under 40kb JS bundle"
      ]
    },
    {
      id: "terrain",
      name: "Terrain — Generative Landscape Shader",
      category: "Other",
      short: "A GLSL shader study generating infinite procedural terrain with dynamic time-of-day lighting.",
      tech: ["GLSL", "Three.js", "Simplex Noise"],
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      github: "https://github.com/yourusername/terrain",
      demo: "https://terrain-demo.example.com",
      featured: false,
      problem: "Wanted to understand raymarching and procedural noise beyond tutorials.",
      solution: "Built a fully procedural terrain renderer from scratch using layered simplex noise and raymarched lighting.",
      features: [
        "Fully procedural, infinite terrain",
        "Dynamic day/night lighting cycle",
        "Runs entirely in a fragment shader",
        "Interactive camera with mouse/touch"
      ]
    }
  ],

  // ---------------------------------------------------------
  // 4. EXPERIENCE / TIMELINE
  // ---------------------------------------------------------
  EXPERIENCE: [
    { year: "2021", title: "Started learning to code", desc: "Built my first website — a single HTML page for a school project — and got hooked.", type: "milestone" },
    { year: "2022", title: "First hackathon", desc: "Attended my first hackathon and placed in the top 10 out of 60 teams.", type: "hackathon" },
    { year: "2023", title: "Began B.S. in Computer Science", desc: "Started my degree, focusing electives on graphics and HCI.", type: "education" },
    { year: "2024", title: "Robotics competition finalist", desc: "Led a 4-person team to the regional finals of a collegiate robotics competition.", type: "robotics" },
    { year: "2025", title: "Freelance creative developer", desc: "Started taking on freelance projects building interactive 3D sites for small studios.", type: "project" },
    { year: "2026", title: "Best Hardware Hack — CalHacks", desc: "Won 'Best Hardware Hack' with Pulse, a wearable fatigue-detection device.", type: "hackathon" }
  ],

  // ---------------------------------------------------------
  // 5. ACHIEVEMENTS
  // ---------------------------------------------------------
  ACHIEVEMENTS: [
    { title: "Best Hardware Hack", org: "CalHacks 2026", icon: "fa-solid fa-trophy" },
    { title: "Regional Robotics Finalist", org: "Collegiate Robotics League", icon: "fa-solid fa-robot" },
    { title: "Top 10 Finish", org: "TreeHacks 2024", icon: "fa-solid fa-medal" },
    { title: "AWS Certified Cloud Practitioner", org: "Amazon Web Services", icon: "fa-solid fa-certificate" },
    { title: "Dean's List", org: "University of California", icon: "fa-solid fa-graduation-cap" },
    { title: "Open Source Contributor", org: "Three.js community add-ons", icon: "fa-solid fa-code-branch" }
  ],

  // ---------------------------------------------------------
  // 6. SERVICES
  // ---------------------------------------------------------
  SERVICES: [
    { title: "Web Development", desc: "Fast, accessible, production-grade websites and web apps.", icon: "fa-solid fa-code" },
    { title: "3D Web Experiences", desc: "Interactive Three.js scenes, product configurators and WebGL visuals.", icon: "fa-solid fa-cube" },
    { title: "UI / UX Design", desc: "Interface design systems that hold up across a whole product.", icon: "fa-solid fa-pen-ruler" },
    { title: "AI / ML Prototypes", desc: "Applied ML prototypes, from data pipelines to usable interfaces.", icon: "fa-solid fa-brain" },
    { title: "Robotics & Automation", desc: "Embedded systems, sensors and physical-computing prototypes.", icon: "fa-solid fa-robot" },
    { title: "App Development", desc: "Cross-platform mobile apps with React Native.", icon: "fa-solid fa-mobile-screen" }
  ],

  // ---------------------------------------------------------
  // 7. GITHUB
  // ---------------------------------------------------------
  GITHUB: {
    username: "Aayush-paudel",    // <-- pulls your live public stats
    useLiveApi: true              // set false to hide the live-fetch attempt
  },

  // ---------------------------------------------------------
  // 8. SOCIAL_LINKS
  // ---------------------------------------------------------
  SOCIAL_LINKS: [
    { name: "GitHub", icon: "fa-brands fa-github", url: "https://github.com/Aayush-paudel" },
    { name: "Instagram", icon: "fa-brands fa-instagram", url: "https://www.instagram.com/iyusssshhhh/" },
    { name: "Facebook", icon: "fa-brands fa-facebook", url: "https://facebook.com/REPLACE_WITH_YOUR_FACEBOOK_LINK" }
    // Add LinkedIn/X here too if you'd like, same {name, icon, url} shape.
  ]
};
