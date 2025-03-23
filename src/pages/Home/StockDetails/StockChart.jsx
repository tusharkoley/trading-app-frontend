import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
// import { useTheme } from "@mui/material/styles";

function StockChart({ stockData, tikcer, mode }) {
  const [chartData, setChartData] = useState([]);
  //   const theme = useTheme();

  console.log("**Stock Chart Mode", mode);

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

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const processedData = stockData.map((data) => ({
        x: data.date, // Assuming 'date' is the key for date in your data
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      }));
      setChartData(processedData);
    }
  }, [stockData]);

  return (
    <Plot
      data={[
        {
          type: "candlestick",
          x: chartData.map((d) => d.x),
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
        width: 1300, // Set width to 100% of the container
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
          range: [0, 100],
          type: "linear",
        },
        font: {
          color: themeColors[mode].font_color,
        },
      }}
    />
  );
}

export default StockChart;
