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
      companyName,
      industry,
      description,
      website,
      location,
      phoneNumber,
    } = await req.json();

    const clientProfile = await prisma.clientProfile.create({
      data: {
        userId: session.user.id,
        companyName,
        industry,
        description,
        website,
        location,
        phoneNumber,
      },
    });
    return NextResponse.json({ success: true, profile: clientProfile });
  } catch (error) {
    console.error("Error creating client profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
