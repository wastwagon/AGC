import { type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Consultar section-padding: 80px mobile, 120px desktop */
  padding?: "default" | "none" | "sm";
};

/**
 * Consultar-style section wrapper: mobile-first padding
 * default: py-16 sm:py-20 lg:py-[80px] xl:py-[120px]
 * sm: py-12 sm:py-16
 * none: py-0
 */
export function Section({ children, className = "", padding = "default" }: SectionProps) {
  const paddingClass =
    padding === "none"
      ? ""
      : padding === "sm"
        ? "py-12 sm:py-16"
        : "py-16 sm:py-20 lg:py-[80px] xl:py-[120px]";

  return (
    <section className={`${paddingClass} ${className}`.trim()}>
      {children}
    </section>
  );
}
