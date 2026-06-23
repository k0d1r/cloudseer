package risk

import (
	"log"
	"strings"

	"github.com/k0d1r/cloudseer/services/agent-core/internal/action"
)

type Scorer struct{}

func NewScorer() *Scorer {
	return &Scorer{}
}

// Score assigns a risk value between 0 and 100
// 0-20: Automatic execution (Safe)
// 21-60: Requires human approval (Medium Risk)
// >60: High risk, manual only
func (s *Scorer) Score(req action.Request) float64 {
	baseScore := 10.0

	// Mock Risk logic
	if strings.Contains(req.Resource, "prod") || strings.Contains(req.Resource, "payment") {
		baseScore += 50.0 // High risk for prod/payment workloads
	} else if strings.Contains(req.Resource, "dev") || strings.Contains(req.Resource, "test") {
		baseScore -= 5.0  // Low risk for dev/test
	}

	if req.Type == "DeleteNodePool" {
		baseScore += 40.0
	} else if req.Type == "ScaleDown" {
		baseScore += 10.0
	}

	// Clamp to 0-100
	if baseScore > 100 {
		return 100
	}
	if baseScore < 0 {
		return 0
	}

	log.Printf("RiskScorer: Evaluated %s on %s -> Risk Score: %.1f", req.Type, req.Resource, baseScore)
	return baseScore
}
