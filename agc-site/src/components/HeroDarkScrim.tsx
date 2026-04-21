/**
 * Uniform dark veil over full-bleed hero media (home carousel, immersive headers, article banners).
 * No brand tint or directional gradient — full-frame readability like the home hero.
 */
export function HeroDarkScrim() {
  return <div className="absolute inset-0 bg-black/45" aria-hidden />;
}
