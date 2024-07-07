import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = params.id;

    const job = await prisma.project.findUnique({
      where: { id: jobId },
      include: {
        client: {
          include: {
            client: true,
          },
        },
        proposals: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const transformedJob = {
      ...job,
      client: {
        ...job.client,
        clientProfile: job.client.client,
      },
    };

    return NextResponse.json({ success: true, job: transformedJob });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
