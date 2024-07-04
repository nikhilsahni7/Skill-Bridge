import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function checkUserTypeAndRedirect(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true },
  });

  if (user?.userType) {
    redirect("/dashboard");
  } else {
    redirect("/onboarding");
  }
}
