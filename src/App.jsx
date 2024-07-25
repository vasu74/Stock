import React, { useState } from "react";
import TickerSearch from "./TickerSearch";
import StockDetails from "./StockDetails";
import "./App.css";

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState(null);
  console.log(selectedTicker);

  return (
    <div className="bg-[#0F172A] w-[100vw] h-full items-center justify-center flex">
      <div className="App h-[100vh] max-w-[1366px] mx-auto p-20  rounded-md text-white ">
        <header className="App-header mb-8 flex flex-col items-center justify-center text-center">
          <h1 className="md:text-5xl  text-4xl leading-normal  font-medium ">
            USA Stock Price Tracker
          </h1>
          <p className="mt-2">(Live Price Facility is paid by the API)</p>
        </header>
        <TickerSearch setSelectedTicker={setSelectedTicker} />
        {selectedTicker && <StockDetails ticker={selectedTicker} />}
      </div>
    </div>
  );
};

export default App;
