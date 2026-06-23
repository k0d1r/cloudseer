package action

import (
	"database/sql"
	"log"
)

type Request struct {
	Type        string
	Resource    string
	Description string
	RiskScore   float64
}

type Executor struct {
	db *sql.DB
}

func NewExecutor(db *sql.DB) *Executor {
	return &Executor{db: db}
}

func (e *Executor) Execute(req Request) {
	status := "pending"
	if req.RiskScore < 20 {
		status = "approved" // Automate low risk
		log.Printf("ActionExecutor: Auto-approving safe action %s on %s", req.Type, req.Resource)
		// Perform k8s API execution...
	} else if req.RiskScore > 60 {
		status = "pending"
		log.Printf("ActionExecutor: High risk action %s. Escalating for manual review.", req.Type)
	} else {
		status = "pending"
		log.Printf("ActionExecutor: Medium risk action %s. Flagged for review.", req.Type)
	}

	if e.db != nil {
		query := `INSERT INTO agent_actions 
			(cluster_id, action_type, resource_reference, risk_score, status) 
			VALUES ($1, $2, $3, $4, $5)`
		
		// In a real app, resource_reference would be proper JSON.
		resourceJSON := `{"name": "` + req.Resource + `"}`
		
		_, err := e.db.Exec(query, "prod-cluster-1", req.Type, resourceJSON, req.RiskScore, status)
		if err != nil {
			log.Printf("ActionExecutor: Failed to save action to DB: %v", err)
		} else {
			log.Printf("ActionExecutor: Action saved with status: %s", status)
		}
	}
}
