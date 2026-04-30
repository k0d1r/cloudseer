package main

import (
	"io"
	"log"
	"net/http"
)

func proxyRequest(targetURL string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		resp, err := http.Get(targetURL)
		if err != nil {
			http.Error(w, "Failed to connect to backend service", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		w.Header().Set("Content-Type", "application/json")
		io.Copy(w, resp.Body)
	}
}

func main() {
	mux := http.NewServeMux()

	// Route to Go Data Collector
	mux.HandleFunc("/api/clusters", proxyRequest("http://localhost:8081/api/v1/metrics/clusters"))
	
	// Route to Python Forecast Engine
	mux.HandleFunc("/api/forecasts", proxyRequest("http://localhost:8000/api/v1/forecast/gpu-cost"))

	// Route to mock endpoints for overview and simulate (to simulate digital-twin)
	mux.HandleFunc("/api/overview", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"current_spend": 84320, "waste": 4200, "clusters": 12, "projected": 158500}`))
	})

	log.Println("API Gateway running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
