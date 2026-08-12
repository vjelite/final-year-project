import { useState, useEffect } from 'react';
import axios from 'axios';
import CoinChart from './CoinChart';
import { formatToNaira, formatCompactNaira, getRiskLevel, getTrendForecast } from './utils';

// ==========================================
// MAIN COMPONENT
// ==========================================
function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true); 

  // Offline State Tracker
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Search and Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('market_cap');

  // Calculator State
  const [nairaInput, setNairaInput] = useState('');
  const [selectedCoinId, setSelectedCoinId] = useState('');

  // Offline Network Listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Data Fetcher (With Caching)
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get('https://final-year-project-n12c.onrender.com/api/crypto');
        setCryptoData(response.data);
        
        // Save the fresh data to local storage for offline use
        localStorage.setItem('cachedCryptoData', JSON.stringify(response.data));
        
        if (response.data.length > 0) {
          setSelectedCoinId(response.data[0].id);
        }
        setLoading(false);
      } catch {
        console.error("API Fetch Failed, attempting to load cache...");
        
        // If API fails or offline, pull from browser cache
        const cachedData = localStorage.getItem('cachedCryptoData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCryptoData(parsedData);
          if (parsedData.length > 0) setSelectedCoinId(parsedData[0].id);
          setIsOffline(true);
          setLoading(false);
        } else {
          setError("No internet connection and no saved data found. Please connect to the internet.");
          setLoading(false);
        }
      }
    };
    fetchCryptoData();
  }, []);

  // Derived State Logic (Search + Sort)
  const filteredAndSortedData = cryptoData
    .filter((coin) => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === 'gainers') return b.price_change_percentage_24h - a.price_change_percentage_24h;
      if (sortType === 'losers') return a.price_change_percentage_24h - b.price_change_percentage_24h;
      return b.market_cap - a.market_cap; 
    });

  // Calculator Logic
  const calculateCryptoAmount = () => {
    if (!nairaInput || !selectedCoinId || cryptoData.length === 0) return '0.00';
    const coin = cryptoData.find(c => c.id === selectedCoinId);
    if (!coin) return '0.00';
    
    const amount = parseFloat(nairaInput) / coin.current_price;
    const formattedAmount = amount < 0.01 ? amount.toFixed(6) : amount.toFixed(3);
    return `${formattedAmount} ${coin.symbol.toUpperCase()}`;
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex justify-center items-center text-xl tracking-widest animate-pulse">Loading System...</div>;
  if (error) return <div className="min-h-screen bg-[#050505] text-red-500 flex justify-center items-center text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white pb-12 relative">
      
      {/* Offline Warning Banner */}
      {isOffline && (
        <div className="bg-yellow-500 text-black font-bold text-center py-2 px-4 shadow-lg flex justify-center items-center gap-2">
          <span className="text-xl">📡</span>
          You are currently offline. Showing last saved market data.
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-gray-800 px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          CryptoTracker
        </h1>

        <div className="flex items-center gap-4 bg-[#111] p-1.5 rounded-full border border-gray-800">
          <span className="pl-4 font-semibold text-sm text-gray-400 uppercase tracking-wider">Mode:</span>
          <button
            onClick={() => setIsBeginnerMode(!isBeginnerMode)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              isBeginnerMode
                ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            {isBeginnerMode ? '🎓 Beginner' : '⚡ Advanced'}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Quick Calculator */}
        <div className="mb-8 bg-linear-to-r from-indigo-900/30 to-black border border-indigo-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.05)] flex flex-col lg:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <span className="text-2xl">🧮</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-100">Quick Converter</h3>
              <p className="text-xs text-gray-400">See exactly what your Naira gets you</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">I spend</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                <input
                  type="number"
                  placeholder="10000"
                  value={nairaInput}
                  onChange={(e) => setNairaInput(e.target.value)}
                  className="bg-[#111] border border-gray-700 text-white pl-8 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 w-32 md:w-40 shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">on</span>
              <select
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                className="bg-[#111] border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 appearance-none pr-10 cursor-pointer shadow-inner"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '1rem auto', backgroundRepeat: 'no-repeat' }}
              >
                {cryptoData.map(coin => (
                  <option key={coin.id} value={coin.id}>{coin.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-black/60 px-6 py-2.5 rounded-xl border border-gray-800 ml-auto w-full md:w-auto justify-between">
              <span className="text-gray-400 font-medium text-sm">You get:</span>
              <span className="text-xl font-black text-green-400 tracking-tight">
                {calculateCryptoAmount()}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-[#0a0a0a] p-4 rounded-2xl border border-gray-800/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search for Bitcoin, ETH..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setSortType('market_cap')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${sortType === 'market_cap' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#111] border border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
              Highest Cap
            </button>
            <button 
              onClick={() => setSortType('gainers')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${sortType === 'gainers' ? 'bg-green-600 text-white shadow-lg' : 'bg-[#111] border border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
              Top Gainers
            </button>
            <button 
              onClick={() => setSortType('losers')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${sortType === 'losers' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#111] border border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
              Top Losers
            </button>
          </div>
        </div>

        {/* Crypto Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedData.map((coin) => {
            const risk = getRiskLevel(coin.price_change_percentage_24h);
            const forecast = getTrendForecast(coin.sparkline_in_7d);
            
            return (
              <div key={coin.id} className="group bg-linear-to-b from-[#161616] to-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all duration-500 relative overflow-hidden flex flex-col">
                
                {/* RESPONSIVE HEADER WITH BOTH BADGES */}
                <div className="flex items-start justify-between gap-2 mb-6">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={coin.image} alt={coin.name} className="w-11 h-11 rounded-full shadow-lg shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-100 truncate">{coin.name}</h2>
                      <span className="text-indigo-400 uppercase text-xs font-black tracking-widest">{coin.symbol}</span>
                    </div>
                  </div>
                  
                  {isBeginnerMode && (
                     <div className="flex flex-col items-end gap-1 shrink-0">
                       <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border opacity-80 whitespace-nowrap ${risk.color}`}>
                         {risk.label}
                       </span>
                       <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border opacity-80 whitespace-nowrap ${forecast.color}`}>
                         {forecast.label}
                       </span>
                     </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400 text-sm">Price</span>
                    <span className="text-xl font-bold tracking-tight">{formatToNaira(coin.current_price)}</span>
                  </div>

                  {!isBeginnerMode && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="group/tooltip relative font-semibold text-gray-400 text-sm border-b border-dashed border-gray-600 cursor-help">
                          Market Cap
                          <span className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-xs text-white rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                            The total value of all this coin's shares combined.
                          </span>
                        </span>
                        <span className="text-md font-medium text-gray-300">{formatCompactNaira(coin.market_cap)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-400 text-sm">24h Change</span>
                        <span className={`text-md font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  )}

                  {isBeginnerMode && (
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-gray-800/50">
                      <span className="font-semibold text-gray-400 text-sm">Today's Trend</span>
                      <span className={`text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full ${coin.price_change_percentage_24h > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {coin.price_change_percentage_24h > 0 ? '↑ Going Up' : '↓ Going Down'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-800/50">
                  <CoinChart 
                    sparklineData={coin.sparkline_in_7d} 
                    isPositive={coin.price_change_percentage_24h > 0} 
                  />
                </div>
              </div>
            );
          })}

          {filteredAndSortedData.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 text-lg">
              No coins found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;