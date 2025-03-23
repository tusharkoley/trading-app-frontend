import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

import "../styles/Styles.scss";

function Table({ data, tableColumns, rowFields, className }) {
  const path = "/stockDetails";
  return (
    <div style={{ justifyContent: "start", justifyItems: "start" }}>
      <table className="table table-striped table-bordered">
        <thead>
          <tr className={className}>
            {tableColumns?.map((col) => (
              <th>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className={className}>
          {data?.map((item) => (
            <tr key={item.id}>
              {rowFields?.map((field) => (
                <td className={className}>
                  {field == "ticker" ? (
                    <Link
                      to={`/stockDetails/${item.id}?ticker=${item["ticker"]}`}
                    >
                      {item[field]}
                    </Link>
                  ) : (
                    item[field]
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
