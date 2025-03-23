import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useStocksDetail from "../../../data/useStockDetail";
import { useDarkMode } from "../../../DarkModeContext";
import { useSearchParams } from "react-router-dom";
import "../StocksTable.css";
import StockChart from "./StockChart";

import { usePriceDatabyTicker } from "../../../data/useSnp500StocksData";

import Table from "../../../components/Table";

function StockDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = searchParams.get("ticker");

  const { isLoading, error, stock } = useStocksDetail({ id });
  const { isDarkMode, toggleTheme } = useDarkMode();

  if (isLoading)
    return (
      <div>
        <h1> Loading Details...</h1>
      </div>
    );

  const {
    isLoading: priceLoading,
    error: priceerror,
    stocks: stocks_prices,
  } = usePriceDatabyTicker(ticker);

  if (priceLoading) return <h1> Loading Price , please wait</h1>;

  console.log("****price data ***");

  const priceColumns = ["Date", "Ticker", "Open", "Close", "High", "Low"];
  const pricefields = ["date", "ticker", "open", "close", "high", "low"];

  return (
    <div
      className={`container container-fluid overflow-auto ${
        isDarkMode ? "body_dark" : ""
      }`}
    >
      <h2>
        {stock.company_name} ({stock.ticker})
      </h2>
      <table className={`table table-striped table-bordered`}>
        <tbody className={`${isDarkMode ? "table-dark" : "table-primary"}`}>
          <tr>
            <th>Company Name:</th>
            <td>{stock.company_name}</td>
          </tr>
          <tr>
            <th>Ticker:</th>
            <td>{stock.ticker}</td>
          </tr>
          <tr>
            <th>Industry:</th>
            <td>{stock.industry}</td>
          </tr>
          <tr>
            <th>Description:</th>
            <td>{stock.description}</td>
          </tr>
          <tr>
            <th>Country:</th>
            <td>{stock.country}</td>
          </tr>
          <tr>
            <th>Website:</th>
            <td>
              <a href={stock.website}>{stock.website}</a>
            </td>
          </tr>
          <tr>
            <th>Address:</th>
            <td>{stock.address}</td>
          </tr>
        </tbody>
      </table>
      {!priceLoading && ticker && stocks_prices && (
        <div className="container overflow-auto">
          <h1> Price Data</h1>
          <StockChart
            stockData={stocks_prices}
            tikcer={ticker}
            mode={`${isDarkMode ? "dark" : "light"}`}
          />
        </div>
      )}
      <div className="details-back">
        <button
          className={`btn ${isDarkMode ? "btn-dark" : "btn-primary"}  `}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default StockDetails;
