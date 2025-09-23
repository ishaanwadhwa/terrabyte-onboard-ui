Terrabyte AI onboard application - built for internal terratech customers only. 



### Run locally

1) Install prerequisites

- Node.js LTS (18.18+ or 20+). If you use nvm: `nvm use --lts`

2) Install dependencies

```bash
npm install
```

3) (Optional) Configure environment

Create a `.env.local` (or `.env`) file in the project root if you need to override defaults:

```env
VITE_API_BASE_URL=https://api.terra-byte.ai
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

4) Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Build and preview

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```  




### Deploy to Vercel

This project is configured for Vercel static hosting.

1) Push your repo to GitHub/GitLab/Bitbucket
2) Import the repo into Vercel
3) Framework preset: "Vite"
4) Build command: `npm run vercel-build`
5) Output directory: `dist`

Optional environment variables (add in Vercel Project Settings → Environment Variables):

```env
VITE_API_BASE_URL=https://api.terra-byte.ai
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=production
```

SPA routing is handled via `vercel.json`, so all non-file routes fall back to `index.html`.

### Notes

- During development, requests to `/api` are proxied to the backend (`https://api.terra-byte.ai`) as configured in `vite.config.ts`.
- You can set `VITE_API_BASE_URL` to point to a different backend for builds.
