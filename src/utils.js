export const formatToNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCompactNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    notation: 'compact',      
    maximumFractionDigits: 2
  }).format(amount);
};

export const getRiskLevel = (percentageChange) => {
  const absChange = Math.abs(percentageChange);
  if (absChange >= 10) return { label: 'High Risk ⚠️', color: 'text-orange-400 bg-orange-400/10' };
  if (absChange >= 4) return { label: 'Moderate Risk', color: 'text-yellow-400 bg-yellow-400/10' };
  return { label: 'Low Risk / Stable', color: 'text-blue-400 bg-blue-400/10' };
};

// Least Squares Linear Regression Algorithm
export const getTrendForecast = (sparklineObj) => {
  const prices = sparklineObj?.price || [];
  if (prices.length < 2) return { label: 'No Data', color: 'text-gray-500 bg-gray-500/10' };

  const n = prices.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += prices[i];
    sumXY += i * prices[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  if (slope > 0) return { label: 'Forecast: Bullish 📈', color: 'text-green-400 bg-green-500/10 border-green-500/50' };
  if (slope < 0) return { label: 'Forecast: Bearish 📉', color: 'text-red-400 bg-red-500/10 border-red-500/50' };
  
  return { label: 'Forecast: Neutral ⚖️', color: 'text-gray-400 bg-gray-500/10 border-gray-500/50' };
};