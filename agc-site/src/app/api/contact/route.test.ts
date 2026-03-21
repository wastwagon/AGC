import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn().mockResolvedValue({ id: 1 }),
    },
  },
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: "test" }, error: null }),
    };
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true }),
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
  });

  it("returns 400 for missing required fields", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "John" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid contact", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          message: "Hello",
        }),
      })
    );
    expect(res.status).toBe(200);
  });
});
