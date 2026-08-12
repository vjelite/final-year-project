import { describe, it, expect } from 'vitest';
import { getRiskLevel, formatToNaira, getTrendForecast } from './utils';

describe('Algorithmic Risk Calculator', () => {
  
  it('should flag extreme volatility (>10%) as High Risk', () => {
    const resultUp = getRiskLevel(15.5);
    const resultDown = getRiskLevel(-12.0);
    
    expect(resultUp.label).toBe('High Risk ⚠️');
    expect(resultDown.label).toBe('High Risk ⚠️');
  });

  it('should flag moderate volatility (4% - 9.99%) as Moderate Risk', () => {
    const result = getRiskLevel(5.2);
    expect(result.label).toBe('Moderate Risk');
  });

  it('should flag low volatility (<4%) as Stable / Low Risk', () => {
    const result = getRiskLevel(1.5);
    expect(result.label).toBe('Low Risk / Stable');
  });
});

describe('Currency Localization', () => {
  
  it('should format numbers cleanly into Nigerian Naira', () => {
    const formatted = formatToNaira(50000).replace(/\s/g, ''); 
    expect(formatted).toContain('50,000');
    expect(formatted).toContain('₦'); 
  });
});

describe('Predictive Forecasting (Linear Regression)', () => {
  
  it('should predict a Bullish trend for mathematically rising prices', () => {
    const mockSparkline = { price: [100, 105, 110, 120, 130] };
    const result = getTrendForecast(mockSparkline);
    expect(result.label).toBe('Forecast: Bullish 📈');
  });

  it('should predict a Bearish trend for mathematically falling prices', () => {
    const mockSparkline = { price: [150, 140, 130, 120, 110] };
    const result = getTrendForecast(mockSparkline);
    expect(result.label).toBe('Forecast: Bearish 📉');
  });

  it('should handle broken or missing data safely', () => {
    const emptySparkline = { price: [] };
    const result = getTrendForecast(emptySparkline);
    expect(result.label).toBe('No Data');
  });
});