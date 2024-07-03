import { AuthForm } from "@/components/Auth-form";
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (session?.user && session) {
    redirect("/onboarding");
  }
  return <AuthForm />;
};

export default page;
