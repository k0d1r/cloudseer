#!/bin/bash

echo "kadirssss BulutKâhini projesi başlatılıyor..."

kill $(lsof -t -i:8080) 2>/dev/null
kill $(lsof -t -i:8081) 2>/dev/null
kill $(lsof -t -i:8000) 2>/dev/null
kill $(lsof -t -i:3000) 2>/dev/null

echo "Data Collector başlatılıyor..."
cd services/data-collector
go run cmd/main.go &
DATA_PID=$!

echo "API Gateway başlatılıyor..."
cd ../api-gateway
go run cmd/main.go &
API_PID=$!

echo "Forecast Engine başlatılıyor..."
cd ../forecast-engine

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install fastapi uvicorn pydantic > /dev/null 2>&1

python3 main.py &
FORECAST_PID=$!

deactivate

cd ../../frontend/web

echo "Frontend başlatılıyor..."
npm run dev &
FRONTEND_PID=$!

echo "Servisler hazırlanıyor..."
sleep 15

echo "API kontrol ediliyor..."

curl http://localhost:8081/api/v1/metrics/clusters

echo ""
curl http://localhost:8000/api/v1/forecast/gpu-cost

echo ""
echo "Test tamamlandı."

echo "Servisler durduruluyor..."

kill $DATA_PID
kill $API_PID
kill $FORECAST_PID
kill $FRONTEND_PID

echo "Bitti."