// AreaChartComponent.js
import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const AreaChartComponent = ({ data, labels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "line", // Use 'line' type for an area chart
      data: {
        labels: labels, // Dynamic labels
        datasets: [
          {
            label: "Closing Prices",
            data: data, // Dynamic data
            fill: true, // Enable filling
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Background color of the area
            borderColor: "rgba(75, 192, 192, 1)", // Border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  }, [data, labels]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default AreaChartComponent;
