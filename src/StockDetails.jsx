import React, { useEffect, useState } from "react";
import axios from "axios";

const StockDetails = ({ ticker }) => {
  const { symbol, name } = ticker;
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch stock data with retry logic
  const fetchStockData = async (attempt = 1) => {
    const apiKey = import.meta.env.VITE_REACT_APP_POLYGON_API_KEY;
    console.log(`API Key: ${apiKey}`);
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);

      if (response.data.status === "OK" && response.data.results.length > 0) {
        setStockData(response.data.results[0]);
        setError(null); // Reset error on successful data fetch
      } else {
        throw new Error("No data available");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limit exceeded, implement exponential backoff
        const retryAfterHeader = error.response.headers["retry-after"];
        const retryDelay = retryAfterHeader
          ? parseInt(retryAfterHeader, 10) * 1000
          : 2 ** attempt * 1000; // Exponential backoff

        setError("Rate limit exceeded. Retrying...");
        setTimeout(() => fetchStockData(attempt + 1), retryDelay);
      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="md:text-4xl text-2xl mb-4 text-[#449AFF]">
        Details for:
        <br />
        <span className="text-white mt-4">{name}</span>
      </h2>
      <div className="text-2xl flex flex-col gap-2">
        <p className="text-[#449AFF]">
          Date:
          <span className="text-white ml-2">
            {new Date(stockData.t).toLocaleDateString()}
          </span>
        </p>
        <p className="text-[#449AFF]">
          Open: <span className="text-white ml-2">${stockData.o}</span>
        </p>
        <p className="text-[#449AFF]">
          Close: <span className="text-white ml-2">${stockData.c}</span>
        </p>
        <p className="text-[#449AFF]">
          High: <span className="text-white ml-2">${stockData.h}</span>
        </p>
        <p className="text-[#449AFF]">
          Low: <span className="text-white ml-2">${stockData.l}</span>
        </p>
        <p className="text-[#449AFF]">
          Volume: <span className="text-white ml-2">{stockData.v}</span>
        </p>
        <p className="text-[#449AFF]">
          Volume Weighted Average Price:
          <span className="text-white ml-2">${stockData.vw}</span>
        </p>
      </div>
    </div>
  );
};

export default StockDetails;
