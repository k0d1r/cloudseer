"use client";

import { useEffect, useState } from 'react';

type NamespaceData = {
  name: string;
  cpu: string;
  memory: string;
  cost: number;
  trend: string;
  trend_percent: number;
}

type ClusterMetric = {
  cluster_name: string;
  nodes: number;
  total_cost: number;
  efficiency_score: number;
  status: string;
  namespaces: NamespaceData[];
}

export default function Clusters() {
  const [clusters, setClusters] = useState<ClusterMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clusters')
      .then(res => res.json())
      .then(data => {
        setClusters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to connect to API Gateway", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="page-header"><h1 className="page-title">Loading live data from Go Data-Collector...</h1></div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kubernetes Clusters</h1>
          <div className="page-subtitle">June 2026 • Real-time topology and resource allocation across environments.</div>
        </div>
        <button className="btn btn-primary">Add Cluster</button>
      </div>

      <div className="flex-col gap-4">
        {clusters.map((cluster, idx) => (
          <div key={idx} className="glass-card">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{margin: 0}}>{cluster.cluster_name}</h3>
              <div className={`badge ${cluster.status === 'Healthy' ? 'badge-green' : 'badge-purple'}`}>
                {cluster.status}
              </div>
            </div>
            <div className="grid-cols-3 mb-6">
              <div>
                <div className="stat-label mb-1">Nodes</div>
                <div className="stat-value" style={{fontSize: '1.5rem'}}>{cluster.nodes}</div>
              </div>
              <div>
                <div className="stat-label mb-1">Total Cost / Mo</div>
                <div className="stat-value" style={{fontSize: '1.5rem'}}>${cluster.total_cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              <div>
                <div className="stat-label mb-1">Efficiency Score</div>
                <div className="stat-value" style={{fontSize: '1.5rem', color: cluster.efficiency_score > 70 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
                  {cluster.efficiency_score}/100
                </div>
              </div>
            </div>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Namespace</th>
                  <th>CPU Req/Lim</th>
                  <th>Mem Req/Lim</th>
                  <th>Monthly Cost</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {cluster.namespaces.map((ns, i) => (
                  <tr key={i}>
                    <td style={{color: 'var(--accent-blue)'}}>{ns.name}</td>
                    <td>{ns.cpu}</td>
                    <td>{ns.memory}</td>
                    <td>${ns.cost.toLocaleString()}</td>
                    <td className={ns.trend === 'up' ? 'trend-up' : 'trend-down'}>
                      {ns.trend === 'up' ? '↑' : '↓'} {ns.trend_percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
