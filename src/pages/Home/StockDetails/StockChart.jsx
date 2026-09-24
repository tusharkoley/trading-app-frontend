import React, { useState, useMemo } from "react";
import Plot from "react-plotly.js";
// import { useTheme } from "@mui/material/styles";

function StockChart({ stockData, tikcer, mode }) {
  const [selectedMonths, setSelectedMonths] = useState(1);
  //   const theme = useTheme();


  const themeColors = {
    dark: {
      plot_bgcolor: "rgb(40,40,40)",
      paper_bgcolor: "rgb(50,50,50)",
      font_color: "#fff",
      increasing_line_color: "lightgreen",
      decreasing_line_color: "lightred",
    },
    light: {
      plot_bgcolor: "#fff",
      paper_bgcolor: "#f0f0f0",
      font_color: "#000",
      increasing_line_color: "green",
      decreasing_line_color: "red",
    },
  };

  const sortedData = useMemo(() => {
    return (stockData || [])
      .map((row) => ({ ...row, timestamp: new Date(row.date).getTime() }))
      .filter((row) => Number.isFinite(row.timestamp))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [stockData]);

  const chartData = useMemo(() => {
    if (selectedMonths === null || sortedData.length === 0) return sortedData;

    const cutoff = new Date(sortedData[sortedData.length - 1].timestamp);
    const day = cutoff.getUTCDate();
    // Clamp month-end dates to a valid day in the target month.
    cutoff.setUTCDate(1);
    cutoff.setUTCMonth(cutoff.getUTCMonth() - selectedMonths);
    const lastDay = new Date(
      Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)
    ).getUTCDate();
    cutoff.setUTCDate(Math.min(day, lastDay));
    return sortedData.filter((row) => row.timestamp >= cutoff.getTime());
  }, [sortedData, selectedMonths]);

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Chart period">
        {[["1M", 1], ["3M", 3], ["6M", 6], ["1Y", 12], ["5Y", 60], ["All", null]].map(([label, months]) => (
          <button
            key={label}
            type="button"
            className={`btn btn-sm ${selectedMonths === months ? "btn-primary" : mode === "dark" ? "btn-outline-light" : "btn-outline-primary"}`}
            aria-pressed={selectedMonths === months}
            onClick={() => setSelectedMonths(months)}
          >
            {label}
          </button>
        ))}
      </div>
      <Plot
        data={[
          {
            type: "candlestick",
            x: chartData.map((d) => d.date),
            open: chartData.map((d) => d.open),
            high: chartData.map((d) => d.high),
            low: chartData.map((d) => d.low),
            close: chartData.map((d) => d.close),
            increasing: {
              line: { color: themeColors[mode].increasing_line_color },
            },
            decreasing: {
              line: { color: themeColors[mode].decreasing_line_color },
            },
          },
        ]}
        layout={{
          title: `Stock Price Chart for ${tikcer}`,
          height: 800, // Adjust height as needed
          autosize: true, // Allow the chart to resize with the container
          showlegend: false,
          plot_bgcolor: themeColors[mode].plot_bgcolor,
          paper_bgcolor: themeColors[mode].paper_bgcolor,
          xaxis: {
            autorange: true,
            domain: [0, 1],
  
            title: {
              text: "Date",
            },
            type: "date",
            rangeslider: {
              visible: false,
            },
          },
          yaxis: {
            autorange: true,
            domain: [0, 1],
            type: "linear",
          },
          font: {
            color: themeColors[mode].font_color,
          },
        }}
        useResizeHandler
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default StockChart;
