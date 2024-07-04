import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import EditClientProfileForm from "@/components/EditClientProfileForm";
import EditFreelancerProfileForm from "@/components/EditFreelanceProfile";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      client: true,
      freelancer: true,
    },
  });

  if (!user) {
    redirect("/onboarding");
  }

  if (user.userType === "CLIENT") {
    return <EditClientProfileForm initialProfile={user.client} />;
  } else if (user.userType === "FREELANCER") {
    return <EditFreelancerProfileForm initialProfile={user.freelancer} />;
  } else {
    redirect("/onboarding");
  }
}
