package simulator

import (
	"log"
	"math"
)

type SimulationRequest struct {
	ClusterID    string
	ScenarioType string
	Parameters   map[string]interface{}
}

type SimulationResult struct {
	CostDelta         float64
	PerformanceImpact string
	RiskScore         float64
	Timeline          []string
}

type Engine struct {
	// In a real app, this holds the cluster state cache (from Redis)
}

func NewEngine() *Engine {
	return &Engine{}
}

func (e *Engine) Simulate(req SimulationRequest) *SimulationResult {
	log.Printf("DigitalTwin: Running simulation for %s (Type: %s)", req.ClusterID, req.ScenarioType)

	result := &SimulationResult{
		Timeline: []string{"Simulation started", "Applying state mutations", "Running forward projection"},
	}

	// Mock logic based on Report Phase 6
	if req.ScenarioType == "ReplicaScale" {
		currentReplicas := 3.0
		targetReplicas, _ := req.Parameters["target_replicas"].(float64)
		
		delta := targetReplicas - currentReplicas
		
		// Mock calculation: 1 replica = $5/month
		result.CostDelta = delta * 5.0
		if delta > 0 {
			result.PerformanceImpact = "Increased capacity. Node pressure might increase."
			result.RiskScore = 15.0
			result.Timeline = append(result.Timeline, "Added replicas -> Capacity checked -> No new nodes required")
		} else {
			result.PerformanceImpact = "Reduced capacity. Potential latency spikes during peak."
			result.RiskScore = 45.0
			result.Timeline = append(result.Timeline, "Removed replicas -> Risk of SLA violation increased")
		}
	} else if req.ScenarioType == "InstanceTypeChange" {
		// Mock: migrating from m5.xlarge to m6i.xlarge
		result.CostDelta = -2400.0 // Saves money
		result.PerformanceImpact = "+10% CPU speed"
		result.RiskScore = 10.0
		result.Timeline = append(result.Timeline, "Migrated nodes virtually -> Verified capacity -> Calculated savings")
	}

	// Round to 2 decimals
	result.CostDelta = math.Round(result.CostDelta*100) / 100

	log.Printf("DigitalTwin: Simulation completed. Cost Delta: $%.2f, Risk: %.1f", result.CostDelta, result.RiskScore)
	return result
}
