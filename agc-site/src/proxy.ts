export { auth as proxy } from "@/auth";

export const config = {
  // Include `/admin` explicitly — some setups only matched `/admin/...` subpaths
  matcher: ["/admin", "/admin/:path*"],
};
