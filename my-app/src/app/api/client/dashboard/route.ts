// app/api/client/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { clientId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        proposals: true,
      },
    });

    const activeProjects = projects.filter(
      (project) => project.status === "OPEN" || project.status === "IN_PROGRESS"
    ).length;

    const freelancers = await prisma.freelancerProfile.findMany({
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const dashboardData = {
      activeProjects,
      totalProjects: projects.length,
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        budget: project.budget,
        proposals: project.proposals.length,
      })),
      freelancers: freelancers.map((f) => ({
        id: f.userId,
        name: f.user.name,
        title: f.title,
        skills: f.skills,
        hourlyRate: f.hourlyRate,
        image: f.user.image,
      })),
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
