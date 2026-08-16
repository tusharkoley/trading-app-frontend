import { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDarkMode } from "../../DarkModeContext";
import { useIndustryPerformanceRankings } from "../../data/useSnp500StocksData";
import { Link } from "react-router-dom";

const monthOptions = [1, 3, 6, 9, 12];

function IndustryRanking() {
  const { isDarkMode } = useDarkMode();
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [selectedCountry, setSelectedCountry] = useState("");

  const {
    isLoading,
    error,
    data: industryData,
  } = useIndustryPerformanceRankings({
    months: selectedMonths,
    country: selectedCountry,
  });

  const rankings = Array.isArray(industryData?.rankings)
    ? industryData.rankings
    : [];
  const topIndustry = industryData?.top_industry || null;
  const availableCountries = Array.isArray(industryData?.available_countries)
    ? industryData.available_countries
    : [];

  const rankingsWithAllocation = useMemo(() => {
    const topTenRankings = rankings.filter((row) => Number(row?.rank) <= 10);

    const totalPositiveReturn = topTenRankings.reduce((sum, row) => {
      const returnPct = Number(row?.avg_return_pct);
      return returnPct > 0 ? sum + returnPct : sum;
    }, 0);

    return rankings.map((row) => {
      const rank = Number(row?.rank);
      const returnPct = Number(row?.avg_return_pct);
      const suggestedAllocationPct =
        rank <= 10 && totalPositiveReturn > 0 && returnPct > 0
          ? (returnPct / totalPositiveReturn) * 100
          : 0;

      return {
        ...row,
        suggestedAllocationPct,
      };
    });
  }, [rankings]);

  const dateLabel = useMemo(() => {
    if (!industryData?.as_of_date || !industryData?.lookback_date) {
      return "";
    }

    return `${industryData.lookback_date} to ${industryData.as_of_date}`;
  }, [industryData]);

  return (
    <div
      className={`container overflow-auto ${isDarkMode ? "table_dark" : ""}`}
      style={{ marginTop: "20px" }}
    >
      <h3 className="mb-3">Industry Performance Ranking</h3>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Period (months)</label>
          <select
            className="form-select"
            value={selectedMonths}
            onChange={(e) => setSelectedMonths(Number(e.target.value))}
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month} month{month > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Country</label>
          <select
            className="form-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {availableCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <div className="small text-muted">
            {dateLabel ? `Performance window: ${dateLabel}` : ""}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="alert alert-secondary" role="status">
          Loading industry rankings...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load industry rankings at the moment.
        </div>
      )}

      {!isLoading && !error && topIndustry && (
        <div className="card mb-3 border-success">
          <div className="card-body">
            <h5 className="card-title">Top Performing Industry</h5>
            <p className="mb-1">
              <strong>{topIndustry.industry}</strong>
            </p>
            <p className="mb-1">Average Return: {topIndustry.avg_return_pct}%</p>
            <p className="mb-0">Stocks Considered: {topIndustry.company_count}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && rankings.length === 0 && (
        <div className="alert alert-info" role="alert">
          No ranking data available for this period and country filter.
        </div>
      )}

      <div className="table-responsive">
        <table className={`table ${isDarkMode ? "table-dark" : "table-striped"}`}>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Industry</th>
              <th scope="col">Avg Return (%)</th>
              <th scope="col">Suggested Allocation (%)</th>
              <th scope="col">Company Count</th>
            </tr>
          </thead>
          <tbody>
            {rankingsWithAllocation.map((row) => (
              <tr key={`${row.industry}-${row.rank}`}>
                <td>{row.rank ?? "-"}</td>
                <td>
                  {row.industry ? (
                    <Link
                      to={{
                        pathname: "/",
                        search: new URLSearchParams({
                          industry: row.industry,
                          ...(selectedCountry ? { country: selectedCountry } : {}),
                        }).toString(),
                      }}
                    >
                      {row.industry}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{row.avg_return_pct ?? "N/A"}</td>
                <td>{row.suggestedAllocationPct.toFixed(2)}</td>
                <td>{row.company_count ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IndustryRanking;
