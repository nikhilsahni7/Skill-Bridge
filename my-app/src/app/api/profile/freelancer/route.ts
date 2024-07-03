import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
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

    const freelancerProfile = await prisma.freelancerProfile.create({
      data: {
        userId: session.user.id,
        title,
        skills,
        experienceLevel,
        education,
        certifications,
        hourlyRate,
        availability,
      },
    });

    return NextResponse.json({ success: true, profile: freelancerProfile });
  } catch (error) {
    console.error("Error creating freelancer profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
