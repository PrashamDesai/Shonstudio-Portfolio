import { uiUxCoursePlan } from "./uiUxCoursePlan";

const sharedPortfolioGuidance = {
  structureCaseStudy: [
    "Open with project context: audience, problem, role, timeline, and platform.",
    "Show process in sequence: planning, implementation, testing, iteration, final build.",
    "Close with measurable outcomes, technical lessons, and next improvement steps.",
  ],
  presentProjects: [
    "Use short clips or GIFs to show mechanics instead of only screenshots.",
    "Annotate key systems like controller logic, scene flow, and optimization choices.",
    "Provide a playable build link plus repo or technical notes when possible.",
  ],
  recruiterLooksFor: [
    "Solid fundamentals in architecture, scripting, and debugging.",
    "Ability to scope and ship a complete playable loop.",
    "Clear technical communication and iteration from testing feedback.",
    "Code quality, naming consistency, and maintainable project structure.",
  ],
};

const sharedBonus = {
  freeResources: [
    "Unity Learn Pathways (Unity Essentials, Junior Programmer)",
    "Unity Documentation and Manual",
    "Kenney free game assets and OpenGameArt packs",
    "itch.io free sound packs and Freesound",
    "Unity XR Interaction Toolkit examples on GitHub",
  ],
  commonBeginnerMistakes: [
    "Skipping project structure and writing scripts without a clear system plan.",
    "Building features without playtesting each milestone.",
    "Ignoring performance until the final week.",
    "Using inconsistent naming for prefabs, scenes, and scripts.",
    "Trying to build too many features in a short schedule.",
  ],
  proTips: [
    "Commit in small milestones and tag each stable prototype.",
    "Playtest every day and fix one friction point before adding new features.",
    "Use prefabs and reusable components from the first week.",
    "Document key systems in short notes so your portfolio has stronger storytelling.",
    "Treat polish and optimization as part of design, not end-of-project cleanup.",
  ],
};

const buildDailyPlan = (weekBlocks) => {
  let dayCursor = 1;

  return weekBlocks.flatMap((week) =>
    week.days.map((day) => ({
      day: dayCursor++,
      ...day,
    })),
  );
};

const unity2dWeekBlocks = [
  {
    week: "Week 1",
    days: [
      {
        title: "Unity setup and 2D workspace",
        concepts: [
          "Unity Editor layout and 2D scene view basics.",
          "Projects, scenes, and folders for clean structure.",
          "Sprites, sprite import settings, and pixels per unit.",
        ],
        whyItMatters:
          "A clean project setup saves time and prevents confusion in later weeks.",
        task: "Create a new 2D project, organize folders, and import a starter sprite pack.",
        deliverable: "Structured Unity project with one playable test scene.",
        tools: ["Unity", "Visual Studio", "Git"],
      },
      {
        title: "Movement and player input",
        concepts: [
          "Input polling and action mapping basics.",
          "Rigidbody2D movement with frame-independent speed.",
          "Collision layers and physics materials.",
        ],
        whyItMatters:
          "Player control quality directly affects game feel and retention.",
        task: "Build player horizontal and jump movement with grounded checks.",
        deliverable: "Controllable player character with stable collisions.",
        tools: ["Unity", "C#"],
      },
      {
        title: "Camera, parallax, and scene readability",
        concepts: [
          "Camera follow systems and smoothing.",
          "Parallax background setup for depth.",
          "Layer sorting and visual clarity in 2D.",
        ],
        whyItMatters:
          "Readable scenes reduce frustration and improve game feedback.",
        task: "Create a side-scrolling scene with a smooth follow camera and parallax layers.",
        deliverable: "Playable level with readable composition and camera behavior.",
        tools: ["Unity", "Cinemachine (optional)"],
      },
      {
        title: "Animation state basics",
        concepts: [
          "Animator Controller and state transitions.",
          "Blend between idle, run, and jump animations.",
          "Animation parameters controlled by script.",
        ],
        whyItMatters:
          "Animation states make controls feel responsive and professional.",
        task: "Set up core player animation states and trigger them from movement logic.",
        deliverable: "Animated player controller with clean transitions.",
        tools: ["Unity Animator", "C#"],
      },
      {
        title: "Week 1 integration checkpoint",
        concepts: [
          "Scene cleanup and naming conventions.",
          "Testing pass for movement and camera edge cases.",
          "Bug tracking for next sprint planning.",
        ],
        whyItMatters:
          "Weekly checkpoints keep the build stable and reduce late-stage rework.",
        task: "Run a 15-minute playtest and log at least five issues.",
        deliverable: "Week 1 prototype + issue list + next-week action plan.",
        tools: ["Unity", "Notion or Trello"],
      },
    ],
  },
  {
    week: "Week 2",
    days: [
      {
        title: "Core gameplay loop",
        concepts: [
          "Goal, challenge, and feedback loop definition.",
          "Game manager pattern for state control.",
          "Win/lose condition architecture.",
        ],
        whyItMatters:
          "A complete gameplay loop is the minimum viable product for any game.",
        task: "Implement start, gameplay, fail, and restart states.",
        deliverable: "End-to-end gameplay loop with restart flow.",
        tools: ["Unity", "C#"],
      },
      {
        title: "Enemy behavior and hazards",
        concepts: [
          "Patrol and chase logic for simple AI.",
          "Damage systems and health management.",
          "Hazard zones and fail-state triggers.",
        ],
        whyItMatters:
          "Meaningful challenge systems create engagement and pacing.",
        task: "Add one enemy type and one environmental hazard.",
        deliverable: "Playable challenge segment with damage and recovery flow.",
        tools: ["Unity", "C#"],
      },
      {
        title: "Collectibles and scoring",
        concepts: [
          "Trigger-based item collection.",
          "Score manager and persistent score UI.",
          "Reward timing and progression pacing.",
        ],
        whyItMatters:
          "Progress feedback keeps players motivated to continue.",
        task: "Implement collectible pickups and score tracking.",
        deliverable: "Working progression loop with score updates.",
        tools: ["Unity", "TextMeshPro"],
      },
      {
        title: "Level flow and checkpoint system",
        concepts: [
          "Spawn points and respawn behavior.",
          "Checkpoint activation logic.",
          "Scene transitions for stage progression.",
        ],
        whyItMatters:
          "Checkpoints reduce frustration and improve session flow.",
        task: "Add at least two checkpoints and scene transition to next level.",
        deliverable: "Two-level flow with checkpoint and transition support.",
        tools: ["Unity", "C#"],
      },
      {
        title: "Week 2 gameplay review",
        concepts: [
          "Difficulty tuning and pacing checks.",
          "Collision and edge-case debugging.",
          "Feature freeze for UI sprint prep.",
        ],
        whyItMatters:
          "Stabilizing gameplay before UI polish avoids duplicated effort.",
        task: "Playtest with one external tester and capture feedback.",
        deliverable: "Revised gameplay build with prioritized fixes.",
        tools: ["Unity", "Issue tracker"],
      },
    ],
  },
  {
    week: "Week 3",
    days: [
      {
        title: "HUD and game menu systems",
        concepts: [
          "HUD layout for health, score, and objectives.",
          "Pause menu architecture and input focus.",
          "UI state synchronization with gameplay manager.",
        ],
        whyItMatters:
          "Clear UI reduces player confusion and improves usability.",
        task: "Build HUD and pause menu with resume/restart options.",
        deliverable: "Functional in-game HUD and menu flow.",
        tools: ["Unity UI", "TextMeshPro"],
      },
      {
        title: "Audio pipeline",
        concepts: [
          "Background music and SFX channel setup.",
          "Audio source and mixer basics.",
          "Feedback timing for jump, hit, and pickup events.",
        ],
        whyItMatters:
          "Audio feedback dramatically improves perceived polish.",
        task: "Integrate 6 to 8 core sound effects and one music loop.",
        deliverable: "Balanced audio pass connected to gameplay events.",
        tools: ["Unity Audio Mixer", "SFX packs"],
      },
      {
        title: "Visual polish and juice",
        concepts: [
          "Particle effects for impact and collection events.",
          "Screen shake and hit flash implementation.",
          "Timing polish for responsive feel.",
        ],
        whyItMatters:
          "Small polish effects create a premium gameplay feel.",
        task: "Add feedback effects to three key player interactions.",
        deliverable: "Polished interaction moments with visual feedback.",
        tools: ["Unity Particle System", "C#"],
      },
      {
        title: "Save and progression basics",
        concepts: [
          "Saving preferences and unlocked levels.",
          "Persistent player progress storage options.",
          "Safe reset and fallback handling.",
        ],
        whyItMatters:
          "Persistence makes the game feel complete and replay-friendly.",
        task: "Implement a simple save system for level unlocks and high score.",
        deliverable: "Persistent progress system with reset option.",
        tools: ["Unity", "PlayerPrefs", "C#"],
      },
      {
        title: "Week 3 UX pass",
        concepts: [
          "Onboarding clarity and first-session flow.",
          "UI readability and button hierarchy.",
          "Player guidance and objective messaging.",
        ],
        whyItMatters:
          "Great mechanics still fail if players cannot understand the experience quickly.",
        task: "Run first-time player test and improve onboarding moments.",
        deliverable: "Refined onboarding and improved UI communication.",
        tools: ["Unity", "Test notes"],
      },
    ],
  },
  {
    week: "Week 4",
    days: [
      {
        title: "Performance profiling for 2D",
        concepts: [
          "Profiler basics for frame timing and spikes.",
          "Sprite batching and draw call awareness.",
          "Script update optimization basics.",
        ],
        whyItMatters:
          "Performance stability improves feel on lower-end devices.",
        task: "Profile one level and remove top three frame-time bottlenecks.",
        deliverable: "Optimized build with before/after profiling notes.",
        tools: ["Unity Profiler", "Frame Debugger"],
      },
      {
        title: "Build settings and publishing prep",
        concepts: [
          "Platform build targets and resolution settings.",
          "Input validation for desktop and web builds.",
          "Build pipeline checklist.",
        ],
        whyItMatters:
          "Shipping-ready setup prevents last-minute deployment issues.",
        task: "Create desktop and WebGL test builds and validate controls.",
        deliverable: "Two deployable builds with release checklist.",
        tools: ["Unity Build Settings", "Itch.io (optional)"],
      },
      {
        title: "Final content pass",
        concepts: [
          "Level pacing and challenge balancing.",
          "Bug triage and release candidate strategy.",
          "Feature cut decisions for scope control.",
        ],
        whyItMatters:
          "Scope discipline turns prototypes into finished projects.",
        task: "Lock feature scope and execute final bug-fix sprint.",
        deliverable: "Release candidate build with issue log.",
        tools: ["Unity", "Issue board"],
      },
      {
        title: "Demo and project packaging",
        concepts: [
          "Gameplay capture and showcase clips.",
          "Repository cleanup and documentation.",
          "Technical summary writing for portfolio.",
        ],
        whyItMatters:
          "Presentation quality affects hiring and client outcomes.",
        task: "Record a 60 to 90 second gameplay walkthrough and write feature summary.",
        deliverable: "Playable build + short demo video + technical notes.",
        tools: ["OBS", "Unity", "GitHub"],
      },
      {
        title: "Final review and retrospective",
        concepts: [
          "Postmortem analysis: wins, misses, and future improvements.",
          "Learning evidence and skill reflection.",
          "Roadmap for next project complexity.",
        ],
        whyItMatters:
          "Reflection converts project effort into repeatable growth.",
        task: "Write a final retrospective with three improvements for next build.",
        deliverable: "Portfolio-ready project package and retrospective notes.",
        tools: ["Notion", "Figma (screenshots)", "Unity"],
      },
    ],
  },
];

const unity3dWeekBlocks = [
  {
    week: "Week 1",
    days: [
      {
        title: "Unity 3D setup and scene navigation",
        concepts: [
          "3D scene tools, transforms, and hierarchy structure.",
          "Project folder architecture for scalable development.",
          "Primitive-based grayboxing for level planning.",
        ],
        whyItMatters:
          "Strong scene organization is essential for managing larger 3D projects.",
        task: "Create a new 3D project and graybox a simple exploration level.",
        deliverable: "Structured 3D project with grayboxed level layout.",
        tools: ["Unity", "ProBuilder (optional)", "Git"],
      },
      {
        title: "3D player controller fundamentals",
        concepts: [
          "Character movement with physics vs character controller.",
          "Input mapping for keyboard and controller.",
          "Jump, gravity, and ground detection logic.",
        ],
        whyItMatters:
          "Reliable movement is the backbone of all 3D interactions.",
        task: "Implement a basic first-person or third-person controller.",
        deliverable: "Playable character movement with stable camera control.",
        tools: ["Unity", "C#", "Input System"],
      },
      {
        title: "Camera systems and framing",
        concepts: [
          "Camera follow behavior and damping.",
          "Third-person orbit and collision avoidance.",
          "Shot composition for readability.",
        ],
        whyItMatters:
          "Camera quality directly impacts comfort and navigation confidence.",
        task: "Set up a smooth follow camera and test in tight spaces.",
        deliverable: "Camera rig that preserves visibility during movement.",
        tools: ["Cinemachine", "Unity"],
      },
      {
        title: "Interaction basics in 3D",
        concepts: [
          "Raycast interaction and trigger zones.",
          "Pickups and interact prompts.",
          "Event-driven interactions with clean script boundaries.",
        ],
        whyItMatters:
          "Interactive objects make the world feel responsive and intentional.",
        task: "Create three interactable objects: pickup, switch, and door.",
        deliverable: "Functional interaction system across multiple object types.",
        tools: ["Unity", "C#"],
      },
      {
        title: "Week 1 integration check",
        concepts: [
          "Input and camera edge-case testing.",
          "Bug capture workflow and reproduction notes.",
          "Stability baseline before adding content complexity.",
        ],
        whyItMatters:
          "Fixing foundational issues early protects every later feature.",
        task: "Run a 20-minute test and fix top-priority movement/camera bugs.",
        deliverable: "Stable movement-interaction prototype.",
        tools: ["Unity", "Issue tracker"],
      },
    ],
  },
  {
    week: "Week 2",
    days: [
      {
        title: "Physics and object behaviors",
        concepts: [
          "Rigidbody forces and constraints.",
          "Collision events and response logic.",
          "Physical puzzle setup fundamentals.",
        ],
        whyItMatters:
          "Physics systems add depth and emergent gameplay opportunities.",
        task: "Build a small puzzle using pushable objects and trigger logic.",
        deliverable: "Playable puzzle sequence with reliable collision handling.",
        tools: ["Unity Physics", "C#"],
      },
      {
        title: "Core mission flow",
        concepts: [
          "Objective manager and mission state logic.",
          "Sequential task progression.",
          "Failure and retry paths.",
        ],
        whyItMatters:
          "Mission structure gives players direction and measurable progress.",
        task: "Implement a 3-step mission objective chain.",
        deliverable: "Mission flow with completion and reset behavior.",
        tools: ["Unity", "C#"],
      },
      {
        title: "UI for 3D gameplay",
        concepts: [
          "HUD essentials for objective, health, and prompts.",
          "Screen-space vs world-space UI.",
          "Message timing and readability.",
        ],
        whyItMatters:
          "Good UI clarifies goals without breaking immersion.",
        task: "Add objective tracker and contextual interaction prompts.",
        deliverable: "Usable HUD and in-game guidance system.",
        tools: ["Unity UI", "TextMeshPro"],
      },
      {
        title: "Audio and atmosphere",
        concepts: [
          "Ambient layers and one-shot SFX.",
          "3D audio spatial settings.",
          "Audio mixing for clear feedback.",
        ],
        whyItMatters:
          "Audio depth significantly improves environmental immersion.",
        task: "Create ambient sound zones and interaction SFX.",
        deliverable: "Spatial audio pass with clear event feedback.",
        tools: ["Unity Audio", "Audio Mixer"],
      },
      {
        title: "Week 2 gameplay checkpoint",
        concepts: [
          "Playtest-driven iteration for mission clarity.",
          "Difficulty and pacing adjustments.",
          "Stability review before world polish.",
        ],
        whyItMatters:
          "Gameplay clarity should be solved before visual polish begins.",
        task: "Run a tester walkthrough and update unclear mission moments.",
        deliverable: "Refined mission flow with tester-backed improvements.",
        tools: ["Unity", "Feedback notes"],
      },
    ],
  },
  {
    week: "Week 3",
    days: [
      {
        title: "Environment art pipeline basics",
        concepts: [
          "Modular environment construction.",
          "Asset placement for navigation and readability.",
          "Blockout to art-pass workflow.",
        ],
        whyItMatters:
          "Environment quality impacts exploration flow and player understanding.",
        task: "Replace graybox zones with modular art assets in key paths.",
        deliverable: "Partial art pass with readable traversal spaces.",
        tools: ["Unity", "Asset packs", "Blender (optional)"],
      },
      {
        title: "Lighting and post-processing",
        concepts: [
          "Baked vs realtime lighting choices.",
          "Light probes and reflection basics.",
          "Post-processing for clarity and mood.",
        ],
        whyItMatters:
          "Lighting defines mood and usability in 3D spaces.",
        task: "Create day/night or mood-based lighting setup for one level zone.",
        deliverable: "Lighting pass with intentional tone and readability.",
        tools: ["Unity Lighting", "URP post-processing"],
      },
      {
        title: "Materials and shaders",
        concepts: [
          "Material setup and texture workflow.",
          "Normal maps and roughness/metallic principles.",
          "Performance-aware material usage.",
        ],
        whyItMatters:
          "Material consistency improves visual cohesion and production quality.",
        task: "Build and apply a compact material library to major environment assets.",
        deliverable: "Consistent material style applied across playable zone.",
        tools: ["Unity Materials", "Substance or texture sources"],
      },
      {
        title: "Scene optimization early pass",
        concepts: [
          "Occlusion culling and LOD fundamentals.",
          "Draw call and mesh optimization basics.",
          "CPU and GPU cost awareness.",
        ],
        whyItMatters:
          "Early optimization prevents major instability in later feature expansion.",
        task: "Profile scene and optimize top heavy assets.",
        deliverable: "Reduced frame spikes with profiling comparison.",
        tools: ["Unity Profiler", "Frame Debugger"],
      },
      {
        title: "Week 3 visual review",
        concepts: [
          "World readability and path guidance checks.",
          "Visual noise reduction and focal points.",
          "Preparation for AI and encounter systems.",
        ],
        whyItMatters:
          "Readable environments improve gameplay without extra mechanics.",
        task: "Refine level readability using lighting, props, and waypoint cues.",
        deliverable: "Playable level with improved navigation clarity.",
        tools: ["Unity", "Screenshot review"],
      },
    ],
  },
  {
    week: "Week 4",
    days: [
      {
        title: "Enemy AI introduction",
        concepts: [
          "NavMesh setup and agent movement.",
          "Patrol, chase, and attack state basics.",
          "State machine structure for maintainability.",
        ],
        whyItMatters:
          "AI systems create dynamic challenge and replay value.",
        task: "Create one enemy with patrol and chase behavior.",
        deliverable: "Working AI enemy integrated into mission flow.",
        tools: ["NavMesh", "Unity", "C#"],
      },
      {
        title: "Combat or challenge interactions",
        concepts: [
          "Hit detection and damage feedback.",
          "Player health and recovery loop.",
          "Encounter balancing basics.",
        ],
        whyItMatters:
          "Challenge loops must feel fair and understandable.",
        task: "Implement one combat or stealth challenge section.",
        deliverable: "Balanced challenge segment with fail/retry flow.",
        tools: ["Unity", "C#", "Particles"],
      },
      {
        title: "Checkpoint and save systems",
        concepts: [
          "Spawn checkpoint logic and persistence.",
          "Scene state restoration strategy.",
          "Simple save/load architecture.",
        ],
        whyItMatters:
          "Checkpoint systems reduce frustration and support longer play sessions.",
        task: "Add checkpoint save and load behavior to active mission.",
        deliverable: "Recoverable progress system.",
        tools: ["Unity", "PlayerPrefs or JSON"],
      },
      {
        title: "UI polish and onboarding flow",
        concepts: [
          "Tutorial prompts and timing.",
          "Clear objective communication.",
          "Accessibility checks for text and contrast.",
        ],
        whyItMatters:
          "New players need guidance to understand systems quickly.",
        task: "Design onboarding prompts for the first 2 minutes of gameplay.",
        deliverable: "Onboarding flow with improved first-session clarity.",
        tools: ["Unity UI", "TextMeshPro"],
      },
      {
        title: "Week 4 integration and QA",
        concepts: [
          "System integration bug checks.",
          "Feature freeze planning.",
          "Final sprint priorities.",
        ],
        whyItMatters:
          "Integrated QA prevents last-week instability.",
        task: "Merge systems and execute a structured QA pass.",
        deliverable: "Integrated vertical slice candidate.",
        tools: ["Unity", "Issue tracker"],
      },
    ],
  },
  {
    week: "Week 5",
    days: [
      {
        title: "Advanced optimization",
        concepts: [
          "CPU hot paths and script optimization.",
          "Memory usage tracking and cleanup.",
          "Build profiling for target platform.",
        ],
        whyItMatters:
          "Optimization turns a prototype into a reliable product demo.",
        task: "Profile final build and resolve the top three performance issues.",
        deliverable: "Performance report and optimized build.",
        tools: ["Unity Profiler", "Memory profiler"],
      },
      {
        title: "Polish sprint",
        concepts: [
          "Animation and feedback consistency.",
          "Visual bug cleanup and collision smoothing.",
          "Menu and UX final pass.",
        ],
        whyItMatters:
          "Final polish influences first impressions and portfolio quality.",
        task: "Execute focused polish pass across top 10 visible issues.",
        deliverable: "Polished pre-release build.",
        tools: ["Unity", "QA checklist"],
      },
      {
        title: "Packaging and deployment",
        concepts: [
          "Release configuration and build variants.",
          "Input and resolution compatibility checks.",
          "Distribution workflow basics.",
        ],
        whyItMatters:
          "A polished build is only useful if it can be shared and played reliably.",
        task: "Prepare final desktop build and uploadable package.",
        deliverable: "Share-ready playable build package.",
        tools: ["Unity Build Settings", "Itch.io or Drive"],
      },
      {
        title: "Portfolio documentation",
        concepts: [
          "Case study narrative for technical projects.",
          "System diagrams and architecture explanation.",
          "Before/after iteration examples.",
        ],
        whyItMatters:
          "Good documentation helps recruiters understand your technical depth.",
        task: "Write a case study draft with process, systems, and outcomes.",
        deliverable: "Portfolio-ready 3D project case study.",
        tools: ["Notion", "Figma", "Screenshots"],
      },
      {
        title: "Final demo day",
        concepts: [
          "Live demo storytelling and walkthrough order.",
          "Handling Q&A with technical confidence.",
          "Postmortem and next-step planning.",
        ],
        whyItMatters:
          "Presentation quality strengthens portfolio impact and interview readiness.",
        task: "Record and present a full demo walkthrough.",
        deliverable: "Final project submission with build, video, and case study.",
        tools: ["OBS", "Unity", "Slides"],
      },
    ],
  },
];

const xrWeekBlocks = [
  {
    week: "Week 1",
    days: [
      {
        title: "XR foundations and project setup",
        concepts: [
          "XR project architecture and package setup.",
          "XR Interaction Toolkit core components.",
          "Input System and XR Origin basics.",
        ],
        whyItMatters:
          "Correct toolkit setup is required for stable interaction behavior.",
        task: "Create a new XR project and configure XR Origin with controller input.",
        deliverable: "Working XR base scene with tracked controllers.",
        tools: ["Unity", "XR Interaction Toolkit", "Input System"],
      },
      {
        title: "Interactor and interactable basics",
        concepts: [
          "Direct and ray interactors.",
          "Grab, select, and hover event flow.",
          "Interaction Manager role in linking objects.",
        ],
        whyItMatters:
          "Reliable interactions define usability in immersive experiences.",
        task: "Build a test scene with grab, inspect, and place interactions.",
        deliverable: "Interactive sandbox with multiple object behaviors.",
        tools: ["Unity", "XR Interaction Toolkit"],
      },
      {
        title: "Spatial UI essentials",
        concepts: [
          "World-space canvas setup.",
          "XR UI input and button interaction.",
          "Readable text and panel placement distances.",
        ],
        whyItMatters:
          "Poor spatial UI quickly breaks immersion and usability.",
        task: "Create an in-world control panel with three actionable buttons.",
        deliverable: "Functional world-space UI panel in XR.",
        tools: ["Unity UI", "TextMeshPro", "XR UI Input Module"],
      },
      {
        title: "Locomotion basics",
        concepts: [
          "Teleportation and snap turn patterns.",
          "Comfort-aware movement speed and rotation.",
          "Play area boundaries and safety cues.",
        ],
        whyItMatters:
          "Locomotion quality determines comfort and session duration.",
        task: "Implement teleport locomotion with clear visual anchors.",
        deliverable: "Comfort-first movement system for room-scale testing.",
        tools: ["XR Interaction Toolkit", "Unity"],
      },
      {
        title: "Week 1 XR checkpoint",
        concepts: [
          "Interaction consistency testing.",
          "Controller mapping validation.",
          "Early comfort risk identification.",
        ],
        whyItMatters:
          "Early comfort fixes prevent expensive redesign later.",
        task: "Run two test sessions and log confusion or discomfort moments.",
        deliverable: "Week 1 XR baseline with issue tracker.",
        tools: ["Unity", "Test notes"],
      },
    ],
  },
  {
    week: "Week 2",
    days: [
      {
        title: "Scenario flow design",
        concepts: [
          "Training sequence planning in XR.",
          "Task state machine for guided sessions.",
          "Feedback loops for correct and incorrect actions.",
        ],
        whyItMatters:
          "Structured flow is essential for learning-oriented XR applications.",
        task: "Design a 3-step XR training scenario with progression checks.",
        deliverable: "Interactive scenario flow blueprint and implementation plan.",
        tools: ["Unity", "FigJam"],
      },
      {
        title: "Object manipulation patterns",
        concepts: [
          "Grab, rotate, and placement interactions.",
          "Physics constraints for stable handling.",
          "Interaction affordances and visual hints.",
        ],
        whyItMatters:
          "Manipulation tasks are central to practical XR training experiences.",
        task: "Build a manipulation challenge requiring pick, align, and place actions.",
        deliverable: "Task module with measurable completion state.",
        tools: ["Unity", "XR Interaction Toolkit", "Physics"],
      },
      {
        title: "Guidance and feedback systems",
        concepts: [
          "Contextual prompts and highlights.",
          "Audio cues and haptic feedback.",
          "Error recovery guidance without breaking immersion.",
        ],
        whyItMatters:
          "Feedback systems reduce confusion and speed up learner progress.",
        task: "Add guided hints and haptics to key interaction steps.",
        deliverable: "Improved guidance system across scenario tasks.",
        tools: ["Unity", "Audio", "Controller haptics"],
      },
      {
        title: "Comfort and usability tuning",
        concepts: [
          "Motion sickness triggers and mitigation patterns.",
          "Interaction reach zones and ergonomic placement.",
          "Session pacing for beginner comfort.",
        ],
        whyItMatters:
          "Comfort-first design is mandatory for XR retention and training quality.",
        task: "Adjust scene layout and movement settings based on comfort checklist.",
        deliverable: "Comfort-optimized XR interaction environment.",
        tools: ["Unity", "Comfort checklist"],
      },
      {
        title: "Week 2 integration and playtest",
        concepts: [
          "Scenario timing validation.",
          "Task completion analytics basics.",
          "Preparation for performance sprint.",
        ],
        whyItMatters:
          "Testing scenario flow now prevents broken learning outcomes later.",
        task: "Run two end-to-end scenario tests with novice users.",
        deliverable: "Updated scenario with measurable usability improvements.",
        tools: ["Unity", "Session recording"],
      },
    ],
  },
  {
    week: "Week 3",
    days: [
      {
        title: "XR performance budgeting",
        concepts: [
          "Frame rate targets for comfort.",
          "Draw call and shader cost in XR.",
          "Lightweight scene optimization tactics.",
        ],
        whyItMatters:
          "XR performance issues are immediately visible and uncomfortable.",
        task: "Profile scene and optimize top rendering bottlenecks.",
        deliverable: "Performance-improved XR build.",
        tools: ["Unity Profiler", "Frame Debugger"],
      },
      {
        title: "Build and device validation",
        concepts: [
          "Platform-specific XR build settings.",
          "Device testing workflow and checklist.",
          "Fallback behavior when interaction fails.",
        ],
        whyItMatters:
          "Real hardware validation ensures the experience works outside the editor.",
        task: "Create test build and validate on target headset or simulator.",
        deliverable: "Validated device-ready build report.",
        tools: ["Unity Build Settings", "XR Device Simulator"],
      },
      {
        title: "Final scenario polish",
        concepts: [
          "Interaction timing polish and transitions.",
          "Visual clarity pass for instructional cues.",
          "Bug triage before release.",
        ],
        whyItMatters:
          "Polish is critical for trust in training simulations.",
        task: "Complete final polish pass on prompts, interactions, and flow timing.",
        deliverable: "Near-release XR scenario build.",
        tools: ["Unity", "QA checklist"],
      },
      {
        title: "Portfolio packaging for XR",
        concepts: [
          "Explaining immersive workflows in case studies.",
          "Capturing mixed reality or in-headset previews.",
          "Highlighting comfort and usability decisions.",
        ],
        whyItMatters:
          "Clear presentation makes XR projects understandable to non-XR reviewers.",
        task: "Document scenario goals, flow, and key technical decisions.",
        deliverable: "Portfolio-ready XR case study draft.",
        tools: ["Notion", "OBS", "Unity screenshots"],
      },
      {
        title: "Final demo and retrospective",
        concepts: [
          "Demo storytelling for training outcomes.",
          "Post-project reflection and next roadmap.",
          "Scalability planning for future modules.",
        ],
        whyItMatters:
          "A complete retrospective turns one project into a reusable framework.",
        task: "Present final XR project walkthrough and write retrospective notes.",
        deliverable: "Final submission: build, demo video, and case study.",
        tools: ["Unity", "Slides", "Notion"],
      },
    ],
  },
];

const unity2dCoursePlan = {
  objective:
    "Train beginners to build and ship a complete 2D game prototype in 4 weeks with clean systems, polished feedback, and portfolio-ready documentation.",
  overview: {
    courseTitle: "Unity 2D Game Development Bootcamp",
    duration: "4 weeks (20 guided days)",
    targetAudience:
      "Beginners who know basic programming concepts and want to build a production-style 2D game project.",
    learningOutcomes: [
      "Set up a clean Unity 2D project structure and development workflow.",
      "Build movement, enemy, objective, and progression systems using C#.",
      "Design functional HUD and menu systems that support gameplay clarity.",
      "Apply audio and visual polish to improve game feel and retention.",
      "Profile, optimize, and package a complete playable build.",
      "Publish a technical case study with clear feature and system breakdown.",
    ],
  },
  weeklyBreakdown: [
    {
      title: "Week 1: 2D Foundations and Controls",
      summary:
        "Learn core Unity 2D workflow, scene setup, player movement, camera behavior, and animation states. Build a stable playable base before adding complexity.",
      keySkills: [
        "Unity 2D editor workflow",
        "Player controller scripting",
        "Camera follow and parallax",
        "Animation state transitions",
        "Foundational testing habits",
      ],
    },
    {
      title: "Week 2: Gameplay Systems",
      summary:
        "Add challenge and progression systems with enemies, scoring, checkpoints, and level flow. Focus on creating a complete game loop.",
      keySkills: [
        "Game loop architecture",
        "Enemy and hazard logic",
        "Scoring and collectibles",
        "Checkpoint and scene flow",
        "Playtest-driven balancing",
      ],
    },
    {
      title: "Week 3: UI, Audio, and Polish",
      summary:
        "Improve user experience with HUD systems, sound design, visual feedback, and progress persistence. Shift from prototype to polished build.",
      keySkills: [
        "HUD and menu implementation",
        "Audio integration",
        "VFX and game-feel polish",
        "Save/load basics",
        "Onboarding improvements",
      ],
    },
    {
      title: "Week 4: Optimization and Release",
      summary:
        "Finalize performance, deploy builds, and package project for portfolio presentation. End with a release candidate and postmortem.",
      keySkills: [
        "2D profiling and optimization",
        "Build and deployment pipeline",
        "Release QA process",
        "Demo capture and presentation",
        "Retrospective and documentation",
      ],
    },
  ],
  dailyPlan: buildDailyPlan(unity2dWeekBlocks),
  projects: [
    {
      title: "Mini Project (Week 2)",
      problemStatement:
        "Create a playable 2D level where players can move, avoid hazards, collect items, and reach a clear objective.",
      featuresScreens: [
        "Player controller and camera",
        "At least one enemy or hazard type",
        "Collectible and score feedback",
        "Win/fail and restart loop",
      ],
      expectedOutcome:
        "A stable gameplay loop prototype proving core mechanics and scene flow.",
    },
    {
      title: "Final Project (Week 4)",
      problemStatement:
        "Deliver a polished 2D game prototype with clear progression, UI feedback, and deployable build quality.",
      featuresScreens: [
        "Two-level playable flow",
        "Checkpoint and save behavior",
        "HUD, pause, and settings menu",
        "Audio and visual feedback polish",
        "Optimized release build",
      ],
      expectedOutcome:
        "A portfolio-ready 2D game demo with technical breakdown and polished presentation assets.",
    },
  ],
  designSystemBasics: {
    architecture: [
      "Use clear folder structure: Scenes, Scripts, Prefabs, Art, Audio, UI.",
      "Separate gameplay managers from object-level behaviors.",
      "Use single-responsibility scripts where possible.",
    ],
    codeStyle: [
      "Use readable naming for classes, variables, and methods.",
      "Keep update loops lightweight and extract repeated logic.",
      "Document non-obvious gameplay rules with brief comments.",
    ],
    spacingAndUI: [
      "Use consistent spacing and alignment in HUD and menus.",
      "Keep objective and score info visible but not distracting.",
      "Design clear contrast between primary and secondary actions.",
    ],
    components: [
      "Use prefabs for reusable gameplay objects.",
      "Build reusable UI elements for buttons and panels.",
      "Define object states clearly: idle, active, disabled, destroyed.",
    ],
  },
  portfolioGuidance: sharedPortfolioGuidance,
  bonus: sharedBonus,
};

const unity3dCoursePlan = {
  objective:
    "Guide beginners through a complete 5-week 3D production cycle, from scene planning to an optimized vertical slice ready for portfolio and interviews.",
  overview: {
    courseTitle: "Unity 3D Prototype Development Bootcamp",
    duration: "5 weeks (25 guided days)",
    targetAudience:
      "Beginners and early intermediate learners ready to build complete 3D systems with gameplay, environment, AI, and optimization.",
    learningOutcomes: [
      "Build robust 3D controller, camera, and interaction systems.",
      "Design structured mission flow and challenge progression.",
      "Create readable environments with lighting and material consistency.",
      "Integrate AI, checkpoints, and onboarding UX.",
      "Profile and optimize a 3D vertical slice for stable performance.",
      "Package a polished build and technical case study for portfolio use.",
    ],
  },
  weeklyBreakdown: [
    {
      title: "Week 1: 3D Core Setup",
      summary:
        "Set up project architecture, player movement, camera rig, and foundational interaction systems in a grayboxed environment.",
      keySkills: [
        "3D scene organization",
        "Controller and camera systems",
        "Raycast interactions",
        "Input handling",
        "Baseline QA",
      ],
    },
    {
      title: "Week 2: Mission and Gameplay Flow",
      summary:
        "Implement objective logic, challenge loops, UI prompts, and gameplay pacing. Shift from sandbox to directed player experience.",
      keySkills: [
        "Mission state machines",
        "Physics interactions",
        "HUD implementation",
        "Audio integration",
        "Iterative balancing",
      ],
    },
    {
      title: "Week 3: Environment and Visual Quality",
      summary:
        "Build visual identity through environment art, lighting, materials, and early optimization checks.",
      keySkills: [
        "Modular worldbuilding",
        "Lighting workflows",
        "Material consistency",
        "Scene readability",
        "Profiling fundamentals",
      ],
    },
    {
      title: "Week 4: AI and System Integration",
      summary:
        "Add enemy AI and challenge scenarios, then integrate progression, onboarding, and checkpoint systems.",
      keySkills: [
        "NavMesh AI",
        "Combat/challenge loops",
        "Checkpoint persistence",
        "Onboarding design",
        "Cross-system QA",
      ],
    },
    {
      title: "Week 5: Optimization and Delivery",
      summary:
        "Run performance and polish sprints, package builds, and deliver a professional portfolio case study.",
      keySkills: [
        "Advanced optimization",
        "Final polish workflow",
        "Build pipeline",
        "Portfolio packaging",
        "Demo presentation",
      ],
    },
  ],
  dailyPlan: buildDailyPlan(unity3dWeekBlocks),
  projects: [
    {
      title: "Mini Project (Week 3)",
      problemStatement:
        "Build a playable 3D mission segment where players navigate, interact, and complete one objective loop.",
      featuresScreens: [
        "Playable level with guided path",
        "At least three interactions",
        "Objective tracker and completion event",
        "Basic atmosphere pass (lighting/audio)",
      ],
      expectedOutcome:
        "A complete, testable 3D mission slice demonstrating core system integration.",
    },
    {
      title: "Final Project (Week 5)",
      problemStatement:
        "Deliver a polished 3D vertical slice with stable performance, readable UX, and portfolio-grade presentation.",
      featuresScreens: [
        "Controller, camera, and interaction systems",
        "Mission flow with checkpoints",
        "AI challenge segment",
        "HUD and onboarding prompts",
        "Optimized release build",
      ],
      expectedOutcome:
        "A portfolio-ready 3D prototype with demo video, build package, and technical case study.",
    },
  ],
  designSystemBasics: {
    architecture: [
      "Separate systems into input, gameplay, UI, and AI domains.",
      "Use scene and prefab naming conventions from day one.",
      "Prefer modular scripts over monolithic controllers.",
    ],
    visualConsistency: [
      "Define lighting style and material rules for cohesive scenes.",
      "Use consistent scale references for all imported assets.",
      "Keep readability priority over visual noise.",
    ],
    performance: [
      "Profile frequently, not only at project end.",
      "Track draw calls and expensive scripts after each major feature.",
      "Use LODs and culling where scene density increases.",
    ],
    components: [
      "Use reusable prefabs for interactables and encounter objects.",
      "Create configurable ScriptableObject data for missions when needed.",
      "Standardize object states for easier debugging and testing.",
    ],
  },
  portfolioGuidance: sharedPortfolioGuidance,
  bonus: sharedBonus,
};

const xrCoursePlan = {
  objective:
    "Enable beginners to build a comfort-first XR training prototype in 3 weeks using Unity XR Interaction Toolkit, structured scenario flow, and deployable build quality.",
  overview: {
    courseTitle: "XR Development Essentials with Unity",
    duration: "3 weeks (15 guided days)",
    targetAudience:
      "Beginners interested in VR/AR interaction design and implementation using Unity XR Interaction Toolkit.",
    learningOutcomes: [
      "Configure XR projects with correct input and interaction dependencies.",
      "Implement direct, ray, and UI interactions using XR Toolkit patterns.",
      "Design comfort-first locomotion and spatial UI workflows.",
      "Build guided XR task scenarios with measurable completion logic.",
      "Profile and optimize XR scenes for stable frame performance.",
      "Publish a portfolio-ready XR case study with scenario walkthrough.",
    ],
  },
  weeklyBreakdown: [
    {
      title: "Week 1: XR Core Setup and Interaction",
      summary:
        "Set up XR Toolkit foundations, controller input, object interactions, and world-space UI. Focus on reliable core interactions first.",
      keySkills: [
        "XR project setup",
        "Interactor/interactable basics",
        "World-space UI",
        "Locomotion setup",
        "Comfort baseline testing",
      ],
    },
    {
      title: "Week 2: Scenario Design and Guidance",
      summary:
        "Build a structured XR training scenario with multi-step tasks, guidance cues, and feedback systems for learning outcomes.",
      keySkills: [
        "Scenario flow design",
        "Manipulation interactions",
        "Haptics and prompts",
        "Usability tuning",
        "Flow testing",
      ],
    },
    {
      title: "Week 3: Performance, Delivery, and Portfolio",
      summary:
        "Optimize the XR experience, validate builds on device/simulator, and package the final project for portfolio and demo use.",
      keySkills: [
        "XR profiling",
        "Build validation",
        "Final polish",
        "Case study writing",
        "Demo presentation",
      ],
    },
  ],
  dailyPlan: buildDailyPlan(xrWeekBlocks),
  projects: [
    {
      title: "Mini Project (Week 2)",
      problemStatement:
        "Build a short XR task flow where users pick, place, and confirm objects in correct sequence.",
      featuresScreens: [
        "XR setup with controller input",
        "Object interaction and placement",
        "World-space UI prompt system",
        "Task completion feedback",
      ],
      expectedOutcome:
        "A working XR task module demonstrating reliable interactions and guided flow.",
    },
    {
      title: "Final Project (Week 3)",
      problemStatement:
        "Develop a complete comfort-first XR training scenario that is playable, stable, and portfolio-ready.",
      featuresScreens: [
        "Multi-step interactive scenario",
        "Locomotion and comfort controls",
        "Guidance and feedback systems",
        "Performance-optimized build",
        "Recorded walkthrough and case study",
      ],
      expectedOutcome:
        "A publishable XR prototype with technical documentation and clear training outcomes.",
    },
  ],
  designSystemBasics: {
    interactionArchitecture: [
      "Use XR Interaction Manager as the coordination center for interactor/interactable relationships.",
      "Keep interaction scripts modular to avoid rigid coupling.",
      "Separate scenario logic from object interaction logic.",
    ],
    comfortRules: [
      "Prioritize teleport/snap turn patterns for beginner comfort.",
      "Place UI and interactables within ergonomic reach zones.",
      "Use smooth motion sparingly and validate with user testing.",
    ],
    feedbackSystem: [
      "Combine visual, audio, and haptic feedback for critical actions.",
      "Use clear prompt hierarchy: instruction, confirmation, correction.",
      "Make error recovery obvious without resetting whole scenario.",
    ],
    components: [
      "Create reusable interactable prefabs for scenario tasks.",
      "Standardize object states: available, selected, placed, completed.",
      "Use XR Device Simulator for iteration when headset access is limited.",
    ],
  },
  portfolioGuidance: sharedPortfolioGuidance,
  bonus: sharedBonus,
};

export const trainingCoursePlans = {
  "ui-ux": uiUxCoursePlan,
  "unity-2d": unity2dCoursePlan,
  "unity-3d": unity3dCoursePlan,
  "xr-development": xrCoursePlan,
  "xr-developments": xrCoursePlan,
};
