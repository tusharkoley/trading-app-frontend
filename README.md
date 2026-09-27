# React + Vite

Deploy this directory as the Vercel project root with the Vite preset (`npm run build`, output directory `dist`). The included `vercel.json` serves `index.html` for client-side routes so direct visits to `/forgot-password` and `/reset-password/<uid>/<token>` load React Router instead of Vercel's 404 page. Deploy the configuration with the frontend, then verify a direct visit and refresh on `/forgot-password`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
