// StocksTable.jsx

import "bootstrap/dist/css/bootstrap.min.css";

import "./StocksTable.css"; // Import the CSS file

import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../DarkModeContext";

import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { MdFormatAlignRight } from "react-icons/md";

import { useSnp500StocksData } from "../../data/useSnp500StocksData";
import Table from "../../components/Table";

function Home() {
  const { isDarkMode, toggleTheme } = useDarkMode();
  const [currPage, setCurrPage] = useState(0);
  const { isLoading, error, stocks } = useSnp500StocksData();
  const [filteredData, setFilteredData] = useState(stocks);
  const [pageSize, setPageSize] = useState(20); // Default page size
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const noOfPages = Math.floor(filteredData.length / pageSize) + 1;
  const startIndex = currPage * pageSize;
  const currData = filteredData.slice(startIndex, startIndex + pageSize);
  const buttonsVal = Array.from({ length: noOfPages }, (_, i) => i);

  const handleCurrPage = (pageNumber) => {
    setCurrPage(pageNumber);
  };

  const tableColumns = [
    "Symbol",
    "Name",
    "Industry",
    "Country",
    "Website",
    "Address",
  ];
  const rowFields = [
    "ticker",
    "company_name",
    "industry",
    "country",
    "website",
    "address",
  ];

  const [searchTicker, setSearchTicker] = useState("");
  const [searchCompanyName, setSearchCompanyName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    const filtered = stocks.filter((item) => {
      const tickerMatches =
        searchTicker === "" ||
        item.ticker.toLowerCase().includes(searchTicker.toLowerCase());
      const companyNameMatches =
        searchCompanyName === "" ||
        item.company_name
          .toLowerCase()
          .includes(searchCompanyName.toLowerCase());
      const industryMatches =
        selectedIndustry === "" || item.industry === selectedIndustry;
      const countryMatches =
        selectedCountry === "" || item.country === selectedCountry;

      return (
        tickerMatches && companyNameMatches && industryMatches && countryMatches
      );
    });
    setFilteredData(filtered);
  }, [
    stocks,
    searchTicker,
    searchCompanyName,
    selectedIndustry,
    selectedCountry,
  ]);

  const tableClass = isDarkMode ? "table-dark" : "table-primary";
  const htmlElement = document.querySelector("html");

  return (
    <div
      className={`container overflow-auto ${isDarkMode ? "table_dark" : ""}`}
      style={{ marginTop: "20px" }}
    >
      <div className={`row mb-3 ${isDarkMode ? "table_dark" : ""}`}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Symbol"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Company Name"
            value={searchCompanyName}
            onChange={(e) => setSearchCompanyName(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            {/* Add unique industry options from your data */}
            {Array.from(new Set(stocks.map((item) => item.industry))).map(
              (industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              )
            )}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {/* Add unique country options from your data */}
            {Array.from(new Set(stocks.map((item) => item.country))).map(
              (country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <Table
        data={currData}
        tableColumns={tableColumns}
        rowFields={rowFields}
        className={tableClass}
      />

      <div className="pagination-container">
        {buttonsVal.map((val) => (
          <button
            key={val}
            className={`btn ${isDarkMode ? "btn-dark" : "btn-primary"}`}
            onClick={() => handleCurrPage(val)}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="pagination-selector">
        <select value={pageSize} onChange={handlePageSizeChange}>
          <option value={20}>20 per page</option>
          <option value={30}>30 per page</option>
          <option value={40}>40 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}
export default Home;
