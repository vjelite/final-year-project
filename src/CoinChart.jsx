import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function CoinChart({ sparklineData, isPositive }) {
  if (!sparklineData || !sparklineData.price) return <div style={{height: '60px'}}></div>;

  const formattedData = sparklineData.price.map((price, index) => ({
    time: index,
    value: price,
  }));

  const chartColor = isPositive ? '#4caf50' : '#f44336';

  return (
    <div style={{ width: '100%', height: '60px', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <YAxis domain={['dataMin', 'dataMax']} hide={true} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={chartColor} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}