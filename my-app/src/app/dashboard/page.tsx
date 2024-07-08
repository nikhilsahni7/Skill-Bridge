import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ClientDashboard from "@/components/ClientDashboard";
import FreelancerDashboard from "@/components/FreelancerDashboard";

export default async function DashboardPage() {
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
    return <ClientDashboard user={user} />;
  } else if (user.userType === "FREELANCER") {
    const freelancerUser = {
      name: user.name || "",
      image: user.image || "",
      freelancer: user.freelancer
        ? {
            title: user.freelancer.title || "",
            skills: user.freelancer.skills || [],
            availability: user.freelancer.availability || "",
          }
        : undefined,
    };

    return <FreelancerDashboard user={freelancerUser} />;
  } else {
    redirect("/onboarding");
  }
}
