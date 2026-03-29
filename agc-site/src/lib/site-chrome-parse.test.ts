import { describe, expect, it } from "vitest";
import {
  buildHrefLabelPayload,
  buildNavPayloadForSettings,
  buildWorkThumbsPayload,
  parseBottomNav,
  parseLinkList,
  parseNavList,
  parseWorkThumbs,
  serializeNavForSettings,
} from "./site-chrome-parse";

describe("site-chrome-parse", () => {
  it("readNavLink trims and rejects whitespace-only", () => {
    expect(parseLinkList([{ href: "  /a  ", label: "  A  " }])).toEqual([{ href: "/a", label: "A" }]);
    expect(parseLinkList([{ href: "   ", label: "x" }])).toBe(null);
    expect(parseLinkList([{ href: "/x", label: "  " }])).toBe(null);
  });

  it("parseNavList trims subLinks", () => {
    const v = [
      {
        href: "/our-work",
        label: "Work",
        subLinks: [{ href: " /p ", label: " P " }],
      },
    ];
    expect(parseNavList(v)).toEqual([{ href: "/our-work", label: "Work", subLinks: [{ href: "/p", label: "P" }] }]);
  });

  it("parseWorkThumbs trims and skips empty alt", () => {
    expect(parseWorkThumbs([{ href: " /x ", alt: "  Alt  " }])).toEqual([{ href: "/x", alt: "Alt" }]);
    expect(parseWorkThumbs([{ href: "/x", alt: "   " }])).toBe(null);
  });

  it("parseBottomNav trims", () => {
    expect(parseBottomNav([{ href: " __menu__ ", label: " Menu " }])).toEqual([{ href: "__menu__", label: "Menu" }]);
  });

  it("serializeNavForSettings round-trips with parseNavList", () => {
    const rows = [
      { href: "/", label: "Home", subLinks: [] },
      { href: "/w", label: "Work", subLinks: [{ href: "/w/p", label: "Programs" }] },
    ];
    const json = serializeNavForSettings(rows);
    expect(parseNavList(JSON.parse(json) as unknown)).toEqual(buildNavPayloadForSettings(rows));
  });

  it("buildHrefLabelPayload matches parseLinkList output shape", () => {
    const rows = [{ href: " /a ", label: " A " }, { href: "", label: "skip" }];
    const json = JSON.stringify(buildHrefLabelPayload(rows));
    expect(parseLinkList(JSON.parse(json) as unknown)).toEqual([{ href: "/a", label: "A" }]);
  });

  it("buildWorkThumbsPayload round-trips", () => {
    const rows = [{ href: " /p ", alt: " P " }];
    const json = JSON.stringify(buildWorkThumbsPayload(rows));
    expect(parseWorkThumbs(JSON.parse(json) as unknown)).toEqual([{ href: "/p", alt: "P" }]);
  });
});
