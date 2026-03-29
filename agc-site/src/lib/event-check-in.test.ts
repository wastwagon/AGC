import { describe, expect, it } from "vitest";
import { normalizeCheckInScanInput } from "./event-check-in";

describe("normalizeCheckInScanInput", () => {
  it("returns qrToken for 32 hex chars", () => {
    const token = "a".repeat(32);
    expect(normalizeCheckInScanInput(token)).toEqual({ kind: "qrToken", value: token });
    expect(normalizeCheckInScanInput(token.toUpperCase())).toEqual({ kind: "qrToken", value: token });
  });

  it("extracts badge id from path or full URL", () => {
    expect(normalizeCheckInScanInput("/events/badge/clxyz123")).toEqual({
      kind: "badgeId",
      value: "clxyz123",
    });
    expect(
      normalizeCheckInScanInput("https://example.org/events/badge/clxyz123?utm=1")
    ).toEqual({
      kind: "badgeId",
      value: "clxyz123",
    });
  });

  it("treats registration IDs as registrationId", () => {
    expect(normalizeCheckInScanInput("AGC-EV-2026-ABCDEF")).toEqual({
      kind: "registrationId",
      value: "AGC-EV-2026-ABCDEF",
    });
    expect(normalizeCheckInScanInput("  agc-ev-2026-abcdef  ")).toEqual({
      kind: "registrationId",
      value: "AGC-EV-2026-ABCDEF",
    });
  });

  it("returns null for empty", () => {
    expect(normalizeCheckInScanInput("")).toBeNull();
    expect(normalizeCheckInScanInput("   ")).toBeNull();
  });
});
