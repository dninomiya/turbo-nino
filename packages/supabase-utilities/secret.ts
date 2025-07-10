import "server-only";

import { createClient } from "@supabase/supabase-js";

export const secretSupabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
