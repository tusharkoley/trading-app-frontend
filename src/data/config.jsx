const remote = "https://tradezen.up.railway.app";
const local = "http://127.0.0.1:8000";

// Prefer explicit env override; otherwise pick local in dev and remote in production.
const defaultServerURL = import.meta.env.DEV ? local : remote;
const ServerURL = (import.meta.env.VITE_SERVER_URL || defaultServerURL).replace(/\/$/, "");

export default ServerURL;
