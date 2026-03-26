import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'CloudSeer Dashboard',
  description: 'Kubernetes FinOps & AI Cost Optimization',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BulutKâhini - FinOps Platform</title>
      </head>
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <div className="logo">
              <div className="logo-icon">🔮</div>
              BulutKâhini
            </div>
            <nav className="nav-links">
              <Link href="/" className="nav-link">📊 Overview</Link>
              <Link href="/clusters" className="nav-link">☁️ Clusters</Link>
              <Link href="/forecasts" className="nav-link">📈 Forecasts</Link>
              <Link href="/simulate" className="nav-link">🧪 Simulate</Link>
              <Link href="/agent" className="nav-link">🤖 Agent Actions</Link>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
