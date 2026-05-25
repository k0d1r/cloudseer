from fastapi import FastAPI
import random
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ForecastData(BaseModel):
    month: str
    value: float
    is_predicted: bool

class ForecastResponse(BaseModel):
    model_name: str
    confidence: int
    mape: float
    rmse: float
    trajectory: List[ForecastData]

@app.get("/api/v1/forecast/gpu-cost")
def get_gpu_forecast():
    base = 12000
    return ForecastResponse(
        model_name="LSTM Deep Learning",
        confidence=94,
        mape=2.4,
        rmse=420.5,
        trajectory=[
            ForecastData(month="Mar", value=base*1.0, is_predicted=False),
            ForecastData(month="Apr", value=base*1.1, is_predicted=False),
            ForecastData(month="May", value=base*1.25, is_predicted=False),
            ForecastData(month="Jun", value=base*1.45 + random.uniform(-200, 200), is_predicted=True),
            ForecastData(month="Jul", value=base*1.70 + random.uniform(-300, 300), is_predicted=True),
            ForecastData(month="Aug", value=base*2.00 + random.uniform(-400, 400), is_predicted=True),
        ]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
