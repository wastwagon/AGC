import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    partnershipInquiry: {
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

vi.mock("@/lib/site-settings", () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    email: { programs: "programs@example.com", media: "m@example.com", info: "i@example.com" },
  }),
}));

describe("POST /api/partnerships", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
  });

  it("returns 400 for missing required fields", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Org" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid partnership inquiry", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
          message: "We would like to collaborate.",
        }),
      })
    );
    expect(res.status).toBe(200);
  });
});
