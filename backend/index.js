import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Live Crypto Data Route
app.get('/api/crypto', async (req, res) => {
  try {
    // Fetching the top 50 cryptocurrencies natively in NAIRA (NGN)
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'ngn',       // <-- The crucial switch to local currency
        order: 'market_cap_desc', // Sorts by highest market cap first
        per_page: 50,             // Pulls the top 50 coins as you requested
        page: 1,
        sparkline: true           // Keeps the 7-day chart data active
      }
    });

    // Send the Naira-formatted data back to your React frontend
    res.json(response.data);

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