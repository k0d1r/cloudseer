import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clusters = await prisma.cluster.findMany({
      include: { namespaces: true }
    });
    return NextResponse.json(clusters);
  } catch (error) {
    console.error("Failed to fetch clusters from DB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
