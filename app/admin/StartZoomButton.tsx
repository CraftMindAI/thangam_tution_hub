"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { tokenProvider } from "../lib/stream/actions";
import { Phone } from "../components/icons";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StartZoomButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (!API_KEY) {
      setError("Video calling is not configured yet.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const client = new StreamVideoClient(API_KEY);
      await client.connectUser({ id: userId, name: userName }, tokenProvider);

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: "Instant Meeting" },
        },
      });

      await client.disconnectUser();
      router.push(`/admin/meeting/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to start the meeting. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Video Call
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Start an instant video meeting with a student or parent.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          <Phone className="h-3.5 w-3.5" />
          {loading ? "Starting…" : "Start Zoom"}
        </button>
      </div>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
