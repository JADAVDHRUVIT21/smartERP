import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    loadStock();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        loadStock();
      }

      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key === "F3") {
        e.preventDefault();
        handleSearch();
      }

      if (e.key === "F4") {
        e.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, []);

  const loadStock = async () => {
    try {
      setLoading(true);

      const res = await API.get("/stock/");
      console.log("API base url:", import.meta.env.VITE_API_URL);

      console.log("Response:", res);
      console.log("Is Array:", Array.isArray(res.data));

      let data = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (Array.isArray(res.data.stocks)) {
        data = res.data.stocks;
      }

      setStocks(data);
      setFilteredStocks(data);
      
      toast.success("Stock data loaded successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.log(err);
      setStocks([]);
      setFilteredStocks([]);
      toast.error("Failed to load stock data", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredStocks(stocks);
      toast.info("Showing all stocks", {
        position: "top-right",
        duration: 1500,
        style: {
          background: "#3b82f6",
          color: "#fff"
        }
      });
      return;
    }

    const result = stocks.filter((item) =>
      item.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
    console.log("Search Result:", result);
    console.log("stocks:", stocks);
    setFilteredStocks(result);
    
    if (result.length === 0) {
      toast.error("No products found matching your search", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
    } else {
      toast.success(`Found ${result.length} product(s)`, {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    }
  };

  const handleRefresh = () => {
    setSearch("");
    loadStock();
    toast.info("Refreshed stock data", {
      position: "top-right",
      duration: 1500,
      style: {
        background: "#3b82f6",
        color: "#fff"
      }
    });
  };

  return (
    <Layout title="Stock">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: "16px",
            borderRadius: "8px",
            fontSize: "14px"
          },
          success: {
            duration: 3000,
            style: {
              background: "#22c55e",
              color: "#fff"
            }
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff"
            }
          },
          info: {
            duration: 2000,
            style: {
              background: "#3b82f6",
              color: "#fff"
            }
          }
        }}
      />

      <div style={page}>
        <div style={card}>
          <h1>Stock Master</h1>

          <div style={shortcutBar}>
            <span>F1 Refresh</span>
            <span>F2 Focus Search</span>
            <span>F3 Search</span>
            <span>F4 Reset</span>
          </div>

          <div style={header}>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              style={searchBox}
            />

            <div style={buttonGroup}>
              <button
                onClick={handleSearch}
                style={searchBtn}
                disabled={loading}
              >
                Search
              </button>

              <button
                onClick={handleRefresh}
                style={refreshBtn}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <p style={{ textAlign: "center", color: "#3b82f6", margin: "20px 0" }}>
              Loading stock data...
            </p>
          )}

          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, borderRadius: "8px 0 0 8px" }}>ID</th>
                  <th style={{ ...th, textAlign: "left", paddingLeft: "20px" }}>Product</th>
                  <th style={th}>Purchase Qty</th>
                  <th style={th}>Sale Qty</th>
                  <th style={th}>Available Qty</th>
                  <th style={{ ...th, borderRadius: "0 8px 8px 0" }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={td}
                    >
                      {loading ? "Loading..." : "No Stock Found"}
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((item) => (
                    <tr
                      key={item.id}
                      style={row}
                    >
                      <td style={td}>{item.id}</td>

                      <td style={{ ...td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                        {item.product_name}
                      </td>

                      <td style={td}>{item.purchase_qty}</td>

                      <td style={td}>{item.sale_qty}</td>

                      <td
                        style={{
                          ...td,
                          fontWeight: "bold",
                          fontSize: "16px",
                          color:
                            item.available_qty > 10
                              ? "#16a34a"
                              : item.available_qty > 0
                                ? "#f59e0b"
                                : "#dc2626",
                        }}
                      >
                        {item.available_qty}
                      </td>

                      <td style={td}>
                        {item.available_qty > 10 ? (
                          <span style={green}>
                             In Stock
                          </span>
                        ) : item.available_qty > 0 ? (
                          <span style={orange}>
                             Low Stock
                          </span>
                        ) : (
                          <span style={red}>
                             Out of Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredStocks.length > 0 && (
            <div style={summary}>
              <span>Total Products: <strong>{filteredStocks.length}</strong></span>
              <span style={summaryDivider}>|</span>
              <span>
                In Stock: <strong style={{ color: "#16a34a" }}>
                  {filteredStocks.filter(item => item.available_qty > 10).length}
                </strong>
              </span>
              <span style={summaryDivider}>|</span>
              <span>
                Low Stock: <strong style={{ color: "#f59e0b" }}>
                  {filteredStocks.filter(item => item.available_qty > 0 && item.available_qty <= 10).length}
                </strong>
              </span>
              <span style={summaryDivider}>|</span>
              <span>
                Out of Stock: <strong style={{ color: "#dc2626" }}>
                  {filteredStocks.filter(item => item.available_qty === 0).length}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const page = {
  background: "#f8fafc",
  padding: 30,
  minHeight: "100vh",
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 15,
  boxShadow: "0 5px 20px rgba(0,0,0,.08)",
};

const shortcutBar = {
  background: "#0f172a",
  color: "#fff",
  padding: 15,
  borderRadius: 10,
  display: "flex",
  gap: 30,
  fontWeight: "bold",
  flexWrap: "wrap",
  marginBottom: 20
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 25,
  marginBottom: 20,
  gap: 10,
  flexWrap: "wrap",
};

const searchBox = {
  padding: 12,
  width: 320,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s"
};

const buttonGroup = {
  display: "flex",
  gap: 10,
};

const searchBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "500",
  transition: "background 0.2s"
};

const refreshBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "500",
  transition: "background 0.2s"
};

const tableContainer = {
  overflowX: "auto",
  marginTop: 20
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px"
};

const th = {
  padding: "14px 16px",
  background: "#1e293b",
  color: "#fff",
  textAlign: "center",
  fontWeight: "600"
};

const td = {
  padding: "14px 16px",
  textAlign: "center",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle"
};

const row = {
  textAlign: "center",
  transition: "background 0.2s",
  cursor: "default"
};

const green = {
  background: "#16a34a",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: 20,
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block"
};

const orange = {
  background: "#f59e0b",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: 20,
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block"
};

const red = {
  background: "#dc2626",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: 20,
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block"
};

const summary = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "25px",
  padding: "15px",
  background: "#f8fafc",
  borderRadius: "10px",
  fontSize: "14px",
  flexWrap: "wrap"
};

const summaryDivider = {
  color: "#cbd5e1"
};