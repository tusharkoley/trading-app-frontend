import { test } from "node:test";
import assert from "node:assert/strict";
import { watchIdleSession, IDLE_TIMEOUT_MS, LAST_ACTIVITY_KEY } from "./idleSession.js";

function setup() {
  let time = 1000000;
  const values = new Map([["token", "token"], ["email", "user@example.com"], [LAST_ACTIVITY_KEY, String(time)]]);
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  const browser = new EventTarget();
  browser.document = new EventTarget();
  const timers = new Map();
  let id = 0;
  browser.setTimeout = fn => { timers.set(++id, fn); return id; };
  browser.clearTimeout = key => timers.delete(key);
  const updates = [];
  const stop = watchIdleSession((...args) => updates.push(args), browser, storage, () => time);
  return { browser, storage, updates, stop, timers,
    advance: ms => { time += ms; },
    fireTimer: () => [...timers.values()][0]?.(),
  };
}

test("logs out at five minutes and clears credentials", () => {
  const s = setup();
  s.advance(IDLE_TIMEOUT_MS);
  s.fireTimer();
  assert.equal(s.storage.getItem("token"), null);
  assert.equal(s.storage.getItem("email"), null);
  assert.equal(s.storage.getItem(LAST_ACTIVITY_KEY), null);
  assert.deepEqual(s.updates.at(-1), [null, ""]);
});

test("activity extends session without redundant UI updates", () => {
  const s = setup();
  s.advance(4 * 60 * 1000);
  s.browser.dispatchEvent(new Event("keydown"));
  s.advance(4 * 60 * 1000);
  s.fireTimer();
  assert.equal(s.storage.getItem("token"), "token");
  assert.equal(s.updates.length, 1);
  s.advance(60 * 1000);
  s.fireTimer();
  assert.equal(s.storage.getItem("token"), null);
});

test("returning to an expired tab cannot revive the session", () => {
  for (const event of ["focus", "pointerdown"]) {
    const s = setup();
    s.advance(IDLE_TIMEOUT_MS + 1);
    s.browser.dispatchEvent(new Event(event));
    assert.equal(s.storage.getItem("token"), null);
  }
});

test("reload uses persisted activity and other tabs can extend the session", () => {
  const s = setup();
  s.advance(4 * 60 * 1000);
  s.storage.setItem(LAST_ACTIVITY_KEY, String(1000000 + 4 * 60 * 1000));
  s.advance(2 * 60 * 1000);
  s.fireTimer();
  assert.equal(s.storage.getItem("token"), "token");
  s.stop();
  assert.equal(s.timers.size, 0);
});
