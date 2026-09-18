import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, key, { auth: { persistSession: false } });

const email = "vigneshthiyagarajan42@gmail.com";

const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  password: crypto.randomUUID(),
  email_confirm: true,
});

let userId = created?.user?.id ?? null;

if (!userId && createErr) {
  console.log("createUser error (likely already exists):", createErr.message);
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  userId =
    list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
      ?.id ?? null;
}

if (!userId) {
  console.error("Could not create or find the user.");
  process.exit(1);
}

console.log("User id:", userId);

const { error: profileErr } = await admin.from("profiles").upsert(
  {
    id: userId,
    role: "existing_student",
    full_name: "Vignesh Thiyagarajan",
    phone: "9790574321",
    class: "8",
    school: "Thangam Varahi Tuition Hub",
    location: "West Mambalam",
    parent_phone: "9790574321",
    parent_email: null,
  },
  { onConflict: "id" },
);

if (profileErr) {
  console.error("Profile upsert error:", profileErr.message);
  process.exit(1);
}

console.log(`Student profile created: ${email}, class 8.`);
