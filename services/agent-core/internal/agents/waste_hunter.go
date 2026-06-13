package agents

import (
	"database/sql"
	"log"

	"github.com/k0d1r/cloudseer/services/agent-core/internal/action"
	"github.com/k0d1r/cloudseer/services/agent-core/internal/risk"
)

type WasteHunter struct {
	db       *sql.DB
	scorer   *risk.Scorer
	executor *action.Executor
}

func NewWasteHunter(db *sql.DB) *WasteHunter {
	return &WasteHunter{
		db:       db,
		scorer:   risk.NewScorer(),
		executor: action.NewExecutor(db),
	}
}

func (w *WasteHunter) RunCycle() {
	if w.db == nil {
		log.Println("WasteHunter: No DB connection. Mocking cycle.")
		return
	}

	// 1. Detect Zombie Workloads
	w.detectZombies()
	
	// 2. Detect Unused Namespaces
	w.detectUnusedNamespaces()
}

func (w *WasteHunter) detectZombies() {
	log.Println("WasteHunter: Scanning for Zombie workloads (CPU < 0.05 for 24h)...")
	// Mock logic for demonstration:
	// In reality, this queries `cost_hourly` or prometheus data.
	
	zombieFound := true // mock flag
	if zombieFound {
		workloadName := "old-payment-service-v1"
		log.Printf("WasteHunter: Found Zombie workload: %s", workloadName)
		
		actionReq := action.Request{
			Type:        "ScaleDown",
			Resource:    workloadName,
			Description: "Workload has < 5% CPU usage for 24 hours.",
		}
		
		riskScore := w.scorer.Score(actionReq)
		actionReq.RiskScore = riskScore
		
		w.executor.Execute(actionReq)
	}
}

func (w *WasteHunter) detectUnusedNamespaces() {
	log.Println("WasteHunter: Scanning for empty/unused namespaces...")
	// Logic to check namespaces with 0 cost over 7 days.
}
