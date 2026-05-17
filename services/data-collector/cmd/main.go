package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"
)

type ClusterMetric struct {
	ClusterName string  `json:"cluster_name"`
	Nodes       int     `json:"nodes"`
	TotalCost   float64 `json:"total_cost"`
	Efficiency  int     `json:"efficiency_score"`
	Status      string  `json:"status"`
	Namespaces  []NamespaceData `json:"namespaces"`
}

type NamespaceData struct {
	Name        string  `json:"name"`
	CPU         string  `json:"cpu"`
	Memory      string  `json:"memory"`
	Cost        float64 `json:"cost"`
	Trend       string  `json:"trend"`
	TrendPercent float64 `json:"trend_percent"`
}

func main() {
	rand.Seed(time.Now().UnixNano())

	http.HandleFunc("/api/v1/metrics/clusters", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		
		// Generate dynamic realistic data
		clusters := []ClusterMetric{
			{
				ClusterName: "eks-prod-us-east-1",
				Nodes:       124 + rand.Intn(5) - 2,
				TotalCost:   42850.0 + (rand.Float64() * 500),
				Efficiency:  92 + rand.Intn(5),
				Status:      "Healthy",
				Namespaces: []NamespaceData{
					{Name: "payment-gateway", CPU: "240 / 300 Cores", Memory: "1.2 / 1.5 TB", Cost: 18400.0 + rand.Float64()*100, Trend: "down", TrendPercent: 2.1},
					{Name: "user-service", CPU: "110 / 150 Cores", Memory: "512 / 800 GB", Cost: 9200.0, Trend: "up", TrendPercent: 5.4},
					{Name: "ml-inference", CPU: "12x A100 GPUs", Memory: "2.0 / 2.0 TB", Cost: 15250.0, Trend: "down", TrendPercent: 1.0},
				},
			},
			{
				ClusterName: "aks-staging-eu-west",
				Nodes:       48 + rand.Intn(2),
				TotalCost:   12400.0 + (rand.Float64() * 200),
				Efficiency:  42 + rand.Intn(8),
				Status:      "Overprovisioned",
				Namespaces: []NamespaceData{
					{Name: "frontend-stg", CPU: "12 / 60 Cores", Memory: "64 / 256 GB", Cost: 3100.0, Trend: "up", TrendPercent: 12.4},
					{Name: "backend-stg", CPU: "40 / 200 Cores", Memory: "128 / 512 GB", Cost: 9300.0, Trend: "up", TrendPercent: 18.2},
				},
			},
		}

		json.NewEncoder(w).Encode(clusters)
	})

	log.Println("Data Collector Service running on port 8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
