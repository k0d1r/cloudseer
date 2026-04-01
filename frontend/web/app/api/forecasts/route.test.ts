import { GET } from './route';

describe('Forecasts API Route', () => {
  it('should return mock LSTM forecast data', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    
    const data = await response.json();
    
    // Validate core model details
    expect(data.model_name).toBe("LSTM Deep Learning");
    expect(data.confidence).toBe(94);
    expect(data.mape).toBe(2.4);
    expect(data.rmse).toBe(420.5);
    
    // Validate trajectory array
    expect(Array.isArray(data.trajectory)).toBe(true);
    expect(data.trajectory.length).toBe(6);
    
    // Validate chronological months
    expect(data.trajectory[0].month).toBe("Jan");
    expect(data.trajectory[5].month).toBe("Jun");
    
    // Validate prediction boolean flag
    expect(data.trajectory[0].is_predicted).toBe(false);
    expect(data.trajectory[5].is_predicted).toBe(true);
  });
});
