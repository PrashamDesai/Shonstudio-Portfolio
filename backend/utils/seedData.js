import { MOCK_TOOL_ASSETS } from "../../frontend/src/components/mockToolAssets.js";

const dedupeBySlug = (items = []) => {
  const seen = new Set();

  return items.filter((item) => {
    const slug = String(item?.slug || "").trim().toLowerCase();

    if (!slug || seen.has(slug)) {
      return false;
    }

    seen.add(slug);
    return true;
  });
};

const projects = [
  {
    title: "Project Aurora Drift",
    slug: "project-aurora-drift",
    tagline: "Stylized 3D exploration built for narrative-led world discovery.",
    shortDescription: "Stylized 3D exploration built for narrative-led world discovery.",
    description:
      "Aurora Drift is a studio concept for a low-friction exploration game that blends environmental storytelling, modular level kits, and cinematic camera choreography for premium-feeling indie launches.",
    making:
      "The game was built around fast environment blockouts, cinematic traversal pacing, and lightweight narrative cues so the prototype could feel premium without overscoping production.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    coverImage: "aurora-drift",
    gallery: ["aurora-drift", "aurora-drift-detail", "aurora-drift-ui"],
    screenshotOrientation: "landscape",
    technologies: ["Unity", "C#", "Blender", "FMOD", "Photoshop"],
    features: ["Exploration-first progression", "Cinematic camera moments", "Environmental storytelling"],
    caseStudy: {
      title: "Case Study: Aurora Drift - Building a Cinematic Exploration Prototype",
      challenge:
        "Aurora Drift needed to feel atmospheric and premium very early, while still being small enough to prototype quickly without creating a heavy production burden.",
      goals: [
        "Create a readable exploration loop for new players.",
        "Keep traversal cinematic without slowing the experience down.",
        "Package the prototype in a way that was pitch-ready for stakeholders."
      ],
      solutions: [
        {
          title: "Exploration-first structure",
          summary: "Modular level spaces and guidance cues were designed to encourage discovery without over-instructing the player."
        },
        {
          title: "Cinematic pacing",
          summary: "Camera composition and traversal beats were tuned to create mood while keeping interaction responsive."
        },
        {
          title: "Prototype packaging",
          summary: "Presentation assets, milestone slices, and supporting documentation made the concept easier to review and scale."
        }
      ],
      pillars: [
        {
          title: "Atmosphere with clarity",
          summary: "The project balanced visual richness with clear signposting so exploration felt intuitive."
        },
        {
          title: "Fast production loops",
          summary: "Modular kits and focused scope decisions helped the team iterate quickly."
        },
        {
          title: "Pitch-ready delivery",
          summary: "The prototype was framed to communicate value both as a play experience and as a stakeholder-facing concept."
        }
      ],
      conclusion:
        "Aurora Drift demonstrates how a small, focused prototype can still feel elevated when cinematic direction and scope discipline are shaped together."
    },
    roleBreakdown: [
      {
        title: "Creative Direction",
        summary: "Defined the visual north star, pacing language, and experience pillars."
      },
      {
        title: "Gameplay Systems",
        summary: "Built interaction loops for traversal, discovery, and player guidance."
      },
      {
        title: "Production Packaging",
        summary: "Prepared milestone slices, launch pitch visuals, and QA documentation."
      }
    ],
    featured: true
  },
  {
    title: "Mech Siege Tactics",
    slug: "mech-siege-tactics",
    tagline: "2.5D combat sandbox with modular mission pacing and readable UX.",
    shortDescription: "2.5D combat sandbox with modular mission pacing and readable UX.",
    description:
      "Mech Siege Tactics demonstrates how the studio approaches tactical gameplay readability, progression balancing, and event-led content releases for long-term retention.",
    making:
      "The prototype focused on combat readability first, using modular encounter rules, layered HUD passes, and balancing checkpoints to keep the experience clear under pressure.",
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    coverImage: "mech-siege-tactics",
    gallery: ["mech-siege-tactics", "mech-siege-hud", "mech-siege-mission"],
    screenshotOrientation: "landscape",
    technologies: ["Unity", "Addressables", "Cinemachine", "Illustrator"],
    features: ["Tactical combat sandbox", "Readable mission HUD", "Modular event pacing"],
    caseStudy: {
      title: "Case Study: Mech Siege Tactics - Making Tactical Combat More Readable",
      challenge:
        "The core challenge was to keep a tactical combat game visually dramatic without sacrificing clarity during missions, upgrades, and encounter escalation.",
      goals: [
        "Make combat readable under pressure.",
        "Create a modular mission framework for repeatable iteration.",
        "Support progression and interface polish without overwhelming players."
      ],
      solutions: [
        {
          title: "Combat readability",
          summary: "Enemy signaling, layout spacing, and HUD hierarchy were tuned to keep player decisions clear."
        },
        {
          title: "Mission modularity",
          summary: "The game structure was built around reusable encounter rules and event pacing blocks."
        },
        {
          title: "UI system discipline",
          summary: "The interface stayed cinematic while preserving fast access to critical mission information."
        }
      ],
      pillars: [
        {
          title: "Pressure-tested interface design",
          summary: "Every screen had to support tactical decision-making while remaining visually cohesive."
        },
        {
          title: "Repeatable balancing",
          summary: "Modular encounter rules made testing and iteration more efficient."
        },
        {
          title: "Long-term progression framing",
          summary: "The prototype was shaped to suggest scalable progression and event-led updates."
        }
      ],
      conclusion:
        "Mech Siege Tactics shows how tactical systems can feel stylish and high-energy without losing the clarity players depend on."
    },
    roleBreakdown: [
      {
        title: "Systems Design",
        summary: "Scoped combat variables, mission rules, and onboarding flows."
      },
      {
        title: "UI/UX",
        summary: "Designed a tactical interface that stays cinematic without losing clarity."
      },
      {
        title: "QA Support",
        summary: "Wrote regression checklists and balancing notes across core scenarios."
      }
    ],
    featured: true
  },
  {
    title: "Pulse XR Lab",
    slug: "pulse-xr-lab",
    tagline: "Hands-on XR prototype designed for training-led simulation outcomes.",
    shortDescription: "Hands-on XR prototype designed for training-led simulation outcomes.",
    description:
      "Pulse XR Lab is a learning-first prototype that showcases how immersive mechanics, guided instruction layers, and realistic feedback systems can support teaching and simulation products.",
    making:
      "This case study was developed as a comfort-first XR flow, combining guided tasks, interaction checkpoints, and simulation feedback loops that support training outcomes.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    coverImage: "pulse-xr-lab",
    gallery: ["pulse-xr-lab", "pulse-xr-interface", "pulse-xr-training"],
    screenshotOrientation: "landscape",
    technologies: ["Unity XR Toolkit", "Meta SDK", "Figma", "Substance 3D"],
    features: ["Guided XR training tasks", "Comfort-first interaction design", "Performance feedback loops"],
    caseStudy: {
      title: "Case Study: Pulse XR Lab - Designing a Comfort-First Training Prototype",
      challenge:
        "The project needed to prove that XR training could feel immersive and structured at the same time, without sacrificing comfort or onboarding clarity.",
      goals: [
        "Keep interaction approachable for first-time XR users.",
        "Map training checkpoints to measurable progress.",
        "Present the prototype clearly to clients and reviewers."
      ],
      solutions: [
        {
          title: "Guided XR tasks",
          summary: "The flow was divided into structured interactions that gradually increased complexity."
        },
        {
          title: "Comfort-first decisions",
          summary: "Interaction pacing, cues, and movement choices were tuned to reduce user fatigue."
        },
        {
          title: "Feedback-driven learning",
          summary: "Performance checkpoints and in-session guidance made progress easier to understand."
        }
      ],
      pillars: [
        {
          title: "Accessibility in immersion",
          summary: "The experience stayed approachable while preserving the value of XR presence."
        },
        {
          title: "Training-oriented UX",
          summary: "Every interaction was connected to an instructional or measurable outcome."
        },
        {
          title: "Client-readable prototypes",
          summary: "The concept was packaged so reviewers could quickly understand its learning value."
        }
      ],
      conclusion:
        "Pulse XR Lab demonstrates how XR training products can balance immersion, structure, and usability in a practical prototype format."
    },
    roleBreakdown: [
      {
        title: "Prototype Architecture",
        summary: "Structured XR interactions for experimentation, comfort, and scalability."
      },
      {
        title: "Training Design",
        summary: "Mapped instruction cues and performance checkpoints to learning goals."
      },
      {
        title: "Client Readiness",
        summary: "Created pitch artifacts for stakeholder reviews and roadmap planning."
      }
    ],
    featured: false
  },
  {
    title: "Chesstrix",
    slug: "game-chesstrix",
    tagline: "Adaptive digital chess platform for scalable play, live competition, and thoughtful learning.",
    shortDescription: "Adaptive digital chess platform balancing live multiplayer depth with approachable, minimalist UX.",
    description:
      "Chesstrix is a modern digital chess platform designed as a middle ground between heavyweight professional suites and overly simplistic mobile apps. It combines adaptive AI, real-time global competition, and calm minimalist presentation so strategic depth feels approachable instead of intimidating.",
    making:
      "Chesstrix was shaped around three priorities: scaling from beginners to Grandmaster-level play, keeping multiplayer interactions fast across global networks, and making long-form improvement feel rewarding. The experience combines adaptive AI, secure matchmaking, multi-option hinting, social ranking loops, and eye-friendly themes to keep deep chess sessions clear and engaging.",
    cardImage: "hero",
    carouselImage: "hero",
    coverImage: "hero",
    gallery: [],
    screenshotOrientation: "landscape",
    technologies: ["Unity", "Figma", "Photon"],
    features: [
      "Adaptive AI Engine",
      "Global Matchmaking",
      "Cognitive Learning Hints",
      "Visual Ergonomics",
      "Friends & Rivalry system",
      "Global ranking progression",
      "Offline mode"
    ],
    caseStudy: {
      title: "Case Study: Chesstrix - Building a Scalable and Engaging Digital Chess Platform",
      challenge:
        "The digital chess market is often divided between overly complex professional platforms and overly simplistic mobile apps. The goal for Chesstrix was to create a \"middle ground\" that offers:",
      goals: [
        "Scalability: Support for everyone from absolute beginners to Grandmaster-level players.",
        "Performance: Seamless, lag-free multiplayer interaction across global networks.",
        "Engagement: Moving beyond repetitive AI to provide a dynamic, evolving challenge."
      ],
      solutions: [
        {
          title: "Adaptive AI Engine",
          summary:
            "Developed a difficulty system that learns from player behavior, ensuring that the \"bar\" rises alongside the user's skill level."
        },
        {
          title: "Global Matchmaking",
          summary:
            "Built a secure, robust back-end architecture to handle real-time multiplayer requests with minimal latency."
        },
        {
          title: "Cognitive Learning (Hints)",
          summary:
            "Instead of a single \"best move,\" the system provides three strategic options, encouraging critical thinking rather than rote memorization."
        },
        {
          title: "Visual Ergonomics",
          summary:
            "Designed four minimalist themes specifically curated to reduce eye strain during long-form sessions."
        }
      ],
      pillars: [
        {
          title: "Strategic Social Integration",
          summary:
            "Chesstrix isn't just a board; it's a community. The platform features an integrated Friends & Rivalry system, allowing users to build private circles and issue direct challenges, fostering a competitive yet social environment."
        },
        {
          title: "Dynamic Progression",
          summary:
            "With a unified Global Ranking system, every match contributes to a player's standing. This gamified approach provides tangible feedback on improvement, pushing players to climb the leaderboards through consistent play."
        },
        {
          title: "Offline Accessibility",
          summary:
            "Recognizing the need for portability, Chesstrix includes a fully functional Offline Mode. Users can access puzzles and play against the adaptive AI without an internet connection, ensuring the platform remains a reliable \"commuter-friendly\" companion."
        }
      ],
      conclusion:
        "Chesstrix successfully balances technical depth with aesthetic simplicity. By prioritizing user choice, from board rotation and timers to the level of AI assistance, the project offers a tailored experience that respects the player's unique thinking style. It is more than a game; it is a scalable training tool for the modern strategist."
    },
    featured: true
  }
];

const services = [
  {
    title: "Unity 2D Games",
    slug: "unity-2d-games",
    summary: "Responsive, artful 2D production for mobile, PC, and learning titles.",
    shortDescription: "Responsive, artful 2D production for mobile, PC, and learning titles.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    description:
      "From prototype to polished release candidate, we shape 2D experiences with strong feel, efficient content pipelines, and clean onboarding loops.",
    category: "Game Development",
    icon: "grid",
    highlights: ["Rapid prototyping", "Level design support", "Performance-aware builds"],
    deliveryFormat: "Prototype to full production",
    featured: true
  },
  {
    title: "2.5D Games",
    slug: "2-5d-games",
    summary: "Layered visual depth with disciplined gameplay readability.",
    shortDescription: "Layered visual depth with disciplined gameplay readability.",
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    description:
      "We build hybrid pipelines that combine cinematic presentation, strong silhouettes, and practical production planning.",
    category: "Game Development",
    icon: "layers",
    highlights: ["Hybrid pipelines", "Stylized environments", "Camera-led storytelling"],
    deliveryFormat: "Vertical slice or content expansion",
    featured: true
  },
  {
    title: "3D Games",
    slug: "3d-games",
    summary: "3D experiences designed for scope discipline and production confidence.",
    shortDescription: "3D experiences designed for scope discipline and production confidence.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    description:
      "Our 3D work balances ambitious mood with smart modularity so teams can ship without losing quality.",
    category: "Game Development",
    icon: "cube",
    highlights: ["Production planning", "Interaction systems", "Optimization support"],
    deliveryFormat: "Pre-production through launch",
    featured: true
  },
  {
    title: "XR Games",
    slug: "xr-games",
    summary: "Immersive products for experiential, training, and educational outcomes.",
    shortDescription: "Immersive products for experiential, training, and educational outcomes.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    description:
      "We help teams translate ideas into comfort-first XR experiences with practical device-aware design.",
    category: "Immersive",
    icon: "orbit",
    highlights: ["Comfort-first UX", "Interaction testing", "Stakeholder demos"],
    deliveryFormat: "Prototype or pilot engagement",
    featured: false
  },
  {
    title: "Teaching Modules",
    slug: "teaching-modules",
    summary: "Structured interactive learning products for guided skill growth.",
    shortDescription: "Structured interactive learning products for guided skill growth.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    description:
      "We design learning pathways that mix clarity, engagement, and measurable outcomes for students or internal teams.",
    category: "Education",
    icon: "book",
    highlights: ["Curriculum mapping", "Interactive lessons", "Assessment thinking"],
    deliveryFormat: "Module design and build",
    featured: false
  },
  {
    title: "QA Testing",
    slug: "qa-testing",
    summary: "Focused QA support for stability, clarity, and launch readiness.",
    shortDescription: "Focused QA support for stability, clarity, and launch readiness.",
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    description:
      "From exploratory testing to release checklist creation, we help teams reduce risk and improve confidence.",
    category: "Support",
    icon: "shield",
    highlights: ["Regression plans", "Bug triage", "Readability checks"],
    deliveryFormat: "Sprint-based support",
    featured: false
  },
  {
    title: "Game Audio Production",
    slug: "game-audio-production",
    summary: "Audio direction and production tuned to gameplay rhythm.",
    shortDescription: "Audio direction and production tuned to gameplay rhythm.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    description:
      "We shape sonic systems that support feedback, mood, and pacing without overpowering the player experience.",
    category: "Audio",
    icon: "wave",
    highlights: ["SFX direction", "Ambient design", "Implementation planning"],
    deliveryFormat: "Audio package or integration support",
    featured: false
  },
  {
    title: "Ad Design for Games",
    slug: "ad-design-for-games",
    summary: "Launch visuals and campaign assets with a premium studio tone.",
    shortDescription: "Launch visuals and campaign assets with a premium studio tone.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    description:
      "We build ad concepts, promo panels, and motion-ready layouts that feel aligned with the final product.",
    category: "Marketing",
    icon: "spark",
    highlights: ["Store creatives", "Campaign direction", "Motion-ready layouts"],
    deliveryFormat: "Campaign sprint",
    featured: false
  }
];

const tools = dedupeBySlug([
  {
    title: "Modular Environment Kit",
    slug: "modular-environment-kit",
    type: "Asset Pack",
    category: "3D Assets",
    image: "modular-environment-kit",
    cardImage: "modular-environment-kit",
    carouselImage: "modular-environment-kit",
    shortDescription: "Reusable environment system for rapidly building premium sci-fi spaces.",
    description:
      "A reusable environment system for rapidly building premium sci-fi and industrial spaces.",
    useCase: "Accelerates prototyping and production consistency across 3D projects.",
    features: ["Grid-snapping prefabs", "PBR-ready materials", "LOD variants"],
    techUsed: ["Unity", "Blender", "Substance 3D"],
    price: "Free",
    ctaLabel: "Use Asset",
    ctaUrl: "/tools/modular-environment-kit",
    gallery: ["modular-environment-kit"],
    tags: ["Unity", "Environment", "Pipeline"]
  },
  {
    title: "Adaptive Dialogue Builder",
    slug: "adaptive-dialogue-builder",
    type: "Tool",
    category: "Dev Tools",
    image: "adaptive-dialogue-builder",
    cardImage: "adaptive-dialogue-builder",
    carouselImage: "adaptive-dialogue-builder",
    shortDescription: "Internal narrative flow setup for branching conversations and events.",
    description:
      "Internal narrative flow setup for branching conversations, events, and player prompts.",
    useCase: "Helps teams prototype quest and dialogue structures with less engineering overhead.",
    features: ["Node graph editor", "Event hooks", "JSON export"],
    techUsed: ["React", "Node.js", "MongoDB"],
    price: "Free",
    ctaLabel: "Use Tool",
    ctaUrl: "/tools/adaptive-dialogue-builder",
    gallery: ["adaptive-dialogue-builder"],
    tags: ["Narrative", "Tooling", "UX"]
  },
  {
    title: "Audio Moodboard Library",
    slug: "audio-moodboard-library",
    type: "Audio Asset",
    category: "VFX & Particles",
    image: "audio-moodboard-library",
    cardImage: "audio-moodboard-library",
    carouselImage: "audio-moodboard-library",
    shortDescription: "Categorized sonic references with implementation-ready direction notes.",
    description:
      "A categorized collection of sonic references and implementation-ready direction notes.",
    useCase: "Speeds up audio alignment during concept and pre-production phases.",
    features: ["Tagged mood sets", "Timeline markers", "Export templates"],
    techUsed: ["FMOD", "Wwise", "Unity"],
    price: "Free",
    ctaLabel: "Use Library",
    ctaUrl: "/tools/audio-moodboard-library",
    gallery: ["audio-moodboard-library"],
    tags: ["Audio", "Reference", "Production"]
  },
  {
    title: "Pixel Props Bundle",
    slug: "pixel-props-bundle",
    type: "Asset Pack",
    category: "2D Assets",
    image: "aurora-drift",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    shortDescription: "Production-ready 2D environment props for platformers and adventure games.",
    description:
      "A dense 2D props set built for rapid scene assembly, with layered exports and palette variants.",
    useCase: "Cuts down scene-building time for 2D projects and prototypes.",
    features: ["Tile-safe sprites", "Palette variants", "Organized prefab groups"],
    techUsed: ["Photoshop", "Aseprite", "Unity"],
    price: "$19",
    ctaLabel: "Purchase",
    ctaUrl: "/tools/pixel-props-bundle",
    gallery: ["aurora-drift", "aurora-drift-ui"],
    tags: ["2D", "Pixel Art", "Environment"]
  },
  {
    title: "HUD Interface Pack",
    slug: "hud-interface-pack",
    type: "UI Pack",
    category: "UI Packs",
    image: "mech-siege-hud",
    cardImage: "mech-siege-hud",
    carouselImage: "mech-siege-hud",
    shortDescription: "Clean HUD components for sci-fi and simulation-heavy games.",
    description:
      "A modular HUD kit with status bars, panels, and notification patterns for readable gameplay interfaces.",
    useCase: "Speeds up UI prototyping and keeps visual language consistent across screens.",
    features: ["Auto-layout files", "Dark/light variants", "Component tokens"],
    techUsed: ["Figma", "Unity UI Toolkit"],
    price: "$29",
    ctaLabel: "Purchase",
    ctaUrl: "/tools/hud-interface-pack",
    gallery: ["mech-siege-hud", "mech-siege-mission"],
    tags: ["UI", "HUD", "Design System"]
  },
  ...MOCK_TOOL_ASSETS,
]);

const courses = [
  {
    title: "UI/UX",
    slug: "ui-ux",
    duration: "2 weeks",
    level: "Beginner",
    summary:
      "A fast, intensive foundation in interface and experience design for learners who need practical output quickly.",
    shortDescription:
      "A beginner-friendly 2-week sprint covering UX thinking, wireframes, visual systems, and handoff-ready prototypes.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    curriculum: [
      "Week 1, Day 1: UX mindset, user goals, and problem framing",
      "Week 1, Day 2: User research basics, personas, and journey mapping",
      "Week 1, Day 3: Information architecture, content grouping, and task flows",
      "Week 1, Day 4: Low-fidelity wireframes for desktop and mobile",
      "Week 1, Day 5: Design critique loop and iteration framework",
      "Week 2, Day 1: Typography, spacing, color contrast, and readability",
      "Week 2, Day 2: Component systems, reusable patterns, and UI states",
      "Week 2, Day 3: Clickable prototypes, transition logic, and feedback patterns",
      "Week 2, Day 4: Usability testing script, observation notes, and fixes",
      "Week 2, Day 5: Design handoff package, annotations, and portfolio presentation",
    ],
    outcomes: [
      "Translate a product idea into user-first screens with clear hierarchy",
      "Build a small component system with consistent spacing and interaction states",
      "Run a beginner-level usability test and convert findings into revisions",
      "Present a complete UX case mini-story from problem to improved prototype",
      "Deliver handoff-ready design files with naming and structure discipline",
    ],
  },
  {
    title: "Unity 2D",
    slug: "unity-2d",
    duration: "4 weeks",
    level: "Beginner",
    summary:
      "A complete beginner track that takes learners from Unity basics to a polished 2D game prototype.",
    shortDescription:
      "A 4-week practical path through C#, movement, combat, UI, audio, and a final playable 2D build.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    curriculum: [
      "Week 1: Unity editor workflow, scene setup, prefabs, and C# scripting essentials",
      "Week 1 Lab: Input system, player movement, camera follow, and collision setup",
      "Week 2: Core gameplay loop with objectives, scoring, and level progression",
      "Week 2 Lab: Enemy behaviors, spawn logic, and health-damage architecture",
      "Week 3: UI canvas, HUD elements, menus, and game state management",
      "Week 3 Lab: Audio system, feedback animation, particles, and juice pass",
      "Week 4: Save data basics, balancing, and performance-aware optimization",
      "Week 4 Final: Build packaging, bug triage, and demo-ready presentation",
    ],
    outcomes: [
      "Build a full 2D gameplay loop with player, enemies, progression, and win/lose states",
      "Use prefabs and scripts to structure reusable, scalable feature architecture",
      "Design a readable HUD and menu flow for a first-time player experience",
      "Publish a polished beginner prototype with clear scope and performance awareness",
      "Document systems so future teammates can continue development confidently",
    ],
  },
  {
    title: "Unity 3D",
    slug: "unity-3d",
    duration: "5 weeks",
    level: "Beginner",
    summary:
      "A structured introduction to 3D production where beginners learn environments, interaction, and optimization in one guided flow.",
    shortDescription:
      "A 5-week beginner-deep track for building a complete 3D prototype with interaction, lighting, and performance tuning.",
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    curriculum: [
      "Week 1: 3D editor navigation, scene composition, transforms, and modular blocking",
      "Week 1 Lab: Character controller, camera rigs, and movement polish",
      "Week 2: Physics materials, collisions, triggers, and interaction architecture",
      "Week 2 Lab: Pickups, doors, switches, and event-driven gameplay systems",
      "Week 3: Terrain, lighting setup, post-processing, and visual readability",
      "Week 3 Lab: Materials, shaders, and atmosphere-building workflow",
      "Week 4: Enemy AI basics, navigation, and encounter pacing",
      "Week 4 Lab: Mission objective flow, checkpoints, and fail states",
      "Week 5: Optimization pass, profiling, and memory-conscious scene cleanup",
      "Week 5 Final: Vertical slice assembly and playable review demo",
    ],
    outcomes: [
      "Produce a coherent 3D scene that supports gameplay and visual storytelling",
      "Implement interaction systems that connect player actions to world responses",
      "Create a playable mini vertical slice with objectives, challenge, and feedback",
      "Apply baseline profiling habits to improve frame stability and load behavior",
      "Communicate design and technical choices during demo presentation and review",
    ],
  },
  {
    title: "XR Development",
    slug: "xr-development",
    duration: "3 weeks",
    level: "Beginner",
    summary:
      "A beginner-accessible immersive track focused on comfort, interaction clarity, and device-aware XR workflows.",
    shortDescription:
      "A 3-week guided XR program covering headset setup, interaction design, locomotion, testing, and deployment basics.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    curriculum: [
      "Week 1: XR project setup, device pipeline, tracking spaces, and scene calibration",
      "Week 1 Lab: Hand/controller input mapping and interaction affordances",
      "Week 2: Locomotion models, comfort constraints, and spatial UI placement",
      "Week 2 Lab: Grab, point, teleport, and contextual interaction patterns",
      "Week 3: Performance budgets for XR, test protocol design, and iteration cycles",
      "Week 3 Final: Deployable XR training task demo with comfort-first validation",
    ],
    outcomes: [
      "Set up and configure an XR project from blank scene to interactive prototype",
      "Design interaction patterns that reduce confusion and simulator discomfort",
      "Build a small immersive training scenario with measurable user actions",
      "Apply practical device testing to improve usability and responsiveness",
      "Package and present an XR demo with clear rationale behind experience decisions",
    ],
  },
];

const company = {
  parentCompany:
    "Indianic is the parent studio network behind ShonStudio, bringing product thinking, digital delivery discipline, and long-horizon client partnerships into every interactive build.",
  description:
    "ShonStudio operates as the game and immersive division focused on premium prototypes, launch-facing presentation, internal tools, and learning-led experiences. The studio combines cinematic taste with practical scope planning so concepts feel compelling before they ever reach full production scale.",
  vision:
    "We build the layer between rough ambition and credible execution: giving founders, studios, and learning teams a visual point of view, a practical delivery path, and enough polish to make new ideas feel investable early.",
  values: [
    "Clarity before scale",
    "Cinematic craft with production discipline",
    "Readable systems that still feel bold",
    "Trusted collaboration from prototype to launch",
  ],
  timeline: [
    {
      date: "2019",
      title: "Parent digital foundation",
      description:
        "The wider studio ecosystem matured its delivery process across product builds, laying the operational groundwork for a dedicated interactive division.",
    },
    {
      date: "2021",
      title: "ShonStudio launched",
      description:
        "The game-focused division took shape to handle premium concepts, playable prototypes, and presentation systems for early-stage interactive products.",
    },
    {
      date: "2023",
      title: "Immersive prototype expansion",
      description:
        "XR and learning-led prototypes became a larger part of the portfolio, pairing comfort-first interaction with stakeholder-friendly demos.",
    },
    {
      date: "2025",
      title: "Studio systems refined",
      description:
        "The team standardized modular content, admin workflows, and showcase-ready case study structures to support faster iteration.",
    },
  ],
};

const team = [
  {
    name: "Rhea Patel",
    role: "Lead Unity Developer",
    category: "developer",
    coreTech: ["Unity", "C#", "Addressables", "Cinemachine"],
    bio:
      "Rhea leads systems planning and gameplay implementation with a focus on clarity, responsiveness, and modular delivery.",
    skills: ["Gameplay systems", "Performance tuning", "Tooling workflows", "Build packaging"],
    experience:
      "7+ years shipping prototypes and production slices across 2D, 2.5D, and 3D projects for launch prep, investor demos, and internal validation.",
    projects: ["Project Aurora Drift", "Mech Siege Tactics", "Internal showcase tools"],
    education: "B.Tech in Computer Science, Nirma University",
    contactLinks: {
      email: "rhea@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/rhea-shonstudio",
      github: "https://github.com/rhea-shonstudio",
    },
    profileImage: "team-rhea-dev",
  },
  {
    name: "Arjun Mehta",
    role: "XR Systems Developer",
    category: "developer",
    coreTech: ["Unity XR Toolkit", "Meta SDK", "Photon", "Blender"],
    bio:
      "Arjun builds comfort-first immersive flows that balance technical experimentation with structured learning outcomes.",
    skills: ["XR interaction design", "Prototype architecture", "Comfort testing", "Simulation logic"],
    experience:
      "5+ years creating XR pilot builds, simulation-led demos, and stakeholder review prototypes for education and training products.",
    projects: ["Pulse XR Lab", "Training interaction pilots", "Prototype labs"],
    education: "M.Sc. in Game Technology, DAIICT",
    contactLinks: {
      email: "arjun@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/arjun-shonstudio",
      github: "https://github.com/arjun-shonstudio",
    },
    profileImage: "team-arjun-dev",
  },
  {
    name: "Nisha Rao",
    role: "MERN Platform Engineer",
    category: "developer",
    coreTech: ["MongoDB", "Express", "React", "Node.js"],
    bio:
      "Nisha connects presentation layers with scalable content systems, admin workflows, and production-ready frontend architecture.",
    skills: ["API design", "Content modeling", "Frontend systems", "Admin tooling"],
    experience:
      "6+ years building CMS-style workflows, dashboards, and marketing platforms that support ongoing studio operations.",
    projects: ["ShonStudio Portfolio", "Admin content systems", "Client-facing publishing tools"],
    education: "B.E. in Information Technology, LD College of Engineering",
    contactLinks: {
      email: "nisha@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/nisha-shonstudio",
      github: "https://github.com/nisha-shonstudio",
    },
    profileImage: "team-nisha-dev",
  },
  {
    name: "Aanya Shah",
    role: "Senior UI/UX Designer",
    category: "designer",
    coreTech: ["Figma", "Framer Motion", "Design Systems", "Miro"],
    bio:
      "Aanya shapes interface systems that feel premium, readable, and production-aware from the first clickable concept.",
    skills: ["Product UX", "Motion direction", "Information hierarchy", "Prototype storytelling"],
    experience:
      "8+ years designing interfaces for apps, game-adjacent tools, launch pages, and interactive experiences with strong presentation needs.",
    projects: ["Mech Siege Tactics", "ShonStudio Portfolio", "Interactive service showcases"],
    education: "Master of Design in Interaction Design, UID Ahmedabad",
    contactLinks: {
      email: "aanya@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/aanya-shonstudio",
      github: "",
    },
    profileImage: "team-aanya-design",
  },
  {
    name: "Vihaan Kapoor",
    role: "3D Environment Artist",
    category: "designer",
    coreTech: ["Blender", "Substance 3D", "Unity", "Photoshop"],
    bio:
      "Vihaan builds atmospheres that support worldbuilding, readability, and believable production scope for prototype environments.",
    skills: ["Environment art", "Material workflows", "Scene composition", "Lighting direction"],
    experience:
      "6+ years translating visual references into shippable environment kits for game prototypes, pitch decks, and cinematic captures.",
    projects: ["Project Aurora Drift", "Pulse XR Lab", "Modular Environment Kit"],
    education: "B.Des. in Animation and VFX, MIT Institute of Design",
    contactLinks: {
      email: "vihaan@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/vihaan-shonstudio",
      github: "",
    },
    profileImage: "team-vihaan-design",
  },
  {
    name: "Meera Joshi",
    role: "Brand and Visual Designer",
    category: "designer",
    coreTech: ["Illustrator", "Photoshop", "After Effects", "Figma"],
    bio:
      "Meera translates product strategy into brand framing, campaign language, and premium visual systems that make the work feel presentation-ready.",
    skills: ["Brand systems", "Campaign visuals", "Motion-ready assets", "Pitch design"],
    experience:
      "7+ years creating launch materials, identity systems, and marketing visuals for digital products and creative studios.",
    projects: ["Ad Design for Games", "Studio case study systems", "Launch presentation decks"],
    education: "B.Des. in Communication Design, CEPT University",
    contactLinks: {
      email: "meera@shonstudio.dev",
      linkedIn: "https://www.linkedin.com/in/meera-shonstudio",
      github: "",
    },
    profileImage: "team-meera-design",
  },
];

const visionScenes = [
  {
    kicker: "Studio direction",
    pill: "Visual systems",
    title: "We shape a visual point of view that makes the product feel considered before the first full build exists.",
    description:
      "This part of the process focuses on atmosphere, interface taste, pacing, and presentation language so the concept already feels coherent when it reaches founders, clients, or players.",
    panelTitle: "Direction before scale",
    panelSummary:
      "We build the moodboard, visual hierarchy, and presentation rhythm early so later production choices stay aligned.",
    panelImage: "hero",
    bullets: ["Mood framing", "Interface taste", "Pitch-ready presentation"],
    featured: true,
  },
  {
    kicker: "Experience planning",
    pill: "Readable builds",
    title: "We balance spectacle with clarity so the experience can look rich without becoming hard to navigate or explain.",
    description:
      "From prototypes to XR learning flows, the focus is on readable systems, strong visual hierarchy, and scenes that communicate function as clearly as they communicate mood.",
    panelTitle: "Readable interaction layers",
    panelSummary:
      "Each build is structured so users, clients, and teammates can understand what matters at a glance.",
    panelImage: "hero",
    bullets: ["Clear UX", "Focused pacing", "Client-friendly demos"],
    featured: true,
  },
  {
    kicker: "Production fit",
    pill: "Launchable scope",
    title: "We shape ambitious concepts into something practical enough to prototype, present, and eventually ship.",
    description:
      "The studio approach keeps scope, modularity, and delivery in view from the start, which helps promising ideas stay exciting without collapsing under production pressure.",
    panelTitle: "Creative ambition with boundaries",
    panelSummary:
      "The result is work that still feels elevated, but has a much stronger chance of becoming a real product.",
    panelImage: "hero",
    bullets: ["Scope discipline", "Milestone framing", "Launch-facing polish"],
    featured: true,
  },
];

export const initialData = { projects, services, tools, courses, company, team, visionScenes };
