const remote = "https://tradezen.up.railway.app";
const local = "http://localhost:8000";
// const defaultServerURL = import.meta.env.DEV ? local : remote;
const defaultServerURL = remote;
const ServerURL = import.meta.env.VITE_SERVER_URL || defaultServerURL;

export default ServerURL;
