"use server";

import { auth } from "@workspace/auth/auth";
import { headers } from "next/headers";

export const signIn = async (email: string, password: string) => {
  await auth.api.signInEmail({
    headers: await headers(),
    body: {
      email,
      password,
    },
  });
};

export const signOut = async () => {
  return auth.api.signOut({
    headers: await headers(),
  });
};
