import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancer: {
          include: {
            portfolio: {
              include: {
                projects: true,
              },
            },
          },
        },
        proposals: {
          include: {
            project: {
              select: {
                title: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.userType !== "FREELANCER") {
      return NextResponse.json(
        { error: "Forbidden: User is not a freelancer" },
        { status: 403 }
      );
    }

    // Fetch active jobs (proposals accepted and project in progress)
    const activeJobs = await prisma.proposal.count({
      where: {
        freelancerId: userId,
        status: "ACCEPTED",
        project: {
          status: "IN_PROGRESS",
        },
      },
    });

    const submittedProposals = user.proposals.length;
    const pendingProposals = user.proposals.filter(
      (proposal) => proposal.status === "PENDING"
    ).length;

    const acceptedProposals = user.proposals.filter(
      (proposal) =>
        proposal.status === "ACCEPTED" &&
        proposal.project.status === "COMPLETED"
    );

    const totalEarnings = acceptedProposals.reduce(
      (sum, proposal) => sum + proposal.bidAmount,
      0
    );

    const completedProjects = await prisma.proposal.count({
      where: {
        freelancerId: userId,
        status: "ACCEPTED",
        project: {
          status: "COMPLETED",
        },
      },
    });

    const totalProjects = await prisma.proposal.count({
      where: {
        freelancerId: userId,
        status: "ACCEPTED",
      },
    });

    const completionRate =
      totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    // Fetch projects where the freelancer's proposal was accepted
    const projects = await prisma.project.findMany({
      where: {
        proposals: {
          some: {
            freelancerId: userId,
            status: "ACCEPTED",
          },
        },
      },
      include: {
        proposals: {
          where: {
            freelancerId: userId,
          },
        },
      },
    });

    const dashboardData = {
      activeJobs,
      submittedProposals,
      pendingProposals,
      totalEarnings,
      completedProjects,
      completionRate: Math.round(completionRate),
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        deadline: project.deadline,
        budget: project.budget,
        proposals: project.proposals.length,
        description: project.description,
        skills: project.skills,
      })),
      proposals: user.proposals.map((proposal) => ({
        id: proposal.id,
        projectTitle: proposal.project.title,
        projectStatus: proposal.project.status,
        status: proposal.status,
        bidAmount: proposal.bidAmount,
        deliveryTime: proposal.deliveryTime,
      })),
      portfolio:
        user.freelancer?.portfolio?.projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          projectUrl: project.projectUrl,
        })) || [],
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Error fetching freelancer dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
