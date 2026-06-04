package main

import (
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/k0d1r/cloudseer/services/agent-core/internal/agents"
	_ "github.com/lib/pq"
)

func main() {
	log.Println("KâhinAgent (Agent Core) started.")
	
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://admin:password123@postgres:5432/cloudseer?sslmode=disable"
	}
	
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("Warning: Could not connect to DB (%v)", err)
	} else {
		defer db.Close()
		log.Println("Connected to PostgreSQL.")
	}

	wasteHunter := agents.NewWasteHunter(db)

	// Agent orchestration loop
	for {
		log.Println("KâhinAgent: Running WasteHunter cycle...")
		wasteHunter.RunCycle()
		time.Sleep(60 * time.Second)
	}
}
