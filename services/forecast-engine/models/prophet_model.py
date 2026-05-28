import pandas as pd
from prophet import Prophet
import logging

class ProphetCostModel:
    """
    Kısa Vadeli (7-30 gün) maliyet tahminlerini yapan Prophet tabanlı model.
    """
    def __init__(self, uncertainty_samples=1000):
        self.model = Prophet(
            yearly_seasonality=False,
            weekly_seasonality=True,
            daily_seasonality=True,
            uncertainty_samples=uncertainty_samples
        )
        self.is_trained = False
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("ProphetCostModel")

    def fit(self, historical_data: pd.DataFrame):
        """
        historical_data: 'ds' (datetime) ve 'y' (cost float) kolonlarını içermelidir.
        """
        if 'ds' not in historical_data.columns or 'y' not in historical_data.columns:
            raise ValueError("Dataframe must contain 'ds' and 'y' columns.")
            
        self.logger.info("Training Prophet model on historical cost data...")
        self.model.fit(historical_data)
        self.is_trained = True
        self.logger.info("Model training completed.")

    def predict(self, days_ahead=30):
        if not self.is_trained:
            raise RuntimeError("Model is not trained yet. Call fit() first.")
            
        self.logger.info(f"Generating forecast for {days_ahead} days ahead...")
        future = self.model.make_future_dataframe(periods=days_ahead)
        forecast = self.model.predict(future)
        
        # Sadece gelecekteki günleri döndür
        forecast_future = forecast.tail(days_ahead)
        
        results = []
        for _, row in forecast_future.iterrows():
            results.append({
                "target_date": row['ds'].strftime('%Y-%m-%d'),
                "p10_cost": float(row['yhat_lower']),
                "p50_cost": float(row['yhat']),
                "p90_cost": float(row['yhat_upper'])
            })
            
        return results
