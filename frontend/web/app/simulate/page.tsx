"use client";
import { useState } from 'react';

export default function Simulate() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [progress, setProgress] = useState(0);

  const runSimulation = () => {
    setIsSimulating(true);
    setHasSimulated(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setHasSimulated(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5; // Random progress jumps
      });
    }, 300);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Twin Simulator</h1>
          <div className="page-subtitle">Test 'What-If' scenarios against your cluster's digital twin without affecting production.</div>
        </div>
      </div>

      <div className="grid-main-side">
        <div className="glass-card">
          <h3 className="mb-4">Scenario Configuration</h3>
          
          <div className="mb-4">
            <label className="stat-label block mb-2">Target Cluster</label>
            <select className="btn btn-secondary w-full" style={{width: '100%', textAlign: 'left'}}>
              <option>eks-prod-us-east-1 (v1.28.4)</option>
              <option>aks-staging-eu-west (v1.27.9)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="stat-label block mb-2">Action</label>
            <div className="glass-card p-4" style={{borderColor: 'var(--accent-purple)'}}>
              <h4 className="mb-2">Migrate all nodes to Spot Instances</h4>
              <p className="text-secondary" style={{color: 'var(--text-secondary)'}}>Simulate migrating all eligible non-critical deployments to preemptible AWS/Azure Spot Instances.</p>
            </div>
          </div>

          <button 
            className="btn btn-primary w-full" 
            style={{width: '100%', padding: '1rem', opacity: isSimulating ? 0.7 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer'}}
            onClick={runSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? `Running Engine... ${Math.min(progress, 100)}%` : "🚀 Run Simulation"}
          </button>
        </div>

        <div className="flex-col gap-4">
          <div className="glass-card" style={{ minHeight: '350px' }}>
            <h3 className="mb-4">Simulation Results</h3>
            
            {!hasSimulated && !isSimulating && (
              <div className="flex items-center justify-center h-full" style={{minHeight: '200px'}}>
                <p style={{color: 'var(--text-secondary)'}}>Run a simulation to see the estimated impact.</p>
              </div>
            )}

            {isSimulating && (
              <div className="flex-col items-center justify-center h-full" style={{minHeight: '200px', display: 'flex', gap: '1rem'}}>
                <div style={{
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid var(--border-color)', 
                  borderTopColor: 'var(--accent-purple)', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p style={{color: 'var(--accent-purple)'}}>Spinning up digital twin environment...</p>
                <div style={{width: '100%', height: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden'}}>
                  <div style={{width: `${progress}%`, height: '100%', backgroundColor: 'var(--accent-purple)', transition: 'width 0.3s ease'}}></div>
                </div>
              </div>
            )}

            {hasSimulated && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div className="flex justify-between items-center mb-6">
                  <div className="stat-label">Safety Status</div>
                  <div className="badge badge-green">Safe to Execute</div>
                </div>

                <div className="mb-6">
                  <div className="stat-label mb-2">Risk Score</div>
                  <div className="flex items-end gap-2">
                    <span className="stat-value" style={{color: 'var(--accent-green)'}}>12</span>
                    <span className="stat-label" style={{marginBottom: '10px'}}>/ 100</span>
                  </div>
                  <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Very low risk of interruption for selected deployments. Fallback to On-Demand instances is guaranteed.</p>
                </div>

                <div className="mb-6">
                  <div className="stat-label mb-2">Estimated Cost Delta</div>
                  <span className="stat-value" style={{color: 'var(--accent-green)'}}>-$4,520.45</span>
                  <span className="stat-label"> / month</span>
                </div>

                <button className="btn btn-secondary w-full" style={{width: '100%', borderColor: 'var(--accent-green)', color: 'var(--accent-green)'}}>
                  Apply to Production via Terraform
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
