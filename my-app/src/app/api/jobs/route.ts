import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ProjectStatus, Prisma, UserType } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const where: Prisma.ProjectWhereInput = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase() as ProjectStatus;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.project.findMany({
      where,
      include: {
        client: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalJobs = await prisma.project.count({ where });

    const transformedJobs = jobs.map((job) => ({
      ...job,
      client: {
        ...job.client,
        clientProfile: job.client.client,
      },

      ...(user.userType === UserType.FREELANCER && { viewDetails: true }),
    }));

    return NextResponse.json({
      success: true,
      jobs: transformedJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
