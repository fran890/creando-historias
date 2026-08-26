import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { autoApprove: true },
  });

  return NextResponse.json(
    {
      user: {
        ...session,
        autoApprove: user?.autoApprove === true,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
