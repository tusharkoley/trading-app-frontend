// StocksTable.jsx

import "bootstrap/dist/css/bootstrap.min.css";

import "./StocksTable.css"; // Import the CSS file

import React, { useState, useMemo, useEffect } from "react";
import { useDarkMode } from "../../DarkModeContext";
import { useSearchParams } from "react-router-dom";

import {
  useSnp500StocksData,
  useLatestTechnicals,
  useLatestPrices,
} from "../../data/useSnp500StocksData";
import Table from "../../components/Table";

function Home() {
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useDarkMode();
  const [currPage, setCurrPage] = useState(0);
  const { isLoading, error, stocks } = useSnp500StocksData();
  const {
    technicals,
    isLoading: technicalsLoading,
    error: technicalsError,
  } = useLatestTechnicals();
  const { prices: latestPrices } = useLatestPrices();

  const stocksList = Array.isArray(stocks) ? stocks : [];
  const technicalsList = Array.isArray(technicals) ? technicals : [];
  const latestPricesList = Array.isArray(latestPrices) ? latestPrices : [];

  const [pageSize, setPageSize] = useState(20); // Default page size
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const [searchTicker, setSearchTicker] = useState(() => searchParams.get("ticker") || "");
  const [searchCompanyName, setSearchCompanyName] = useState(
    () => searchParams.get("company") || ""
  );
  const [selectedIndustry, setSelectedIndustry] = useState(
    () => searchParams.get("industry") || ""
  );
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(
    () => searchParams.get("subIndustry") || ""
  );
  const [selectedIndustryDropdown, setSelectedIndustryDropdown] = useState("");
  const [selectedSubIndustryDropdown, setSelectedSubIndustryDropdown] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    () => searchParams.get("country") || ""
  );
  const [showHighRSOnly, setShowHighRSOnly] = useState(false);
  const [rsSortOrder, setRsSortOrder] = useState("");

  const technicalByTicker = useMemo(() => {
    return technicalsList.reduce((acc, item) => {
      acc[item.ticker] = item;
      return acc;
    }, {});
  }, [technicalsList]);

  const latestPriceByTicker = useMemo(() => {
    return latestPricesList.reduce((acc, item) => {
      acc[item.ticker] = item;
      return acc;
    }, {});
  }, [latestPricesList]);

  const stocksWithTechnicals = useMemo(() => {
    return stocksList.map((item) => {
      const technical = technicalByTicker[item.ticker] || {};
      const latestPrice = latestPriceByTicker[item.ticker] || {};

      return {
        ...item,
        latest_close:
          latestPrice.close !== null && latestPrice.close !== undefined
            ? Number(latestPrice.close).toFixed(2)
            : "N/A",
        latest_price_date: latestPrice.date || "N/A",
        rs_industry:
          technical.rs_industry !== null && technical.rs_industry !== undefined
            ? Number(technical.rs_industry).toFixed(2)
            : "N/A",
        rs_industry_numeric: technical.rs_industry,
      };
    });
  }, [stocksList, technicalByTicker, latestPriceByTicker]);

  const filteredData = useMemo(() => {
    return stocksWithTechnicals.filter((item) => {
      const tickerMatches =
        searchTicker === "" ||
        item.ticker.toLowerCase().includes(searchTicker.toLowerCase());
      const companyNameMatches =
        searchCompanyName === "" ||
        item.company_name
          .toLowerCase()
          .includes(searchCompanyName.toLowerCase());
      const industryMatches =
        selectedIndustry === "" ||
        (item.industry || "")
          .toLowerCase()
          .includes(selectedIndustry.toLowerCase());
      const subIndustryMatches =
        selectedSubIndustry === "" ||
        (item.industry_subgroup || "")
          .toLowerCase()
          .includes(selectedSubIndustry.toLowerCase());
      const industryDropdownMatches =
        selectedIndustryDropdown === "" ||
        (item.industry || "") === selectedIndustryDropdown;
      const subIndustryDropdownMatches =
        selectedSubIndustryDropdown === "" ||
        (item.industry_subgroup || "") === selectedSubIndustryDropdown;
      const countryMatches =
        selectedCountry === "" ||
        (item.country || "").toLowerCase() === selectedCountry.toLowerCase();
      const rsValue = Number(item.rs_industry_numeric);
      const rsMatches =
        !showHighRSOnly || (!Number.isNaN(rsValue) && rsValue > 90);

      return (
        tickerMatches &&
        companyNameMatches &&
        industryMatches &&
        subIndustryMatches &&
        industryDropdownMatches &&
        subIndustryDropdownMatches &&
        countryMatches &&
        rsMatches
      );
    });
  }, [
    stocksWithTechnicals,
    searchTicker,
    searchCompanyName,
    selectedIndustry,
    selectedSubIndustry,
    selectedIndustryDropdown,
    selectedSubIndustryDropdown,
    selectedCountry,
    showHighRSOnly,
  ]);

  const sortedData = useMemo(() => {
    if (!rsSortOrder) {
      return filteredData;
    }

    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const rsA = Number(a.rs_industry_numeric);
      const rsB = Number(b.rs_industry_numeric);

      const safeA = Number.isNaN(rsA) ? -Infinity : rsA;
      const safeB = Number.isNaN(rsB) ? -Infinity : rsB;

      return rsSortOrder === "desc" ? safeB - safeA : safeA - safeB;
    });

    return sorted;
  }, [filteredData, rsSortOrder]);

  const industryOptions = useMemo(() => {
    return Array.from(
      new Set(stocksList.map((item) => item.industry).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [stocksList]);

  const subIndustryOptions = useMemo(() => {
    const industryFilter = selectedIndustryDropdown || selectedIndustry;

    const filteredByIndustry = stocksList.filter((item) => {
      if (!industryFilter) {
        return true;
      }

      const industryValue = (item.industry || "").toLowerCase();
      const filterValue = industryFilter.toLowerCase();

      if (selectedIndustryDropdown) {
        return industryValue === filterValue;
      }

      return industryValue.includes(filterValue);
    });

    return Array.from(
      new Set(filteredByIndustry.map((item) => item.industry_subgroup).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [stocksList, selectedIndustry, selectedIndustryDropdown]);

  useEffect(() => {
    if (
      selectedSubIndustryDropdown &&
      !subIndustryOptions.includes(selectedSubIndustryDropdown)
    ) {
      setSelectedSubIndustryDropdown("");
    }
  }, [selectedSubIndustryDropdown, subIndustryOptions]);

  useEffect(() => {
    setCurrPage(0);
  }, [
    searchTicker,
    searchCompanyName,
    selectedIndustry,
    selectedSubIndustry,
    selectedIndustryDropdown,
    selectedSubIndustryDropdown,
    selectedCountry,
    showHighRSOnly,
    rsSortOrder,
  ]);

  const noOfPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const startIndex = currPage * pageSize;
  const currData = sortedData.slice(startIndex, startIndex + pageSize);
  const buttonsVal = Array.from({ length: noOfPages }, (_, i) => i);

  const handleCurrPage = (pageNumber) => {
    setCurrPage(pageNumber);
  };

  const handleRsSortToggle = () => {
    setRsSortOrder((currentOrder) => {
      if (currentOrder === "") {
        return "desc";
      }

      if (currentOrder === "desc") {
        return "asc";
      }

      return "";
    });
  };

  const tableColumns = [
    "Symbol",
    "Name",
    "Latest Close",
    "RS",
    "Industry",
    "Sub Industry",
    "Country",
  ];
  const rowFields = [
    "ticker",
    "company_name",
    "latest_close",
    "rs_industry",
    "industry",
    "industry_subgroup",
    "country",
  ];

  const tableClass = isDarkMode ? "table-dark" : "table-primary";
  return (
    <div
      className={`container overflow-auto ${isDarkMode ? "table_dark" : ""}`}
      style={{ marginTop: "20px" }}
    >
      <div className={`row g-2 mb-3 ${isDarkMode ? "table_dark" : ""}`}>
        <div className="col-lg-3 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Symbol"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
          />
        </div>
        <div className="col-lg-3 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Company Name"
            value={searchCompanyName}
            onChange={(e) => setSearchCompanyName(e.target.value)}
          />
        </div>

        <div className="col-lg-2 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          />
        </div>
        <div className="col-lg-2 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Sub Industry"
            value={selectedSubIndustry}
            onChange={(e) => setSelectedSubIndustry(e.target.value)}
          />
        </div>
        <div className="col-lg-2 col-md-4">
          <select
            className="form-select"
            value={selectedIndustryDropdown}
            onChange={(e) => setSelectedIndustryDropdown(e.target.value)}
          >
            <option value="">All Industries</option>
            {industryOptions.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-2 col-md-4">
          <select
            className="form-select"
            value={selectedSubIndustryDropdown}
            onChange={(e) => setSelectedSubIndustryDropdown(e.target.value)}
          >
            <option value="">All Sub Industries</option>
            {subIndustryOptions.map((subIndustry) => (
              <option key={subIndustry} value={subIndustry}>
                {subIndustry}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-2 col-md-4">
          <select
            className="form-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {/* Add unique country options from your data */}
            {Array.from(new Set(stocksList.map((item) => item.country))).map(
              (country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              )
            )}
          </select>
        </div>
        <div className="col-12 mt-2 d-flex justify-content-end">
          <div
            className={`form-check form-check-inline mb-0 px-3 py-2 rounded ${
              isDarkMode ? "border border-secondary" : "border"
            }`}
          >
            <input
              className="form-check-input position-static me-2 mt-1"
              type="checkbox"
              id="high-rs-filter"
              checked={showHighRSOnly}
              onChange={(e) => setShowHighRSOnly(e.target.checked)}
            />
            <label className="form-check-label small mb-0" htmlFor="high-rs-filter">
              Show only stocks with RS Industry greater than 90
            </label>
          </div>
        </div>
      </div>

      {technicalsError && (
        <div className="alert alert-warning" role="alert">
          Technical data is unavailable from the API right now. RS filter will
          not return results until the technical endpoint is live.
        </div>
      )}

      {showHighRSOnly &&
        !technicalsLoading &&
        !technicalsError &&
        filteredData.length === 0 && (
          <div className="alert alert-info" role="alert">
            No stocks found with RS Industry greater than 90.
          </div>
        )}

      {!showHighRSOnly && filteredData.length > 0 && (
        <div className="mb-2 small text-muted">
          Latest close prices are shown from the most recent available trading date.
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load companies from the local backend right now.
        </div>
      )}

      {isLoading && (
        <div className="alert alert-secondary" role="status">
          Loading companies...
        </div>
      )}

      <Table
        data={currData}
        tableColumns={tableColumns}
        rowFields={rowFields}
        className={tableClass}
        rsSortOrder={rsSortOrder}
        onRsSortToggle={handleRsSortToggle}
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
