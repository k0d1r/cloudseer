package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/nats-io/nats.go"
)

type MetricPayload struct {
	ClusterID   string    `json:"cluster_id"`
	Namespace   string    `json:"namespace"`
	Workload    string    `json:"workload"`
	CPUUsage    float64   `json:"cpu_usage"`
	MemoryUsage float64   `json:"memory_usage"`
	Timestamp   time.Time `json:"timestamp"`
}

func main() {
	log.Println("Cost Engine started.")
	
	// Postgres connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://admin:password123@postgres:5432/cloudseer?sslmode=disable"
	}
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("Warning: Could not connect to DB (%v)", err)
	} else {
		defer db.Close()
		log.Println("Connected to PostgreSQL (TimescaleDB).")
	}

	// NATS connection
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = "nats://nats:4222"
	}
	nc, err := nats.Connect(natsURL)
	if err != nil {
		log.Printf("Warning: Could not connect to NATS (%v)", err)
	} else {
		defer nc.Close()
		log.Println("Connected to NATS JetStream.")
		
		nc.Subscribe("metrics.raw", func(m *nats.Msg) {
			var payload MetricPayload
			json.Unmarshal(m.Data, &payload)
			
			// Mock pricing (OpenCost logic): CPU = $0.03/core/hr, RAM = $0.004/GB/hr
			cpuCost := payload.CPUUsage * 0.03
			memCost := payload.MemoryUsage * 0.004
			totalCost := cpuCost + memCost
			
			log.Printf("Calculated cost for %s: $%.4f", payload.Workload, totalCost)
			
			if db != nil {
				// Insert into TimescaleDB
				query := `INSERT INTO cost_hourly 
					(time, namespace, workload_name, cpu_cost, memory_cost, total_cost) 
					VALUES ($1, $2, $3, $4, $5, $6)`
				_, err = db.Exec(query, payload.Timestamp, payload.Namespace, payload.Workload, cpuCost, memCost, totalCost)
				if err != nil {
					log.Printf("Failed to insert cost data: %v", err)
				}
			}
		})
	}

	// Keep alive
	select {}
}
