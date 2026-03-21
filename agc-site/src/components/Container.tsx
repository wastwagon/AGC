import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** max-w-4xl | max-w-6xl | none */
  size?: "default" | "narrow" | "wide" | "none";
};

/**
 * Mobile-first container: full width with responsive padding
 */
export function Container({ children, className = "", size = "default" }: ContainerProps) {
  const sizeClass =
    size === "narrow"
      ? "max-w-4xl"
      : size === "wide"
        ? "max-w-7xl"
        : size === "none"
          ? ""
          : "max-w-6xl";

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
