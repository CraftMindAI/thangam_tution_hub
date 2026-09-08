"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { tokenProvider } from "../../lib/stream/actions";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StreamVideoProvider({
  userId,
  userName,
  children,
}: {
  userId: string;
  userName: string;
  children: ReactNode;
}) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    if (!API_KEY) {
      console.error("NEXT_PUBLIC_STREAM_API_KEY is missing");
      return;
    }

    let cancelled = false;
    const client = new StreamVideoClient(API_KEY);

    client
      .connectUser({ id: userId, name: userName }, tokenProvider)
      .then(() => {
        if (!cancelled) setVideoClient(client);
      })
      .catch((err) => {
        console.error("Failed to connect to the video service", err);
      });

    return () => {
      cancelled = true;
      client.disconnectUser();
    };
  }, [userId, userName]);

  if (!videoClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        Connecting…
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
