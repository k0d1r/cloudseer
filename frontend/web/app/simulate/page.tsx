export default function Simulate() {
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
              <option>eks-prod-us-east-1</option>
              <option>aks-staging-eu</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="stat-label block mb-2">Action</label>
            <div className="glass-card p-4" style={{borderColor: 'var(--accent-purple)'}}>
              <h4 className="mb-2">Migrate all nodes to Spot Instances</h4>
              <p className="text-secondary" style={{color: 'var(--text-secondary)'}}>Simulate migrating all eligible non-critical deployments to preemptible AWS Spot Instances.</p>
            </div>
          </div>

          <button className="btn btn-primary w-full" style={{width: '100%', padding: '1rem'}}>
            🚀 Run Simulation
          </button>
        </div>

        <div className="flex-col gap-4">
          <div className="glass-card">
            <h3 className="mb-4">Simulation Results</h3>
            
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
              <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Very low risk of interruption for selected deployments.</p>
            </div>

            <div className="mb-6">
              <div className="stat-label mb-2">Estimated Cost Delta</div>
              <span className="stat-value" style={{color: 'var(--accent-green)'}}>-$4,500</span>
              <span className="stat-label"> / month</span>
            </div>

            <button className="btn btn-secondary w-full" style={{width: '100%', borderColor: 'var(--accent-green)', color: 'var(--accent-green)'}}>
              Apply to Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
