// App.js or ParentComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AreaChartComponent from "./AreaChartComponent";

const App = () => {
  const [closingPrices, setClosingPrices] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/week/2023-01-09/2023-07-26?adjusted=true&sort=asc&apiKey=kdVTzCDKNm9zggju9MXBSgp0VSkfjKSi"
        );
        const results = response.data.results;
        const prices = results.map((result) => result.c);
        setClosingPrices(prices);

        // Generate dynamic labels
        const weeks = results.map((_, index) => `Week ${index + 1}`);
        setLabels(weeks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Stock Closing Prices</h1>
      <AreaChartComponent data={closingPrices} labels={labels} />
    </div>
  );
};

export default App;
