# ShonStudio Portfolio

A production-style MERN portfolio for a small-scale gaming studio, with an Express/MongoDB API and a React + Vite frontend inspired by premium dark editorial studio sites.

## Structure

```text
ShonStudio Portfolio/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── animations/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layout/
│   │   └── pages/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
```

Update `.env` with a valid MongoDB URI, then run:

```bash
npm run dev
```

The API starts on `http://localhost:5000` and seeds starter content when the collections are empty.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The site starts on `http://localhost:5173`.

## API Routes

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/projects`
- `GET /api/services`
- `GET /api/services/:slug`
- `POST /api/services`
- `GET /api/tools`
- `GET /api/tools/:slug`
- `POST /api/tools`

## Notes

- The frontend uses local fallback content if the backend is unavailable during UI work.
- Visual assets are local SVG compositions, so the portfolio renders without external image dependencies.
- The design includes a loading screen, custom cursor, animated navbar, page transitions, and responsive showcase pages.
