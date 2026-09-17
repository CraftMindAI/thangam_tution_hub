"use server";

import { StreamClient } from "@stream-io/node-sdk";
import { createClient } from "../supabase/server";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export async function tokenProvider() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User is not authenticated");
  if (!STREAM_API_KEY) throw new Error("Stream API key is missing");
  if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  return streamClient.createToken(user.id, expirationTime, issuedAt);
}

/**
 * Demo meetings need no Supabase session at all — anyone with the link can
 * join. The id is generated server-side with a "guest_" prefix (see
 * app/demo/meeting/[id]/page.tsx) so this can never mint a token for a real
 * (Supabase-uuid) user id.
 */
export async function guestTokenProvider(guestId: string) {
  if (!guestId.startsWith("guest_")) {
    throw new Error("Invalid guest id");
  }
  if (!STREAM_API_KEY) throw new Error("Stream API key is missing");
  if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  return streamClient.createToken(guestId, expirationTime, issuedAt);
}
