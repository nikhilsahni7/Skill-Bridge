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
    if (!user.client) {
      return <div>Client profile not found. Please contact support.</div>;
    }

    const clientProfile = {
      companyName: user.client.companyName || "",
      industry: user.client.industry || "",
      description: user.client.description || "",
      website: user.client.website || "",
      location: user.client.location || "",
      phoneNumber: user.client.phoneNumber || "",
    };

    return <EditClientProfileForm initialProfile={clientProfile} />;
  } else if (user.userType === "FREELANCER") {
    if (!user.freelancer) {
      return <div>Freelancer profile not found. Please contact support.</div>;
    }

    const freelancerProfile = {
      title: user.freelancer.title,
      skills: user.freelancer.skills,
      experienceLevel: user.freelancer.experienceLevel as
        | "ENTRY"
        | "INTERMEDIATE"
        | "EXPERT",
      education: user.freelancer.education || undefined,
      certifications: user.freelancer.certifications,
      hourlyRate: user.freelancer.hourlyRate,
      availability: user.freelancer.availability as
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "HOURLY",

      portfolio: [],
    };

    return <EditFreelancerProfileForm initialProfile={freelancerProfile} />;
  } else {
    redirect("/onboarding");
  }
}
