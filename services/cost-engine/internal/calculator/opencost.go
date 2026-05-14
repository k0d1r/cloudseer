package calculator

type OpenCostModel struct {}

func (m *OpenCostModel) CalculateNamespaceCost(namespace string) float64 {
	return 45.50
}
