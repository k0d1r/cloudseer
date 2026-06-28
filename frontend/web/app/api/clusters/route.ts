import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import os from 'os';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clusters = await prisma.cluster.findMany({
      include: { namespaces: true }
    });

    // 1. Get Live Mac OS Metrics
    const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(1);
    const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(1);
    const usedMemGB = (os.totalmem() - os.freemem()) / (1024 ** 3);
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : "Apple Silicon";
    const cores = cpus.length;
    const loadAvg = os.loadavg()[0]; // 1 minute load average

    // 2. Construct Dynamic Live Cluster
    const localMacCluster = {
      cluster_name: `${os.hostname()} (Live Mac)`,
      nodes: 1,
      total_cost: 0.00, // Developer Mac has no monthly AWS cost
      efficiency_score: Math.max(0, 100 - Math.floor(loadAvg * 10)),
      status: "Local Dev",
      namespaces: [
        {
          name: "macOS-system",
          cpu: `${loadAvg.toFixed(2)} / ${cores} Cores`,
          memory: `${usedMemGB.toFixed(1)} Gi / ${totalMemGB} Gi`,
          cost: 0.00,
          trend: loadAvg > 2 ? "up" : "down",
          trend_percent: parseFloat((loadAvg * 10).toFixed(1))
        },
        {
          name: "docker-daemon",
          cpu: `${(loadAvg/2).toFixed(2)} / ${cores} Cores`,
          memory: `${(usedMemGB * 0.3).toFixed(1)} Gi / ${totalMemGB} Gi`,
          cost: 0.00,
          trend: "down",
          trend_percent: 1.5
        }
      ]
    };

    // 3. Prepend local cluster to the DB clusters
    const allClusters = [localMacCluster, ...clusters];

    return NextResponse.json(allClusters);
  } catch (error) {
    console.error("Failed to fetch clusters from DB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
