export default function DashboardOverview() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">FinOps Overview</h1>
          <div className="page-subtitle">June 2026 Performance</div>
        </div>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      <div className="grid-main-side">
        <div className="flex-col gap-4">
          <div className="glass-card">
            <h3 className="mb-4">Predictive Cost Forecast (LSTM)</h3>
            <div className="chart-container">
              <div className="chart-bar" style={{ height: '30%' }}><span className="chart-label">Jan</span></div>
              <div className="chart-bar" style={{ height: '50%' }}><span className="chart-label">Feb</span></div>
              <div className="chart-bar" style={{ height: '40%' }}><span className="chart-label">Mar</span></div>
              <div className="chart-bar predicted" style={{ height: '60%' }}><span className="chart-label">Apr</span></div>
              <div className="chart-bar predicted" style={{ height: '80%' }}><span className="chart-label">May</span></div>
              <div className="chart-bar predicted" style={{ height: '90%' }}><span className="chart-label">Jun</span></div>
            </div>
          </div>

          <h3 className="mt-6 mb-4">Optimization Recommendations</h3>
          <div className="grid-cols-2">
            <div className="glass-card">
              <div className="flex justify-between items-center mb-2">
                <div className="badge badge-blue">RDS</div>
                <span className="stat-value" style={{fontSize: '1.5rem'}}>$1.8k/mo</span>
              </div>
              <p>Reduce Idle RDS Instances</p>
            </div>
            <div className="glass-card">
              <div className="flex justify-between items-center mb-2">
                <div className="badge badge-purple">EKS</div>
                <span className="stat-value" style={{fontSize: '1.5rem'}}>$950/mo</span>
              </div>
              <p>Resize EKS node-group</p>
            </div>
          </div>
        </div>

        <div className="flex-col gap-4">
          <div className="glass-card stat-card">
            <div className="stat-label">Current Month Spend</div>
            <div className="stat-value">$84,320</div>
            <div className="stat-trend trend-up">↑ +4.5% vs last month</div>
          </div>

          <div className="glass-card stat-card" style={{borderColor: 'rgba(248, 81, 73, 0.3)'}}>
            <div className="flex justify-between items-center">
              <div className="stat-label">Total Waste</div>
              <div className="badge badge-red">-8.1%</div>
            </div>
            <div className="stat-value">$4,200</div>
            <div className="stat-trend">Optimizable Idle Resources</div>
          </div>

          <div className="glass-card stat-card">
            <div className="flex justify-between items-center">
              <div className="stat-label">Active Clusters</div>
              <div className="badge badge-green">+1</div>
            </div>
            <div className="stat-value">12</div>
            <div className="stat-trend">Managed EKS/AKS</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-label">Projected Month End</div>
            <div className="stat-value">$158,500</div>
            <div className="stat-trend">LSTM Model Prediction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
