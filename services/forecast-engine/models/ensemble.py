from .prophet_model import ProphetModel
from .lstm_model import LSTMModel

class EnsembleForecaster:
    def __init__(self):
        self.prophet = ProphetModel()
        self.lstm = LSTMModel()
        
    def predict(self, horizon=30):
        # Mix predictions based on confidence
        pass
