# BulutKâhini Functional MVP Implementation Plan

The goal is to transition the project from a UI mockup to a fully functional microservice architecture that proves the mathematical and logical functions of the system work.

## User Review Required
> [!IMPORTANT]
> Your machine does not have a local Kubernetes cluster installed (`kubectl` command is missing). Therefore, to prove the system works, I will build a **Kubernetes State Simulator** inside the `data-collector` service. This simulator will generate live, dynamic cluster metrics (Nodes, Pods, CPU/Mem usage) in real-time. The rest of the microservices (Cost Engine, AI Forecast Engine, API Gateway) will process this live data just as they would a real cluster. Is this approach acceptable?

## Proposed Changes

### Backend Infrastructure (Go)
- **API Gateway (`services/api-gateway`)**
  - Implement a real Gin-Gonic HTTP server routing requests to downstream microservices.
- **Data Collector (`services/data-collector`)**
  - Implement a K8s Simulator that generates dynamic cluster topology and usage metrics.
- **Cost Engine (`services/cost-engine`)**
  - Implement real allocation algorithms to calculate costs based on the live simulated metrics.
- **Digital Twin & Agent Core (`services/digital-twin`, `services/agent-core`)**
  - Implement mathematical logic to calculate risk scores and cost deltas for "What-If" scenarios.

### AI Engine (Python)
- **Forecast Engine (`services/forecast-engine`)**
  - Implement a real FastAPI server.
  - Implement a basic LSTM/Prophet mathematical model that takes historical cost arrays and outputs future predictions using `numpy`/`scikit-learn`/`prophet`.

### Frontend (Next.js)
- **Dynamic Data Fetching**
  - Remove all hardcoded mock data from the React components.
  - Implement `useEffect` hooks and `fetch` API calls to hit the API Gateway endpoints.
  - Render the UI dynamically based on the live backend responses.

### Orchestration
- **Docker Compose**
  - Create a complete `docker-compose.yml` to spin up the API Gateway, Go Services, and Python AI Engine simultaneously so everything communicates over the local network.

## Verification Plan
1. Start all backend microservices via `docker-compose up` or a local shell script.
2. Verify the terminal logs show services communicating (e.g., Cost Engine fetching from Data Collector).
3. Start the Next.js frontend.
4. Take screenshots of the Next.js frontend rendering the live, dynamically calculated data, proving the end-to-end data flow works.
