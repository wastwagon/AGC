import { describe, it, expect } from "vitest";
import { escapeHtml, nl2br } from "./sanitize";

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes &", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes quotes", () => {
    expect(escapeHtml('"test"')).toBe("&quot;test&quot;");
  });
});

describe("nl2br", () => {
  it("converts newlines to br and escapes html", () => {
    expect(nl2br("line1\nline2")).toBe("line1<br>line2");
  });

  it("escapes script tags", () => {
    expect(nl2br("<script>alert(1)</script>")).toContain("&lt;");
    expect(nl2br("<script>alert(1)</script>")).not.toContain("<script>");
  });
});
