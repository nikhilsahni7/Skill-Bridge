import { AuthForm } from "@/components/Auth-form";
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const Page = async () => {
  const session = await auth();

  if (session?.user && session.user.id) {
    redirect("/dashboard");
  }

  return <AuthForm />;
};

export default Page;
