export default function AgentActions() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Autonomous Agent Actions</h1>
          <div className="page-subtitle">Review and approve actions recommended by the KâhinAgent optimization models.</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="stat-label">Autopilot Status</div>
          <div className="badge badge-purple">Semi-Autonomous</div>
        </div>
      </div>

      <div className="flex-col gap-4">
        <div className="glass-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="logo-icon" style={{background: 'var(--accent-red)'}}>⚠️</div>
              <div>
                <h3 style={{margin: 0}}>Scale Down `payment-processing-stg`</h3>
                <span className="stat-label">Waste Hunter Agent</span>
              </div>
            </div>
            <div className="badge badge-red">High Priority</div>
          </div>
          
          <div className="grid-cols-3 mb-6">
            <div>
              <div className="stat-label mb-1">Reason</div>
              <p>CPU utilization &lt; 5% for 48 hours.</p>
            </div>
            <div>
              <div className="stat-label mb-1">Risk Score</div>
              <p style={{color: 'var(--accent-green)', fontWeight: 'bold'}}>5 / 100 (Safe)</p>
            </div>
            <div>
              <div className="stat-label mb-1">Monthly Savings</div>
              <p style={{color: 'var(--accent-green)', fontWeight: 'bold'}}>$1,250</p>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button className="btn btn-secondary">Reject</button>
            <button className="btn btn-primary" style={{background: 'var(--accent-green)'}}>Approve & Execute</button>
          </div>
        </div>

        <div className="glass-card" style={{opacity: 0.7}}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="logo-icon" style={{background: 'var(--accent-blue)'}}>🔄</div>
              <div>
                <h3 style={{margin: 0}}>Convert `batch-jobs` to Spot</h3>
                <span className="stat-label">Spot Optimizer Agent</span>
              </div>
            </div>
            <div className="badge badge-blue">Executed Automatically</div>
          </div>
          
          <div className="grid-cols-3">
            <div>
              <div className="stat-label mb-1">Status</div>
              <p style={{color: 'var(--accent-blue)'}}>Successfully Applied (2h ago)</p>
            </div>
            <div>
              <div className="stat-label mb-1">Risk Score</div>
              <p>12 / 100</p>
            </div>
            <div>
              <div className="stat-label mb-1">Monthly Savings</div>
              <p style={{color: 'var(--accent-green)'}}>$840</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
