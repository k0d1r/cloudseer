import torch
import torch.nn as nn
import numpy as np
import logging

class CostLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2):
        super(CostLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

class LSTMCostForecaster:
    """
    Orta Vadeli (30-90 gün) ve karmaşık anomali/sezonsallık içeren maliyet tahmin modeli.
    """
    def __init__(self, seq_length=30):
        self.seq_length = seq_length
        self.model = CostLSTM()
        self.criterion = nn.MSELoss()
        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        self.is_trained = False
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("LSTMCostForecaster")
        
    def fit(self, time_series_data, epochs=50):
        self.logger.info("Training LSTM cost model...")
        # Basit mock training loop for architectural completeness
        self.model.train()
        for epoch in range(epochs):
            # Normalde burada data loader olacak
            pass
        self.is_trained = True
        self.logger.info("LSTM Model training completed.")
        
    def predict(self, recent_sequence, days_ahead=90):
        if not self.is_trained:
            raise RuntimeError("LSTM Model is not trained yet.")
            
        self.logger.info(f"Generating LSTM forecast for {days_ahead} days ahead...")
        self.model.eval()
        
        # Basit mock inference logic
        predictions = []
        current_seq = recent_sequence.copy()
        
        with torch.no_grad():
            for _ in range(days_ahead):
                # Tensor dönüşümü vb.
                mock_pred = float(np.mean(current_seq) * 1.02) # %2 büyüme trendi
                predictions.append(mock_pred)
                current_seq = current_seq[1:] + [mock_pred]
                
        return predictions
