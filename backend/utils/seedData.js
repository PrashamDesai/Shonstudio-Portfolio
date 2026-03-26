const projects = [
  {
    title: "Project Aurora Drift",
    slug: "project-aurora-drift",
    tagline: "Stylized 3D exploration built for narrative-led world discovery.",
    shortDescription: "Stylized 3D exploration built for narrative-led world discovery.",
    description:
      "Aurora Drift is a studio concept for a low-friction exploration game that blends environmental storytelling, modular level kits, and cinematic camera choreography for premium-feeling indie launches.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    coverImage: "aurora-drift",
    gallery: ["aurora-drift", "aurora-drift-detail", "aurora-drift-ui"],
    technologies: ["Unity", "C#", "Blender", "FMOD", "Photoshop"],
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
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    coverImage: "mech-siege-tactics",
    gallery: ["mech-siege-tactics", "mech-siege-hud", "mech-siege-mission"],
    technologies: ["Unity", "Addressables", "Cinemachine", "Illustrator"],
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
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    coverImage: "pulse-xr-lab",
    gallery: ["pulse-xr-lab", "pulse-xr-interface", "pulse-xr-training"],
    technologies: ["Unity XR Toolkit", "Meta SDK", "Figma", "Substance 3D"],
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

const tools = [
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
  }
];

const courses = [
  {
    title: "Unity 2D",
    slug: "unity-2d",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Fundamentals of gameplay, UI, and polished 2D production workflows.",
    shortDescription: "Fundamentals of gameplay, UI, and polished 2D production workflows.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    curriculum: ["Scene structure", "Player controllers", "UI systems", "Build optimization"],
    outcomes: ["Ship a small playable prototype", "Understand reusable 2D architecture"],
  },
  {
    title: "Unity 3D",
    slug: "unity-3d",
    duration: "8 weeks",
    level: "Intermediate",
    summary: "Core 3D pipeline practice from interaction design to environment assembly.",
    shortDescription: "Core 3D pipeline practice from interaction design to environment assembly.",
    cardImage: "mech-siege-tactics",
    carouselImage: "mech-siege-tactics",
    curriculum: ["3D spaces", "Physics and cameras", "Interaction systems", "Performance basics"],
    outcomes: ["Build a guided 3D sample", "Develop scope-aware workflows"],
  },
  {
    title: "UI/UX",
    slug: "ui-ux",
    duration: "4 weeks",
    level: "Beginner",
    summary: "Premium interface thinking tailored to game readability and player flow.",
    shortDescription: "Premium interface thinking tailored to game readability and player flow.",
    cardImage: "aurora-drift",
    carouselImage: "aurora-drift",
    curriculum: ["Hierarchy", "HUD structure", "Prototype critique", "Motion systems"],
    outcomes: ["Create player-friendly interfaces", "Present stronger design reasoning"],
  },
  {
    title: "XR Development",
    slug: "xr-development",
    duration: "6 weeks",
    level: "Advanced",
    summary: "Interaction design for immersive learning and comfort-first XR experiences.",
    shortDescription: "Interaction design for immersive learning and comfort-first XR experiences.",
    cardImage: "pulse-xr-lab",
    carouselImage: "pulse-xr-lab",
    curriculum: ["XR setup", "Locomotion", "Interaction patterns", "Testing for comfort"],
    outcomes: ["Prototype an XR task flow", "Apply device-aware UX decisions"],
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
