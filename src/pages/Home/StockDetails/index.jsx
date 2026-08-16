import "bootstrap/dist/css/bootstrap.min.css";

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useStocksDetail from "../../../data/useStockDetail";
import { useDarkMode } from "../../../DarkModeContext";
import { useSearchParams } from "react-router-dom";
import "../StocksTable.css";
import StockChart from "./StockChart";

import {
  usePriceDatabyTicker,
  useLatestTechnicalByTicker,
} from "../../../data/useSnp500StocksData";

import Table from "../../../components/Table";

function StockDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const ticker = searchParams.get("ticker");

  const { isLoading, error, stock } = useStocksDetail({ id });
  const { isDarkMode, toggleTheme } = useDarkMode();

  const {
    isLoading: priceLoading,
    error: priceerror,
    stocks: stocks_prices,
  } = usePriceDatabyTicker(ticker);

  const {
    isLoading: technicalLoading,
    error: technicalError,
    technical,
  } = useLatestTechnicalByTicker(ticker);

  const formatMetric = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue.toFixed(2);
  };

  const getDmaFromPrices = (windowSize) => {
    if (!stocks_prices || stocks_prices.length < windowSize) {
      return null;
    }

    const sortedByDate = [...stocks_prices].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const closes = sortedByDate
      .map((row) => Number(row.close))
      .filter((value) => !Number.isNaN(value));

    if (closes.length < windowSize) {
      return null;
    }

    const lastWindow = closes.slice(-windowSize);
    const sum = lastWindow.reduce((acc, value) => acc + value, 0);
    return sum / windowSize;
  };

  const latestPrice =
    stocks_prices && stocks_prices.length > 0
      ? [...stocks_prices].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

  const dmaFallback = useMemo(
    () => ({
      dma_20: getDmaFromPrices(20),
      dma_50: getDmaFromPrices(50),
      dma_200: getDmaFromPrices(200),
    }),
    [stocks_prices]
  );

  const technicalView = {
    ...technical,
    dma_20:
      technical?.dma_20 !== null && technical?.dma_20 !== undefined
        ? technical.dma_20
        : dmaFallback.dma_20,
    dma_50:
      technical?.dma_50 !== null && technical?.dma_50 !== undefined
        ? technical.dma_50
        : dmaFallback.dma_50,
    dma_200:
      technical?.dma_200 !== null && technical?.dma_200 !== undefined
        ? technical.dma_200
        : dmaFallback.dma_200,
  };

  const showTechnicalSection =
    (!technicalLoading && technical && technical.id) ||
    dmaFallback.dma_20 !== null ||
    dmaFallback.dma_50 !== null ||
    dmaFallback.dma_200 !== null;

  if (isLoading) {
    return (
      <div>
        <h1>Loading Details...</h1>
      </div>
    );
  }

  if (priceLoading) {
    return <h1>Loading Price, please wait</h1>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Failed to load stock details.
        </div>
      </div>
    );
  }

  const companyName = stock?.company_name || "N/A";
  const companyTicker = stock?.ticker || ticker || "N/A";


  const priceColumns = ["Date", "Ticker", "Open", "Close", "High", "Low"];
  const pricefields = ["date", "ticker", "open", "close", "high", "low"];

  return (
    <div
      className={`container container-fluid overflow-auto ${
        isDarkMode ? "body_dark" : ""
      }`}
    >
      <h2>
        {companyName} ({companyTicker})
      </h2>
      {latestPrice && (
        <div className="alert alert-secondary" role="alert">
          Latest Price: <strong>{Number(latestPrice.close).toFixed(2)}</strong>
          {" "}on {latestPrice.date}
        </div>
      )}
      <table className={`table table-striped table-bordered`}>
        <tbody className={`${isDarkMode ? "table-dark" : "table-primary"}`}>
          <tr>
            <th>Company Name:</th>
            <td>{companyName}</td>
          </tr>
          <tr>
            <th>Ticker:</th>
            <td>{companyTicker}</td>
          </tr>
          <tr>
            <th>Industry:</th>
            <td>{stock?.industry || "N/A"}</td>
          </tr>
          <tr>
            <th>Description:</th>
            <td>{stock?.description || "N/A"}</td>
          </tr>
          <tr>
            <th>Country:</th>
            <td>{stock?.country || "N/A"}</td>
          </tr>
          <tr>
            <th>Website:</th>
            <td>
              {stock?.website ? <a href={stock.website}>{stock.website}</a> : "N/A"}
            </td>
          </tr>
          <tr>
            <th>Address:</th>
            <td>{stock?.address || "N/A"}</td>
          </tr>
        </tbody>
      </table>
      {showTechnicalSection && (
        <div>
          <h3>Technical Specs (Latest)</h3>
          <table className="table table-striped table-bordered">
            <tbody className={`${isDarkMode ? "table-dark" : "table-primary"}`}>
              <tr>
                <th>Indicator Date:</th>
                <td>{technicalView.date || latestPrice?.date || "N/A"}</td>
              </tr>
              <tr>
                <th>RS Industry:</th>
                <td>{formatMetric(technicalView.rs_industry)}</td>
              </tr>
              <tr>
                <th>ATR 14:</th>
                <td>{formatMetric(technicalView.atr_14)}</td>
              </tr>
              <tr>
                <th>Historical Volatility 20:</th>
                <td>{formatMetric(technicalView.hist_volatility_20)}</td>
              </tr>
              <tr>
                <th>VWAP 20:</th>
                <td>{formatMetric(technicalView.vwap_20)}</td>
              </tr>
              <tr>
                <th>DMA 20:</th>
                <td>{formatMetric(technicalView.dma_20)}</td>
              </tr>
              <tr>
                <th>DMA 50:</th>
                <td>{formatMetric(technicalView.dma_50)}</td>
              </tr>
              <tr>
                <th>DMA 200:</th>
                <td>{formatMetric(technicalView.dma_200)}</td>
              </tr>
              <tr>
                <th>Beta 252:</th>
                <td>{formatMetric(technicalView.beta_252)}</td>
              </tr>
              <tr>
                <th>Alpha 252:</th>
                <td>{formatMetric(technicalView.alpha_252)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
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
