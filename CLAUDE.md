# ShonStudio Portfolio - Claude AI Context

## Project Overview

ShonStudio Portfolio is a production-grade full-stack MERN application serving as a dynamic portfolio website. The system showcases projects, services, team members, and teaching/counseling content with real-time admin management capabilities. The architecture maintains strict separation between a React-Vite frontend with Tailwind styling and animations, and a Node.js-Express REST API backed by MongoDB persistence.

## Tech Stack

**Frontend:**
- React 18+ (Vite)
- Tailwind CSS (utility-first styling)
- Framer Motion (animations)
- Context API (state management)
- Axios (HTTP client)

**Backend:**
- Node.js with ES modules
- Express 4.x (REST API)
- MongoDB with Mongoose 8.x (schema validation, ODM)
- CORS (cross-origin support)
- JWT (authentication/authorization)
- Dotenv (environment configuration)
- Nodemon (development auto-reload)

**Deployment:**
- Frontend: AWS S3 + CloudFront (CDN)
- Backend: Separate hosting (environment-specific)

## Key Commands

### Development
```bash
# Root level - install dependencies
npm install

# Frontend development (Vite hot reload)
cd frontend && npm run dev

# Backend development (Nodemon auto-restart)
cd backend && npm run dev

# Both simultaneously (from respective directories)
npm run dev
```

### Production
```bash
# Build frontend (outputs to dist/)
cd frontend && npm run build

# Start backend
cd backend && npm start

# Frontend is served via S3/CloudFront in production
```

### Utilities
```bash
# Backend validation (if applicable)
python validator.py
```

## Project Structure

```
ShonStudio-Portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── *.jsx           # Functional components only
│   │   │   └── Admin/          # Admin-specific UI components
│   │   ├── pages/              # Page-level route components
│   │   ├── hooks/              # Custom React hooks (useCarouselLogic, etc.)
│   │   ├── context/            # React Context providers
│   │   ├── animations/         # Framer Motion animation definitions
│   │   ├── assets/             # Images, icons, static files
│   │   ├── admin/              # Admin panel functionality
│   │   ├── App.jsx             # Root component, routing
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Global styles
│   │   └── .env                # Frontend env (DO NOT commit)
│   ├── dist/                   # Built output (generated)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── models/                 # Mongoose schemas
│   │   ├── Course.js
│   │   ├── Project.js
│   │   ├── Service.js
│   │   ├── Team.js
│   │   ├── Tool.js
│   │   ├── VisionScene.js
│   │   └── *.js               # Other entity models
│   ├── controllers/            # Request handlers, business logic
│   ├── routes/                 # API endpoint definitions
│   ├── middleware/             # Express middleware (auth, error, etc.)
│   ├── config/                 # Configuration (DB connection, constants)
│   ├── utils/                  # Helper functions, utilities
│   ├── server.js              # Express app setup, middleware registration
│   ├── package.json
│   ├── .env                   # Backend env (DO NOT commit)
│   ├── .env.example           # Template for env vars
│   └── node_modules/          # Dependencies (ignored)
│
├── .git/                       # Version control
├── .gitignore
├── package.json               # Root-level dependencies
├── CLAUDE.md                  # This file
└── README.md                  # User-facing documentation
```

## Architecture Rules

### Frontend Principles
1. **Functional Components Only** - No class components. Use React hooks for state and side effects.
2. **Tailwind for Styling** - Use Tailwind utility classes exclusively. No inline styles (margin: "10px") except for dynamic values that cannot be expressed in Tailwind.
3. **Component Modularity** - Keep components small, focused, and reusable. One responsibility per component.
4. **Context for Global State** - Use React Context for shared state (theme, auth, app settings). Do not introduce Redux without explicit justification.
5. **Custom Hooks** - Extract complex logic into custom hooks (useCarouselLogic, etc.). Keep components clean.
6. **Separation of Concerns** - UI components in /components, pages in /pages, business logic in /hooks or utility files.

### Backend Principles
1. **REST API Standards** - Use standard HTTP methods (GET, POST, PUT, DELETE) with appropriate status codes (200, 201, 400, 404, 500).
2. **Service Layer Pattern** - No direct database calls in controllers. All DB access flows through service layer.
3. **Model-First Design** - Define Mongoose schemas strictly. Validate at the schema level; do not add redundant validation in controllers.
4. **Middleware Organization** - Authentication, error handling, and logging middleware registered in server.js in correct order.
5. **Route Organization** - API routes grouped logically (e.g., /api/projects, /api/services, /api/admin).
6. **Error Handling** - Consistent error responses. Use middleware to catch and format errors globally.
7. **Environment Isolation** - All configuration via environment variables. Never hardcode secrets, API keys, or URLs.

### General Architecture
1. **Clear Separation** - Frontend and backend are independent codebases with separate dependencies and deployment.
2. **CORS Configuration** - Backend CORS middleware configured to allow frontend origin only.
3. **Database Schema** - Mongoose models define structure; no schema drift. All migrations documented.
4. **API Contracts** - Backend API stable and versioned. Breaking changes require version increment.

## Coding Standards

### JavaScript/TypeScript
- Use `const` by default. Use `let` for reassignment. Never use `var`.
- Use arrow functions for callbacks and modern syntax (destructuring, spread operator, template literals).
- Function names: camelCase for functions/variables, PascalCase for components/classes.
- File names: PascalCase for React components (Button.jsx), camelCase for utilities (apiClient.js).

### React Components
```javascript
// Correct
export default function Header({ title, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button onClick={onClose} className="px-4 py-2 bg-blue-500 rounded">
        Close
      </button>
    </header>
  );
}
```

### Tailwind CSS
- Use utility-first approach exclusively.
- Combine utilities for responsive design: `className="w-full md:w-1/2 lg:w-1/3"`.
- Extract repeated utility patterns into @apply in index.css only if necessary for maintainability.
- Never use arbitrary values inline; use configured theme values.

### Express Routes and Controllers
```javascript
// routes/projectRoutes.js
import express from 'express';
import { getProjects, createProject } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', authenticate, createProject);

export default router;
```

### Mongoose Models
- Define schema with strict typing.
- Use schema-level validation where applicable.
- Keep models focused on structure; business logic belongs in services or controllers.
- Never modify schema after it's been used in production without migration.

## Hard Rules - DO NOT VIOLATE

1. **Environment Variables**
   - NEVER commit `.env` files to git.
   - ALWAYS update `.env.example` when adding new variables.
   - NEVER hardcode secrets, API keys, URLs, or sensitive data.

2. **Git Workflow**
   - NEVER push directly to main branch.
   - ALWAYS use feature branches (git checkout -b feature/description).
   - Squash or organize commits before merge.
   - Write clear, descriptive commit messages.

3. **Dependencies**
   - NEVER add dependencies without justification in commit message.
   - ALWAYS run npm audit before merging to main.
   - NEVER use outdated or unmaintained packages.
   - ALWAYS remove unused dependencies.

4. **Code Structure**
   - NEVER add logic to components that belongs in hooks or utilities.
   - NEVER modify existing working code without understanding impact.
   - NEVER commit console.log() or debug code.
   - ALWAYS remove dead code and unused imports.

5. **Database**
   - NEVER modify schema in production without migration planning.
   - NEVER access database directly outside model/service layer.
   - NEVER expose raw database errors to client; return sanitized messages.

6. **API Contracts**
   - NEVER change existing endpoint signatures without versioning.
   - NEVER remove fields from API responses without deprecation period.
   - ALWAYS document new endpoints in code comments.

7. **Performance**
   - NEVER load large data sets without pagination.
   - NEVER skip database indexing for frequently queried fields.
   - ALWAYS optimize images before committing to assets.

## Sensitive Areas

### Frontend Sensitive Points
- **Authentication Context** (`frontend/src/context/`) - Token handling, user state
- **Admin Panel** (`frontend/src/admin/`) - Access control, permission checks
- **API Integration** (`frontend/src/services/`) - Credential passing, request headers

### Backend Sensitive Points
- **Authentication Middleware** (`backend/middleware/auth.js`) - JWT validation, token verification
- **Mongoose Models** (`backend/models/`) - Schema definitions, data structure
- **Core Routes** (`backend/routes/`) - Endpoint definitions, access control
- **Configuration** (`backend/config/`) - Database URI, secrets, API endpoints

### Never Modify Without Review
- Environment variable schemas (.env.example)
- Database connection logic
- Authentication flow
- Admin route protection
- CORS configuration

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ShonStudio Portfolio
```

### Backend (.env)
```
MONGO_URI=mongodb://user:pass@host:port/dbname
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

All variables must be defined in the corresponding `.env.example` file for team reference.

## Instructions for Claude

### When Working on Features
1. **Read existing code** before proposing changes. Understand the current architecture.
2. **Follow the established pattern** - If components use hooks a certain way, match that pattern.
3. **Maintain the structure** - Don't reorganize folders or rename files without explicit request.
4. **Keep it simple** - Choose clarity and maintainability over clever solutions.
5. **No speculative code** - Don't add error handling for hypothetical cases. Trust framework guarantees.
6. **No premature abstractions** - Three similar lines of code are better than an early helper function.

### When Debugging
1. **Check environment variables** first - Missing or incorrect .env causes most runtime failures.
2. **Verify the API contract** - Ensure request/response format matches expectations.
3. **Check database connection** - Most backend issues trace to MongoDB URI or connection timeout.
4. **Review git status** - Uncommitted changes or stale branches may cause confusion.

### When Refactoring
1. **Preserve behavior** - Refactoring must not change observable behavior.
2. **Keep commits focused** - One logical change per commit. Don't mix refactoring with features.
3. **Don't over-engineer** - Resist urge to add configuration, flags, or "flexibility" unless needed now.

### When Adding Dependencies
1. **Justify in commit message** - Explain why the package is necessary.
2. **Prefer built-in solutions** - Use standard library or existing dependencies first.
3. **Check for alternatives** - Verify it's the best choice (size, maintenance, licensing).
4. **Update .env.example** - If the package requires configuration.

### Code Quality Standards
- **Readability over cleverness** - A developer should understand code at a glance.
- **Single Responsibility** - Functions do one thing well.
- **DRY (Don't Repeat Yourself)** - Extract duplication only when it spans multiple files.
- **Naming Clarity** - Use explicit names. `handleProjectDelete` is better than `handle`.

### Red Flags
- Components with multiple responsibilities
- Controllers with database queries (should use services)
- Magic numbers or hardcoded values without explanation
- Functions longer than 50 lines (consider breaking down)
- Unused imports or variables
- Console.log() in committed code
- Comments that restate obvious code (good comments explain why, not what)

## Summary

This is a professional full-stack portfolio application with clear separation of concerns. The codebase prioritizes maintainability, scalability, and security. Follow the patterns established in the existing code, adhere to all hard rules, and make conservative, justified changes. When in doubt, choose clarity and simplicity over innovation.
