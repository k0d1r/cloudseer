-- CloudSeer TimescaleDB Configurations

-- Enable TimescaleDB extension if not already enabled
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert cost_hourly to a hypertable if it isn't already
-- Note: In 001_init.sql we already have: SELECT create_hypertable('cost_hourly', 'time');
-- This file is for advanced TimescaleDB policies.

-- Create a continuous aggregate for daily cost rollups
CREATE MATERIALIZED VIEW IF NOT EXISTS cost_daily
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS bucket,
       cluster_id,
       namespace,
       workload_name,
       SUM(total_cost) as total_cost
FROM cost_hourly
GROUP BY bucket, cluster_id, namespace, workload_name;

-- Add a retention policy: keep raw hourly data for 90 days
SELECT add_retention_policy('cost_hourly', INTERVAL '90 days');

-- Add a retention policy: keep daily aggregated data for 2 years
SELECT add_retention_policy('cost_daily', INTERVAL '2 years');
