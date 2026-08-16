import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

import "../styles/Styles.scss";

function Table({
  data,
  tableColumns,
  rowFields,
  className,
  rsSortOrder,
  onRsSortToggle,
}) {

  const formatValue = (field, value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    if (field === "website") {
      return String(value).replace(/^https?:\/\//, "");
    }

    if (
      field === "latest_close" ||
      field === "rs_industry" ||
      field === "atr_14" ||
      field === "hist_volatility_20" ||
      field === "vwap_20" ||
      field === "dma_20" ||
      field === "dma_50" ||
      field === "dma_200"
    ) {
      const numericValue = Number(value);
      return Number.isNaN(numericValue) ? value : numericValue.toFixed(2);
    }

    return value;
  };

  return (
    <div className="table-responsive custom-table-wrapper">
      <table className="table table-striped table-bordered table-sm custom-data-table">
        <thead>
          <tr className={className}>
            {tableColumns?.map((col) => (
              <th key={col}>
                {col === "RS" ? (
                  <div className="table-header-sort">
                    <span>{col}</span>
                    <button
                      type="button"
                      className={`rs-sort-toggle rs-sort-${rsSortOrder || "off"}`}
                      onClick={onRsSortToggle}
                      aria-label="Toggle RS sort order"
                      title={
                        rsSortOrder === "desc"
                          ? "RS sorted high to low"
                          : rsSortOrder === "asc"
                            ? "RS sorted low to high"
                            : "Sort RS"
                      }
                    >
                      <span className="rs-sort-bars" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="rs-sort-indicator" aria-hidden="true">
                        {rsSortOrder === "desc" ? "v" : rsSortOrder === "asc" ? "^" : "-"}
                      </span>
                    </button>
                  </div>
                ) : (
                  col
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={className}>
          {data?.map((item) => (
            <tr key={item.id}>
              {rowFields?.map((field, index) => (
                <td
                  key={`${item.id}-${field}`}
                  className={`${className} ${index === 0 ? "sticky-col" : ""}`}
                  title={String(item[field] ?? "")}
                >
                  {field == "ticker" ? (
                    <Link
                      to={`/stockDetails/${item.id}?ticker=${item["ticker"]}`}
                    >
                      {formatValue(field, item[field])}
                    </Link>
                  ) : (
                    formatValue(field, item[field])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
