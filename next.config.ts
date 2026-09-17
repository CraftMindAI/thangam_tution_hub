import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The public join link for daily/inquiry meetings is /student/meeting/:id,
  // but the actual page lives outside app/student/ so it can show its own
  // inline sign-in instead of being redirected away by app/student/layout.tsx
  // (which requires an existing session for everything under /student/*).
  async rewrites() {
    return [
      {
        source: "/student/meeting/:id",
        destination: "/meeting-room/:id",
      },
    ];
  },
};

export default nextConfig;
