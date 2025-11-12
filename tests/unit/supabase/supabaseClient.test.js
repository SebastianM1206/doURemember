jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({ mocked: true })),
}));

const { createClient } = require("@supabase/supabase-js");

describe("supabaseClient", () => {
  it("creates a Supabase client with expected configuration", () => {
    process.env.VITE_PUBLIC_SUPABASE_URL =
      "https://example-project.supabase.co";
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY = "anon-test-key";

    let supabaseInstance;
    createClient.mockClear();

    jest.isolateModules(() => {
      const module = require("../../../src/supabase/supabaseClient.js");
      supabaseInstance = module.supabase;
    });

    expect(createClient).toHaveBeenCalledTimes(1);
    const [url, anonKey, options] = createClient.mock.calls[0];

    expect(url).toBe("https://example-project.supabase.co");
    expect(anonKey).toBe("anon-test-key");
    expect(options).toMatchObject({
      auth: {
        persistSession: true,
        storageKey: "supabase-auth",
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    expect(supabaseInstance).toEqual({ mocked: true });
  });
});
