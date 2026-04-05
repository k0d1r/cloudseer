import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database with realistic K8s & FinOps metrics...");

  // 1. Seed Clusters and Namespaces
  await prisma.cluster.create({
    data: {
      cluster_name: "eks-prod-us-east-1",
      nodes: 124,
      total_cost: 42850.50,
      efficiency_score: 94,
      status: "Healthy",
      namespaces: {
        create: [
          { name: "payment-gateway", cpu: "240 / 300 Cores", memory: "1.2 / 1.5 TB", cost: 18400.0, trend: "down", trend_percent: 2.1 },
          { name: "user-service", cpu: "110 / 150 Cores", memory: "512 / 800 GB", cost: 9200.0, trend: "up", trend_percent: 5.4 },
          { name: "ml-inference", cpu: "12x A100 GPUs", memory: "2.0 / 2.0 TB", cost: 15250.0, trend: "down", trend_percent: 1.0 },
        ]
      }
    }
  });

  await prisma.cluster.create({
    data: {
      cluster_name: "aks-staging-eu-west",
      nodes: 48,
      total_cost: 12400.0,
      efficiency_score: 42,
      status: "Overprovisioned",
      namespaces: {
        create: [
          { name: "frontend-stg", cpu: "12 / 60 Cores", memory: "64 / 256 GB", cost: 3100.0, trend: "up", trend_percent: 12.4 },
          { name: "backend-stg", cpu: "40 / 200 Cores", memory: "128 / 512 GB", cost: 9300.0, trend: "up", trend_percent: 18.2 },
        ]
      }
    }
  });

  // 2. Seed Forecast Data
  await prisma.forecast.create({
    data: {
      model_name: "LSTM Deep Learning",
      confidence: 94,
      mape: 2.4,
      rmse: 420.5,
      trajectories: {
        create: [
          { month: "Jan", value: 12000.0, is_predicted: false },
          { month: "Feb", value: 13200.0, is_predicted: false },
          { month: "Mar", value: 15000.0, is_predicted: false },
          { month: "Apr", value: 17400.0, is_predicted: true },
          { month: "May", value: 20400.0, is_predicted: true },
          { month: "Jun", value: 24000.0, is_predicted: true },
        ]
      }
    }
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
