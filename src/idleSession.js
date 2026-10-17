export const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
export const LAST_ACTIVITY_KEY = "tradezen-last-activity";
export const SESSION_EVENT = "tradezen-session-change";

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getSessionToken() {
  const token = localStorage.getItem("token");
  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  if (token && (!lastActivity || Date.now() - lastActivity >= IDLE_TIMEOUT_MS)) {
    clearSession();
    return null;
  }
  return token;
}

// Use timestamps rather than timer ticks: background tabs and sleeping devices
// may delay timers, and activity in any tab should keep the shared session alive.
export function watchIdleSession(onChange, browser = window, storage = localStorage, now = Date.now) {
  let timer;
  let previousSession;
  const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"];
  const endSession = () => {
    storage.removeItem("token");
    storage.removeItem("email");
    storage.removeItem(LAST_ACTIVITY_KEY);
  };
  const check = (activity = false) => {
    browser.clearTimeout(timer);
    let token = storage.getItem("token");
    const lastActivity = Number(storage.getItem(LAST_ACTIVITY_KEY));
    if (token && (!lastActivity || now() - lastActivity >= IDLE_TIMEOUT_MS)) {
      endSession();
      token = null;
    }
    if (token) {
      // Limit storage writes during continuous pointer/scroll events.
      if (activity && now() - lastActivity >= 1000) {
        storage.setItem(LAST_ACTIVITY_KEY, String(now()));
      }
      const remaining = IDLE_TIMEOUT_MS - (now() - Number(storage.getItem(LAST_ACTIVITY_KEY)));
      timer = browser.setTimeout(() => check(), remaining);
    }
    const email = token ? storage.getItem("email") || "" : "";
    const session = JSON.stringify([token, email]);
    if (session !== previousSession) {
      previousSession = session;
      onChange(token, email);
    }
  };
  const activity = () => check(true);
  const recheck = () => check();
  const storageChanged = (event) => {
    if (event.key === null || ["token", "email", LAST_ACTIVITY_KEY].includes(event.key)) check();
  };
  for (const event of events) browser.addEventListener(event, activity, { passive: true, capture: true });
  browser.addEventListener("focus", recheck);
  browser.document.addEventListener("visibilitychange", recheck);
  browser.addEventListener("storage", storageChanged);
  browser.addEventListener(SESSION_EVENT, recheck);
  check();
  return () => {
    browser.clearTimeout(timer);
    for (const event of events) browser.removeEventListener(event, activity, true);
    browser.removeEventListener("focus", recheck);
    browser.document.removeEventListener("visibilitychange", recheck);
    browser.removeEventListener("storage", storageChanged);
    browser.removeEventListener(SESSION_EVENT, recheck);
  };
}
