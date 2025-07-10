import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/db";
import { nextCookies } from "better-auth/next-js";
import { generateId } from "@workspace/utils/generate-id";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    generateId: () => generateId(),
  },
  plugins: [nextCookies()],
});
