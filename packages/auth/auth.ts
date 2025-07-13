import { betterAuth } from 'better-auth';

import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@workspace/database';
import * as schema from '@workspace/database/schemas';
import { nextCookies } from 'better-auth/next-js';
import { generateId } from '@workspace/utils/generate-id';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  advanced: {
    generateId: () => generateId(),
  },
  plugins: [nextCookies()],
});
