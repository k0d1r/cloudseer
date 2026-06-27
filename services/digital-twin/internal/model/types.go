package model

import "time"

// TimeSeriesData represents historical usage metrics.
type TimeSeriesData struct {
	Timestamps []time.Time
	Values     []float64
}

// HPAConfig represents the Horizontal Pod Autoscaler configuration.
type HPAConfig struct {
	MinReplicas int
	MaxReplicas int
	TargetCPU   int // Percentage
	TargetMem   int // Percentage
}

// WorkloadModel represents a deployment/statefulset in the Digital Twin.
type WorkloadModel struct {
	Name            string
	Namespace       string
	CPURequest      int // In millicores
	MemoryRequest   int // In MiB
	ReplicaCount    int
	HPAConfig       *HPAConfig
	HistoricalUsage TimeSeriesData
	CostPerHour     float64
}

// NodeModel represents a physical/virtual node in the Digital Twin.
type NodeModel struct {
	InstanceType    string
	Region          string
	CurrentPrice    float64
	SpotPrice       float64
	CPUCapacity     int // In millicores
	MemoryCapacity  int // In MiB
	AllocatedCPU    int
	AllocatedMemory int
	Utilization     TimeSeriesData
}

// CostModel and other supporting models
type CostModel struct {
	TotalHourlyCost float64
}

type NetworkModel struct {
	EgressBytesPerSec float64
}

type StorageModel struct {
	AllocatedGiB int
}

// ClusterModel represents the entire Kubernetes cluster state for simulation.
type ClusterModel struct {
	Nodes        []NodeModel
	Workloads    []WorkloadModel
	CostModel    CostModel
	NetworkModel NetworkModel
	StorageModel StorageModel
}
