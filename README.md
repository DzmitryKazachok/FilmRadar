<div align="center">

# Film Radar

Minimalist movie search app built with React + Vite. It queries The Movie Database (TMDb) via a secure Netlify Function and tracks trending searches via Appwrite.

`Live demo:` https://film-radar.netlify.app

</div>

## Features

- Search movies (TMDb)
- Popular (discover) feed and movie details
- Trending searches stored in Appwrite
- Debounced input to limit API calls
- Responsive UI and lightweight bundle

## Tech Stack

- React 19, Vite 7
- Netlify Functions (serverless) for TMDb proxy
- Appwrite JS SDK (database for trending)
- Tailwind CSS (via `@tailwindcss/vite`)

## Project Structure

```
react-movie-app/
├─ netlify/
│  └─ functions/
│     └─ tmdb.js        # TMDb proxy (hides server token)
├─ public/
│  └─ film-radar.svg    # favicon
├─ src/
│  ├─ components/       # UI components
│  ├─ App.jsx           # main app logic
│  ├─ appwrite.js       # Appwrite client (IDs only)
│  └─ main.jsx          # bootstrapping
├─ .gitignore
├─ index.html
├─ netlify.toml         # build + functions config
├─ package.json
└─ vite.config.js
```

## Environment Variables

Server-side (secret; used only by Netlify Functions):

- `TMDB_API_TOKEN` – TMDb v4 Read Access Token (JWT). Preferred.
- `TMDB_API_KEY_V3` – TMDb v3 API Key (optional fallback; appended as `api_key`).

Client-side (public IDs used by Appwrite JS SDK):

- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_COLLECTION_ID`

Notes:
- Do not prefix server secrets with `VITE_` (they would leak into the client bundle).
- Example file provided: `.env.example`.

## Local Development

1) Install dependencies
```
npm i
```

2) Create `.env` in project root:
```
TMDB_API_TOKEN=YOUR_V4_JWT
# or TMDB_API_KEY_V3=YOUR_V3_KEY

VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_DATABASE_ID=...
VITE_APPWRITE_COLLECTION_ID=...
```

3) Run locally with Netlify Functions
```
npx -y netlify dev
```
App: http://localhost:8888

Health check (should return JSON, 200):
```
http://localhost:8888/.netlify/functions/tmdb?path=discover/movie
```

## Deploy to Netlify

Without Git (manual via CLI):

```
npx -y netlify login
npx -y netlify init         # create a new site (slug can be changed later)
npx -y netlify env:set TMDB_API_TOKEN "..."   # set secrets in UI/CLI
npx -y netlify env:set VITE_APPWRITE_PROJECT_ID "..."
npx -y netlify env:set VITE_APPWRITE_DATABASE_ID "..."
npx -y netlify env:set VITE_APPWRITE_COLLECTION_ID "..."
npx -y netlify deploy --build --prod
```

With GitHub (CI/CD):

1) Push this repo to GitHub.
2) In Netlify → Site settings → Build & deploy → Connect to Git provider → choose the repo.
3) Set the same environment variables in Netlify UI (mark secrets as “Contains secret values”).
4) Every `git push` to the default branch triggers build + deploy.

Build config is defined in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

## Security Notes

- TMDb credentials live only in server env (`process.env`) and are not exposed to the client.
- Appwrite variables here are IDs only; secure write operations should be performed via serverless functions with an Appwrite API key if you later restrict DB permissions.
- If a secret ever appears in a commit/console/chat, rotate it immediately.

## License

MIT
