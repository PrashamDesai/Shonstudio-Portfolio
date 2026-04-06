export const uiUxCoursePlan = {
  overview: {
    courseTitle: "UI/UX Design Bootcamp for Beginners",
    duration: "2 weeks (14 days)",
    targetAudience:
      "Absolute beginners with no prior design background who want practical UI/UX skills and a portfolio-ready project.",
    learningOutcomes: [
      "Understand the difference between UI (how it looks) and UX (how it works).",
      "Use Figma to build wireframes, high-fidelity screens, and clickable prototypes.",
      "Apply user research basics, user flows, and information architecture.",
      "Create a beginner-friendly design system with color, type, spacing, and reusable components.",
      "Run a basic usability test and improve designs using real feedback.",
      "Publish a portfolio-ready case study with clear process and outcomes.",
    ],
  },
  weeklyBreakdown: [
    {
      title: "Week 1: UX Foundations + Basics",
      summary:
        "Week 1 focuses on thinking before visuals. Learners understand users, structure problems, and turn ideas into low-fidelity flows and wireframes. The week ends with a mini project to connect research and structure.",
      keySkills: [
        "UX process and product thinking",
        "User research basics and personas",
        "User flows and information architecture",
        "Low-fidelity wireframing in Figma",
        "Design critique and iteration basics",
      ],
    },
    {
      title: "Week 2: UI Design + Final Project",
      summary:
        "Week 2 translates structure into polished visuals. Learners build a simple design system, create high-fidelity screens, prototype interactions, test usability, and deliver a complete final project with a case study.",
      keySkills: [
        "Visual hierarchy and layout decisions",
        "Color, typography, and spacing systems",
        "Components, variants, and reusable patterns",
        "Interactive prototyping and test-ready flows",
        "Portfolio storytelling and recruiter-ready presentation",
      ],
    },
  ],
  dailyPlan: [
    {
      day: 1,
      title: "UI vs UX and Product Mindset",
      concepts: [
        "UI vs UX: UI is the visual layer, UX is the full user journey.",
        "Design process stages: discover, define, design, test, improve.",
        "Good UX traits: clear, simple, and goal-focused experiences.",
        "Design thinking basics: understand the problem before drawing screens.",
      ],
      whyItMatters:
        "Strong design starts with problem clarity, not colors. This mindset helps beginners avoid random design decisions.",
      task:
        "Pick one everyday app and write a quick UX review: what works, what confuses users, and one improvement idea.",
      deliverable: "One-page UX observation notes with 3 clear improvement points.",
      tools: ["Figma (notes page)", "Notion or Google Docs"],
    },
    {
      day: 2,
      title: "User Research Basics",
      concepts: [
        "Research goals: learn user behavior, pain points, and motivations.",
        "Interview basics: ask open-ended questions, avoid leading prompts.",
        "Data grouping: cluster feedback into repeated themes.",
        "Insight writing: convert raw comments into actionable findings.",
      ],
      whyItMatters:
        "Without research, design becomes guesswork. Even simple research improves product decisions quickly.",
      task:
        "Interview 2 to 3 people about booking appointments online and document top frustrations.",
      deliverable: "A short research summary with 5 insights and 3 user pain points.",
      tools: ["Google Forms or direct interview notes", "Figma FigJam or sticky notes"],
    },
    {
      day: 3,
      title: "Personas and Problem Statements",
      concepts: [
        "Persona basics: goals, behaviors, frustrations, and context.",
        "Primary vs secondary users and why scope matters.",
        "Problem statements in simple format: user + need + obstacle.",
        "Success criteria: what outcome confirms the design works.",
      ],
      whyItMatters:
        "Designing for a specific user removes ambiguity and keeps feature decisions focused.",
      task:
        "Create one primary persona and write one focused problem statement for your course project.",
      deliverable: "Persona card + problem statement + measurable success criteria.",
      tools: ["Figma", "Miro (optional)"],
    },
    {
      day: 4,
      title: "User Flows and Information Architecture",
      concepts: [
        "User flow mapping: step-by-step journey from start to goal.",
        "Information architecture: organizing content so users can find things fast.",
        "Happy path vs edge cases: ideal flow and failure scenarios.",
        "Navigation patterns for small apps: bottom nav, tabs, and clear labels.",
      ],
      whyItMatters:
        "A clean structure prevents confusion and reduces unnecessary clicks.",
      task:
        "Map the full user flow for a mobile app that helps users book a doctor appointment.",
      deliverable: "Flow diagram with happy path, error path, and confirmation state.",
      tools: ["Figma", "FigJam"],
    },
    {
      day: 5,
      title: "Wireframing Fundamentals",
      concepts: [
        "Low-fidelity wireframes: focus on structure, not visuals.",
        "Layout blocks: headers, content zones, primary actions.",
        "Content priority: what users must see first.",
        "Common screen states: empty, loading, success, and error.",
      ],
      whyItMatters:
        "Wireframes let you test ideas quickly and cheaply before visual polish.",
      task:
        "Create wireframes for 4 core screens: onboarding, home, details, and booking confirmation.",
      deliverable: "A linked wireframe set with annotated layout decisions.",
      tools: ["Figma"],
    },
    {
      day: 6,
      title: "Figma Workflow Essentials",
      concepts: [
        "Frames, grids, and constraints for responsive behavior.",
        "Auto layout for consistent spacing and alignment.",
        "Reusable styles and naming conventions.",
        "Team-friendly file structure for easier iteration.",
      ],
      whyItMatters:
        "Good Figma workflow reduces rework and makes handoff smoother.",
      task:
        "Rebuild yesterday's wireframes using auto layout and clean layer naming.",
      deliverable: "Organized Figma file with reusable structure and clean naming.",
      tools: ["Figma"],
    },
    {
      day: 7,
      title: "Week 1 Mini Project and Critique",
      concepts: [
        "Mini project framing: define user, goal, and key screens.",
        "Critique method: what works, what is unclear, what to improve.",
        "Iteration loop: update based on feedback quickly.",
        "Basic design rationale writing.",
      ],
      whyItMatters:
        "Practice + feedback is the fastest way to improve beginner work.",
      task:
        "Complete a low-fidelity mini app flow for appointment booking and run one peer critique.",
      deliverable: "Mini project v1 + feedback notes + revised v2 wireframes.",
      tools: ["Figma", "Loom or Zoom (optional peer review)"],
    },
    {
      day: 8,
      title: "Visual Hierarchy and UI Composition",
      concepts: [
        "Visual hierarchy using size, contrast, and spacing.",
        "Layout rhythm: using consistent blocks for readability.",
        "Primary and secondary actions with clear emphasis.",
        "Accessibility basics for readability and scanning.",
      ],
      whyItMatters:
        "Good hierarchy helps users understand what to do in seconds.",
      task:
        "Convert one wireframe into a polished UI screen with clear hierarchy and CTA focus.",
      deliverable: "One high-fidelity screen with hierarchy rationale notes.",
      tools: ["Figma"],
    },
    {
      day: 9,
      title: "Color and Typography Systems",
      concepts: [
        "Color roles: primary, neutral, feedback, and background layers.",
        "Contrast checks for accessible text readability.",
        "Typography scale: heading, body, caption, and button text.",
        "Pairing type styles for consistency and clarity.",
      ],
      whyItMatters:
        "Color and type consistency instantly improve design quality and trust.",
      task:
        "Build a simple style guide with color tokens and text styles for your project.",
      deliverable: "Beginner design style sheet with approved color and type rules.",
      tools: ["Figma", "WCAG contrast checker"],
    },
    {
      day: 10,
      title: "Spacing, Components, and Variants",
      concepts: [
        "Spacing scale: 4-point or 8-point system.",
        "Core components: buttons, inputs, cards, and nav items.",
        "Component states: default, hover, active, disabled, error.",
        "Variants for maintaining consistency at speed.",
      ],
      whyItMatters:
        "Reusable components make your file professional and scalable.",
      task:
        "Create a small component library and apply it to at least 3 screens.",
      deliverable: "Figma component set with states and applied usage examples.",
      tools: ["Figma"],
    },
    {
      day: 11,
      title: "High-Fidelity Screen Design",
      concepts: [
        "Applying brand tone while keeping usability first.",
        "Designing complete flows, not isolated screens.",
        "Consistency checks across spacing, styles, and interactions.",
        "Using realistic content for stronger design decisions.",
      ],
      whyItMatters:
        "High-fidelity design is what stakeholders and recruiters evaluate first.",
      task:
        "Design the full final app flow in high fidelity (minimum 6 screens).",
      deliverable: "Connected high-fidelity screen set with consistent visual system.",
      tools: ["Figma"],
    },
    {
      day: 12,
      title: "Interactive Prototyping",
      concepts: [
        "Prototype links and flow logic between screens.",
        "Micro interactions: transitions, feedback, and motion basics.",
        "Reducing friction in key actions.",
        "Preparing a realistic click-through demo.",
      ],
      whyItMatters:
        "A working prototype helps others understand the experience clearly.",
      task:
        "Prototype your end-to-end user journey including one error case and one success path.",
      deliverable: "Clickable prototype link ready for user testing.",
      tools: ["Figma Prototype mode"],
    },
    {
      day: 13,
      title: "Usability Testing and Iteration",
      concepts: [
        "Simple usability script: intro, tasks, observation, close.",
        "Task-based testing to identify friction points.",
        "Severity ranking: critical, medium, low issues.",
        "Prioritizing fixes for limited time.",
      ],
      whyItMatters:
        "Testing shows where users struggle and turns design into evidence-based work.",
      task:
        "Run quick tests with 2 users and record where they hesitate or fail tasks.",
      deliverable: "Usability report with issues, evidence, and design updates.",
      tools: ["Figma prototype", "Google Sheets or Notion"],
    },
    {
      day: 14,
      title: "Final Project Polish and Portfolio Packaging",
      concepts: [
        "Final QA pass for consistency and usability.",
        "Case study structure: problem, process, solution, impact.",
        "Presenting design decisions with confidence.",
        "Preparing recruiter-friendly portfolio visuals.",
      ],
      whyItMatters:
        "Great work needs clear presentation. Packaging decides whether your project gets noticed.",
      task:
        "Finalize UI/UX project and create a complete case study presentation.",
      deliverable: "Portfolio-ready final project and one publishable case study.",
      tools: ["Figma", "Notion or PDF slides"],
    },
  ],
  projects: [
    {
      title: "Mini Project (Week 1)",
      problemStatement:
        "Users struggle to quickly book a doctor appointment without confusion and repeated form entry.",
      featuresScreens: [
        "Onboarding and user intent selection",
        "Search and filter doctors",
        "Doctor profile and slot selection",
        "Booking confirmation and reminder screen",
      ],
      expectedOutcome:
        "A complete low-fidelity flow that shows clear UX structure, navigation logic, and content hierarchy.",
    },
    {
      title: "Final Project (Week 2)",
      problemStatement:
        "Create a polished mobile appointment booking product that is easy for first-time users to complete within minutes.",
      featuresScreens: [
        "Welcome and login/onboarding",
        "Home dashboard",
        "Search, filters, and result list",
        "Doctor details and available time slots",
        "Booking summary and confirmation",
        "Profile and upcoming appointments",
      ],
      expectedOutcome:
        "A high-fidelity, clickable prototype with clear UI system, tested improvements, and portfolio-ready documentation.",
    },
  ],
  designSystemBasics: {
    colors: [
      "Choose 1 primary, 1 secondary, 2 to 3 neutral colors, and feedback colors (success/error).",
      "Use color roles with names like primary-500, neutral-100 instead of random hex usage.",
      "Check text contrast early to avoid accessibility rework later.",
    ],
    typography: [
      "Use one font family for body and optionally one for headings.",
      "Define a clear type scale: H1, H2, H3, body, caption, button.",
      "Keep line height readable and avoid too many font sizes.",
    ],
    spacing: [
      "Use a spacing scale (4px or 8px steps) for consistent rhythm.",
      "Apply spacing tokens to margins, padding, and component gaps.",
      "Use white space intentionally to improve readability and focus.",
    ],
    components: [
      "Start with core components: button, input, card, and navigation item.",
      "Create states for each component: default, hover, active, disabled, error.",
      "Use component variants so screens stay consistent as project grows.",
    ],
  },
  portfolioGuidance: {
    structureCaseStudy: [
      "Start with project summary: problem, users, role, timeline, and tool stack.",
      "Show process in order: research, insights, wireframes, UI system, prototype, testing.",
      "End with outcomes: what improved, what you learned, and what you would do next.",
    ],
    presentProjects: [
      "Use clear before/after visuals to show your thinking.",
      "Include annotated screens to explain key design decisions.",
      "Add a prototype link and keep each section easy to scan.",
    ],
    recruiterLooksFor: [
      "Problem-solving quality, not only visual polish.",
      "Process clarity and ability to explain design decisions.",
      "Consistency in layout, hierarchy, and component usage.",
      "Evidence of iteration from user feedback.",
    ],
  },
  bonus: {
    freeResources: [
      "Fonts: Google Fonts (Inter, Manrope, Poppins)",
      "Icons: Phosphor Icons, Heroicons, Lucide",
      "Inspiration: Mobbin, Dribbble, Behance, Land-book",
      "Practice briefs: FakeClients and Briefbox free prompts",
    ],
    commonBeginnerMistakes: [
      "Jumping to colors before defining user flow and structure.",
      "Using too many font sizes and inconsistent spacing.",
      "Ignoring empty, loading, and error states.",
      "Designing screens in isolation without full user journey.",
      "Skipping usability tests and assuming design is clear.",
    ],
    proTips: [
      "Start grayscale first, add color after hierarchy is clear.",
      "Name layers and frames clearly from day one.",
      "Use components early, even in small projects.",
      "Document design decisions in short notes while you build.",
      "Iterate fast in small cycles instead of polishing too early.",
    ],
  },
};
