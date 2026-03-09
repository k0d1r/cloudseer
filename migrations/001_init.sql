-- TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Cluster kayıt
CREATE TYPE provider_enum AS ENUM ('aws', 'gcp', 'azure', 'on-prem');

CREATE TABLE clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider provider_enum,
    region VARCHAR(100),
    kubernetes_version VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saatlik maliyet verileri (TimescaleDB hypertable)
CREATE TABLE cost_hourly (
    time TIMESTAMPTZ NOT NULL,
    cluster_id UUID REFERENCES clusters(id),
    namespace VARCHAR(255),
    workload_name VARCHAR(255),
    workload_type VARCHAR(50),
    cpu_cost DECIMAL(12,6),
    memory_cost DECIMAL(12,6),
    storage_cost DECIMAL(12,6),
    network_cost DECIMAL(12,6),
    gpu_cost DECIMAL(12,6),
    total_cost DECIMAL(12,6),
    currency VARCHAR(3) DEFAULT 'USD'
);
SELECT create_hypertable('cost_hourly', 'time');

-- Tahminler
CREATE TYPE forecast_type_enum AS ENUM ('7d', '30d', '90d', '365d');

CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES clusters(id),
    forecast_type forecast_type_enum,
    target_date DATE NOT NULL,
    p10_cost DECIMAL(12,2),
    p50_cost DECIMAL(12,2),
    p90_cost DECIMAL(12,2),
    model_version VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomaliler
CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES clusters(id),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    anomaly_type VARCHAR(100),
    severity severity_enum,
    description TEXT,
    affected_resource JSONB,
    cost_impact DECIMAL(12,2),
    resolved_at TIMESTAMPTZ,
    resolution JSONB
);
