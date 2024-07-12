import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const freelancer = await prisma.freelancerProfile.findUnique({
      where: { userId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        portfolio: {
          include: {
            projects: true,
          },
        },
      },
    });

    if (!freelancer) {
      return NextResponse.json(
        { error: "Freelancer not found" },
        { status: 404 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { freelancerId: params.id },
      include: {
        project: {
          select: {
            title: true,
          },
        },
        client: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    const response = {
      ...freelancer,
      user: {
        ...freelancer.user,
        email:
          session.user.id === params.id ? freelancer.user.email : undefined,
      },
      reviews,
      averageRating,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching freelancer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
