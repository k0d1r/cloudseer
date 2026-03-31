import { GET } from './route';

describe('Clusters API Route', () => {
  it('should return mock Kubernetes clusters data', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Validate data structure
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    
    // Validate first cluster (EKS)
    expect(data[0].cluster_name).toBe("eks-prod-us-east-1");
    expect(data[0].status).toBe("Healthy");
    expect(data[0].namespaces.length).toBe(3);
    
    // Validate second cluster (AKS)
    expect(data[1].cluster_name).toBe("aks-staging-eu-west");
    expect(data[1].status).toBe("Overprovisioned");
    expect(data[1].namespaces.length).toBe(2);
  });
});
