package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/k0d1r/cloudseer/services/digital-twin/internal/simulator"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	engine := simulator.NewEngine()
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/simulate", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req simulator.SimulationRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		result := engine.Simulate(req)
		
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	log.Printf("Digital Twin Service started on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
