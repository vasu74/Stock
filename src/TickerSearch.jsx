import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const TickerSearch = ({ setSelectedTicker }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await axios.get(
            `https://ticker-2e1ica8b9.now.sh/keyword/${searchTerm}`
          );

          setResults(response.data || []);
          setIsLoading(false);
        } catch (error) {
          setError("Failed to fetch data, please try again.");
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleSelect = (symbol, name) => {
    setSelectedTicker({ symbol, name }); // Update the parent component with both symbol and name
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === results.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex <= 0 ? results.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        const selected = results[highlightedIndex];
        handleSelect(selected.symbol, selected.name);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mb-8">
      <input
        type="text"
        value={searchTerm}
        ref={inputRef}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a company"
        className="py-3 text-black px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {showResults && searchTerm.trim() && (
        <div className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-gray-500">Loading...</p>
          ) : (
            <>
              {results.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 rounded-lg ${
                        index === highlightedIndex ? "bg-gray-100" : ""
                      }`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleSelect(result.symbol, result.name)}
                    >
                      {result.symbol} - {result.name}
                    </li>
                  ))}
                </ul>
              ) : (
                searchTerm.trim() && (
                  <p className="p-4 text-sm text-gray-500">
                    Sorry, input the correct company
                  </p>
                )
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TickerSearch;
