package slack

import "fmt"

func SendMessage(webhookURL, message string) error {
	fmt.Printf("Sending to Slack: %s\n", message)
	return nil
}
