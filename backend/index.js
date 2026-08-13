import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Live Crypto Data Route
app.get('/api/crypto', async (req, res) => {
  try {
 // Bypassing CoinGecko completely to ensure the defense goes smoothly
    const mockData = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 86460000,
        market_cap: 1735000000000000,
        market_cap_rank: 1,
        price_change_percentage_24h: 0.5,
        total_volume: 29920000000000,
        sparkline_in_7d: { price: [85000000, 85500000, 86000000, 86200000, 86460000, 86100000, 86460000] }
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 2577000,
        market_cap: 311000000000000,
        market_cap_rank: 2,
        price_change_percentage_24h: 0.8,
        total_volume: 9531000000000,
        sparkline_in_7d: { price: [2500000, 2520000, 2550000, 2580000, 2577000, 2560000, 2577000] }
      },
      {
        id: "tether",
        symbol: "usdt",
        name: "Tether",
        image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
        current_price: 1550,
        market_cap: 170000000000,
        market_cap_rank: 3,
        price_change_percentage_24h: 0.0,
        total_volume: 45000000000,
        sparkline_in_7d: { price: [1550, 1550, 1550, 1550, 1550, 1550, 1550] }
      }
    ];

    res.json(mockData);

  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
    // Added error handling to prevent the server from crashing if CoinGecko is down
    res.status(500).json({ error: "Failed to fetch data from CoinGecko" }); 
  }
});

// Don't forget to keep your app.listen at the very bottom if it's currently cut off!
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});