"use client";

import { useEffect, useState } from 'react';

type ForecastData = {
  month: string;
  value: number;
  is_predicted: boolean;
}

type ForecastResponse = {
  model_name: string;
  confidence: number;
  mape: number;
  rmse: number;
  trajectory: ForecastData[];
}

export default function Forecasts() {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/forecasts')
      .then(res => res.json())
      .then(data => {
        setForecast(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to connect to API Gateway", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="page-header"><h1 className="page-title">Loading live predictions from Python Forecast-Engine...</h1></div>;
  }

  if (!forecast) return <div>Failed to load forecast data.</div>;

  // Find max value to scale chart bars relatively
  const maxVal = Math.max(...forecast.trajectory.map(d => d.value));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Predictive Cost Forecasts</h1>
          <div className="page-subtitle">{forecast.model_name} • Live Predictions</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">Meta Prophet</button>
          <button className="btn btn-primary">{forecast.model_name}</button>
        </div>
      </div>

      <div className="grid-main-side">
        <div className="flex-col gap-4">
          <div className="glass-card">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{margin: 0}}>AI/GPU Cost Trajectory</h3>
              <div className="badge badge-purple">High Confidence ({forecast.confidence}%)</div>
            </div>
            
            <div className="chart-container mb-4" style={{height: '200px'}}>
              {forecast.trajectory.map((point, idx) => {
                const heightPct = (point.value / maxVal) * 90;
                return (
                  <div key={idx} className={`chart-bar ${point.is_predicted ? 'predicted' : ''}`} 
                       style={{ 
                         height: `${heightPct}%`, 
                         background: point.is_predicted ? undefined : 'linear-gradient(180deg, var(--accent-purple) 0%, transparent 100%)' 
                       }}>
                    <span className="chart-label">{point.month}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-secondary" style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
              Our {forecast.model_name} model detected a non-linear spike in GPU instance requests. 
              The projected peak is ${(forecast.trajectory[forecast.trajectory.length-1].value).toLocaleString(undefined, {maximumFractionDigits:0})} by {forecast.trajectory[forecast.trajectory.length-1].month}.
            </p>
          </div>

          <div className="glass-card">
            <h3 className="mb-4">Top Cost Drivers (Predicted 90-Day Impact)</h3>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Resource Category</th>
                  <th>Current Run Rate</th>
                  <th>Predicted Run Rate</th>
                  <th>Anomaly Detection</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AWS EC2 (Spot)</td>
                  <td>$12,400/mo</td>
                  <td>$13,100/mo</td>
                  <td><div className="badge badge-green">Normal</div></td>
                </tr>
                <tr>
                  <td>Azure AKS Node Pools</td>
                  <td>$8,200/mo</td>
                  <td>$14,500/mo</td>
                  <td><div className="badge badge-red">Anomaly Detected</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-col gap-4">
          <div className="glass-card stat-card">
            <div className="stat-label">Predicted Month-End</div>
            <div className="stat-value">${(forecast.trajectory[forecast.trajectory.length-1].value * 2).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            <div className="stat-trend trend-up">↑ Exceeding budget limit</div>
          </div>

          <div className="glass-card">
            <h3 className="mb-4">Model Accuracy metrics</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="stat-label">MAPE (Mean Absolute Pct Error)</span>
                <span style={{color: 'var(--accent-green)', fontWeight: 'bold'}}>{forecast.mape}%</span>
              </div>
              <div style={{width: '100%', height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px'}}>
                <div style={{width: `${100 - forecast.mape}%`, height: '100%', background: 'var(--accent-green)', borderRadius: '2px'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="stat-label">RMSE (Root Mean Square Error)</span>
                <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>${forecast.rmse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
