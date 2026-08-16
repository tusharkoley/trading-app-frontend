import { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useDarkMode } from "../../DarkModeContext";
import { useSnp500StocksData } from "../../data/useSnp500StocksData";
import { companiesApi } from "../../api";
import "./companyAdmin.css";

const EMPTY_FORM = {
  ticker: "",
  company_name: "",
  soctor: "",
  industry: "",
  industry_subgroup: "",
  description: "",
  country: "",
  website: "",
  address: "",
};

function CompanyAdmin() {
  const { isDarkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const { isLoading, error, stocks } = useSnp500StocksData();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCompany, setActiveCompany] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [statusMessage, setStatusMessage] = useState("");

  const companies = Array.isArray(stocks) ? stocks : [];

  const filteredCompanies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return companies;
    }

    return companies.filter((company) => {
      const ticker = (company.ticker || "").toLowerCase();
      const name = (company.company_name || "").toLowerCase();
      const industry = (company.industry || "").toLowerCase();

      return (
        ticker.includes(query) ||
        name.includes(query) ||
        industry.includes(query)
      );
    });
  }, [companies, searchTerm]);

  const resetEditor = () => {
    setActiveCompany(null);
    setFormData(EMPTY_FORM);
  };

  const startEdit = (company) => {
    setActiveCompany(company);
    setFormData({
      ticker: company.ticker || "",
      company_name: company.company_name || "",
      soctor: company.soctor || "",
      industry: company.industry || "",
      industry_subgroup: company.industry_subgroup || "",
      description: company.description || "",
      country: company.country || "",
      website: company.website || "",
      address: company.address || "",
    });
    setStatusMessage("");
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return companiesApi.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSnp500Stocks"] });
      setStatusMessage("Company updated successfully.");
      resetEditor();
    },
    onError: () => {
      setStatusMessage("Unable to update company. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await companiesApi.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchSnp500Stocks"] });
      setStatusMessage("Company deleted successfully.");
      resetEditor();
    },
    onError: () => {
      setStatusMessage("Unable to delete company. Please try again.");
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!activeCompany?.id) {
      return;
    }

    updateMutation.mutate({
      id: activeCompany.id,
      payload: {
        ...formData,
        ticker: formData.ticker.trim(),
        company_name: formData.company_name.trim(),
      },
    });
  };

  const handleDelete = (company) => {
    const isConfirmed = window.confirm(
      `Delete ${company.company_name} (${company.ticker}) from database?`
    );

    if (!isConfirmed || !company.id) {
      return;
    }

    deleteMutation.mutate(company.id);
  };

  return (
    <div
      className={`container overflow-auto ${isDarkMode ? "table_dark" : ""}`}
      style={{ marginTop: "20px" }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h3 className="mb-0">Company Admin</h3>
        <input
          type="text"
          className="form-control company-admin-search"
          placeholder="Search by ticker, name, or industry"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {statusMessage && (
        <div className="alert alert-info py-2" role="status">
          {statusMessage}
        </div>
      )}

      {isLoading && (
        <div className="alert alert-secondary" role="status">
          Loading companies...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Unable to load companies.
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="table-responsive company-admin-table-wrap mb-4">
            <table
              className={`table table-sm align-middle ${
                isDarkMode ? "table-dark" : "table-striped"
              }`}
            >
              <thead>
                <tr>
                  <th scope="col">Ticker</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">Industry</th>
                  <th scope="col">Country</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id || company.ticker}>
                    <td>{company.ticker || "N/A"}</td>
                    <td>{company.company_name || "N/A"}</td>
                    <td>{company.industry || "N/A"}</td>
                    <td>{company.country || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => startEdit(company)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(company)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {activeCompany && (
            <div className={`card ${isDarkMode ? "bg-dark text-light" : ""}`}>
              <div className="card-body">
                <h5 className="card-title mb-3">
                  Editing {activeCompany.company_name} ({activeCompany.ticker})
                </h5>

                <form className="row g-3" onSubmit={handleUpdate}>
                  <div className="col-md-3">
                    <label className="form-label">Ticker</label>
                    <input
                      name="ticker"
                      className="form-control"
                      value={formData.ticker}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-9">
                    <label className="form-label">Company Name</label>
                    <input
                      name="company_name"
                      className="form-control"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sector</label>
                    <input
                      name="soctor"
                      className="form-control"
                      value={formData.soctor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Industry</label>
                    <input
                      name="industry"
                      className="form-control"
                      value={formData.industry}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sub Industry</label>
                    <input
                      name="industry_subgroup"
                      className="form-control"
                      value={formData.industry_subgroup}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <input
                      name="country"
                      className="form-control"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Website</label>
                    <input
                      name="website"
                      className="form-control"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={updateMutation.isPending}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetEditor}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompanyAdmin;
