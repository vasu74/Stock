import React, { useEffect, useState } from "react";
import TickerSearch from "./TickerSearch";
import StockDetails from "./StockDetails";
import "./App.css";

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [history, setHistory] = useState([]);

  // Update history when a new ticker is selected
  useEffect(() => {
    if (selectedTicker) {
      setHistory((prevHistory) => {
        const InHistory = prevHistory.includes(selectedTicker.name);

        if (!InHistory) {
          const updateHistory = [selectedTicker.name, ...prevHistory];

          if (updateHistory.length > 5) {
            updateHistory.pop();
          }

          return updateHistory;
        }

        return prevHistory;
      });
    }
  }, [selectedTicker]);

  return (
    <div className="bg-[#0F172A] w-[100vw] h-full items-center justify-center flex">
      <div className="App h-[100vh] max-w-[1366px] mx-auto p-20 rounded-md text-white">
        <header className="App-header mb-8 flex flex-col items-center justify-center text-center">
          <h1 className="md:text-5xl text-4xl leading-normal font-medium">
            USA Stock Price Tracker
          </h1>
          <p className="mt-2">(Live Price Facility is paid by the API)</p>
        </header>

        <div className="mt-4 mb-4">
          {history.length > 0 ? (
            <ul className="flex gap-2 flex-wrap">
              {history.map((one, index) => (
                <li className="bg-[#449AFF] p-2 rounded-md" key={index}>
                  {one}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">For History Start Searching ... </p>
          )}
        </div>
        <TickerSearch setSelectedTicker={setSelectedTicker} />
        {selectedTicker && <StockDetails ticker={selectedTicker} />}
      </div>
    </div>
  );
};

export default App;
