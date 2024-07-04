// In your API route file (e.g., app/api/profile/freelancer/update/route.ts)
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
      portfolio,
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

    if (portfolio && Array.isArray(portfolio)) {
      let portfolioRecord = await prisma.portfolio.findUnique({
        where: { freelancerId: updatedProfile.id },
      });

      if (!portfolioRecord) {
        portfolioRecord = await prisma.portfolio.create({
          data: { freelancerId: updatedProfile.id },
        });
      }

      for (const project of portfolio) {
        if (project.id) {
          await prisma.portfolioProject.update({
            where: { id: project.id },
            data: {
              title: project.title,
              description: project.description,
              projectUrl: project.projectUrl,
            },
          });
        } else {
          await prisma.portfolioProject.create({
            data: {
              portfolioId: portfolioRecord.id,
              title: project.title,
              description: project.description,
              projectUrl: project.projectUrl,
            },
          });
        }
      }
    }

    const fullUpdatedProfile = await prisma.freelancerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        portfolio: {
          include: {
            projects: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, profile: fullUpdatedProfile });
  } catch (error) {
    console.error("Error updating freelancer profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();

    const project = await prisma.portfolioProject.findFirst({
      where: {
        id: projectId,
        portfolio: {
          freelancer: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.portfolioProject.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true, deletedProjectId: projectId });
  } catch (error) {
    console.error("Error deleting portfolio project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
