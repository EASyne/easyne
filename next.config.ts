import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
  {
    source: "/(.*)",
    headers: [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin",
},
{
  key: "X-Frame-Options",
  value: "DENY",
},
{
  key: "Permissions-Policy",
  value: "camera=(), microphone=(), geolocation=()",
},
{
  key: "Content-Security-Policy-Report-Only",
  value:
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
},
    ],
  },
];
  },
};

export default nextConfig;
