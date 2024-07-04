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
      companyName,
      industry,
      description,
      website,
      location,
      phoneNumber,
    } = await req.json();

    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: session.user.id },
      data: {
        companyName,
        industry,
        description,
        website,
        location,
        phoneNumber,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
