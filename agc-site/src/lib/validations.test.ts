import { describe, it, expect } from "vitest";
import { contactSchema, newsletterSchema, applicationSchema } from "./validations";

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = contactSchema.safeParse({
      email: "john@example.com",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "invalid",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    const result = newsletterSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("applicationSchema", () => {
  it("accepts valid application", () => {
    const result = applicationSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      country: "Ghana",
      city: "Accra",
      motivation: "I want to contribute",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = applicationSchema.safeParse({
      fullName: "Jane",
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });
});
