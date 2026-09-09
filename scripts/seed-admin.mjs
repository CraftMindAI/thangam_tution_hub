// Create (or repair) the admin account defined by ADMIN_* in .env, writing
// both the Supabase Auth user and its public.profiles row.
//
//   node scripts/seed-admin.mjs
//
// Idempotent: re-running it resets the admin's password and re-asserts the
// profile row.
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "./_env.mjs";

/**
 * Insert the admin user into Auth + profiles from the given env map.
 * @param {Record<string, string>} [env]
 * @returns {Promise<{ id: string, email: string }>}
 */
export async function seedAdmin(env = loadEnv()) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;
  const fullName = env.ADMIN_USER;

  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env");
  }
  if (!email || !password || !fullName) {
    throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_USER missing in .env");
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Auth user — create, or find + update if the email already exists.
  let userId;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (created?.user) {
    userId = created.user.id;
    console.log(`  created auth user ${email}`);
  } else {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (!existing) {
      throw new Error(`Could not create or find auth user: ${createErr?.message}`);
    }
    userId = existing.id;
    await admin.auth.admin.updateUser(userId, {
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    console.log(`  updated existing auth user ${email}`);
  }

  // 2. Profile row (role = admin).
  const { error: profileErr } = await admin.from("profiles").upsert(
    { id: userId, role: "admin", full_name: fullName },
    { onConflict: "id" }
  );
  if (profileErr) {
    throw new Error(`profiles upsert failed: ${profileErr.message}`);
  }
  console.log(`  profile row set (role=admin) for ${fullName}`);

  return { id: userId, email };
}

// Run directly: `node scripts/seed-admin.mjs`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed-admin.mjs")) {
  seedAdmin()
    .then(({ email }) => console.log(`Admin ready: ${email}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
