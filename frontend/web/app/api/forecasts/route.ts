import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const forecast = await prisma.forecast.findFirst({
      include: { trajectories: true }
    });

    if (!forecast) {
      return NextResponse.json({ error: "No forecast found" }, { status: 404 });
    }

    // Map Prisma schema to expected JSON format
    return NextResponse.json({
      model_name: forecast.model_name,
      confidence: forecast.confidence,
      mape: forecast.mape,
      rmse: forecast.rmse,
      trajectory: forecast.trajectories
    });
  } catch (error) {
    console.error("Failed to fetch forecast from DB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
