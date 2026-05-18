package prometheus

import "fmt"

func ScrapeMetrics(endpoint string) error {
	fmt.Printf("Scraping metrics from %s\n", endpoint)
	return nil
}
