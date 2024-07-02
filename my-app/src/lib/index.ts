"use server";

import { signOut, signIn } from "./auth";

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doSocialLogin(formData: any) {
  const action = formData.get("action");

  await signIn(action, { redirectTo: "/home" });
}
