import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      skills,
      experienceLevel,
      education,
      certifications,
      hourlyRate,
      availability,
    } = await req.json();

    const updatedProfile = await prisma.freelancerProfile.update({
      where: { userId: session.user.id },
      data: {
        title,
        skills,
        experienceLevel,
        education,
        certifications,
        hourlyRate,
        availability,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error updating freelancer profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
