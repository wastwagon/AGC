"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

let scrollTriggerRegistered = false;

function registerScrollTrigger() {
  if (typeof window === "undefined" || scrollTriggerRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type HomeScrollVariant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "tiltUp"
  | "clipOpen";

type Props = {
  variant: HomeScrollVariant;
  children: ReactNode;
  className?: string;
  /** GSAP ScrollTrigger `start` (default `top 88%`). */
  start?: string;
  /** If set, animate each matching descendant with stagger (wrapper stays visible as trigger). Use `:scope > *` or `> *` for direct children. */
  staggerSelector?: string;
  /** Stagger seconds between each target (default `0.11`). */
  stagger?: number;
};

function fromVars(variant: HomeScrollVariant): Record<string, unknown> {
  switch (variant) {
    case "fadeUp":
      return { autoAlpha: 0, y: 52 };
    case "fadeIn":
      return { autoAlpha: 0 };
    case "slideLeft":
      return { autoAlpha: 0, x: -64 };
    case "slideRight":
      return { autoAlpha: 0, x: 64 };
    case "scaleUp":
      return { autoAlpha: 0, scale: 0.93, transformOrigin: "50% 65%" };
    case "tiltUp":
      return { autoAlpha: 0, y: 48, rotateX: 8, transformPerspective: 960 };
    case "clipOpen":
      return { autoAlpha: 0, clipPath: "inset(8% 6% 18% 6% round 2px)" };
    default:
      return { autoAlpha: 0, y: 40 };
  }
}

/** `querySelectorAll` on an element rejects selectors that start with `>`; anchor with `:scope`. */
function resolveStaggerSelector(root: Element, selector: string): string {
  const s = selector.trim();
  if (/^[>+~]/.test(s)) return `:scope ${s}`;
  return s;
}

function toVars(variant: HomeScrollVariant): Record<string, unknown> {
  const common: Record<string, unknown> = {
    autoAlpha: 1,
    duration: 0.85,
    ease: "power3.out",
  };
  switch (variant) {
    case "tiltUp":
      return { ...common, y: 0, rotateX: 0 };
    case "clipOpen":
      return {
        ...common,
        clipPath: "inset(0% 0% 0% 0%)",
      };
    case "scaleUp":
      return { ...common, scale: 1 };
    default:
      return { ...common, x: 0, y: 0, scale: 1 };
  }
}

/** ScrollTrigger `toggleActions`: forward enter + scroll-up re-enter both restart the tween. */
const REVEAL_TOGGLE_ACTIONS = "restart none restart none" as const;

/**
 * Scroll reveal for homepage sections (replays when re-entering from either scroll direction).
 * Respects `prefers-reduced-motion`. Uses GSAP ScrollTrigger (already a project dependency).
 */
export function HomeScrollReveal({
  variant,
  children,
  className,
  start = "top 88%",
  staggerSelector,
  stagger = 0.11,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    registerScrollTrigger();
    const ctx = gsap.context(() => {
      if (staggerSelector) {
        const resolved = resolveStaggerSelector(el, staggerSelector);
        const targets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(resolved));
        if (targets.length === 0) return;
        gsap.set(targets, fromVars(variant));
        gsap.to(targets, {
          ...toVars(variant),
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: REVEAL_TOGGLE_ACTIONS,
          },
        });
      } else {
        gsap.set(el, fromVars(variant));
        gsap.to(el, {
          ...toVars(variant),
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: REVEAL_TOGGLE_ACTIONS,
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [variant, start, staggerSelector, stagger]);

  return (
    <div
      ref={rootRef}
      className={cn(
        variant === "tiltUp" && "[perspective:1200px] [transform-style:preserve-3d]",
        variant === "clipOpen" && "overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
