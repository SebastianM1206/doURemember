import { afterEach, beforeAll, jest } from "@jest/globals";
import { randomUUID } from "crypto";

beforeAll(() => {
  process.env.VITE_PUBLIC_SUPABASE_URL =
    process.env.VITE_PUBLIC_SUPABASE_URL ||
    "https://example-project.supabase.co";
  process.env.VITE_PUBLIC_SUPABASE_ANON_KEY =
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "anon-key";
  process.env.VITE_OPENAI_API_KEY =
    process.env.VITE_OPENAI_API_KEY || "openai-test-key";
});

if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.randomUUID !== "function") {
  globalThis.crypto.randomUUID = randomUUID;
}

if (typeof globalThis.File === "undefined") {
  globalThis.File = class FileMock extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  })
);

const storageFactory = () => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = value?.toString() ?? "";
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

Object.defineProperty(window, "localStorage", {
  value: storageFactory(),
  writable: true,
});

Object.defineProperty(window, "sessionStorage", {
  value: storageFactory(),
  writable: true,
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

