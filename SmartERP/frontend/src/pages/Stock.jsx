import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { responsiveStyles } from "../styles/responsiveStyles";

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

      <div style={responsiveStyles.page}>
        <div style={responsiveStyles.card}>
          <h1 style={responsiveStyles.title}>Stock Master</h1>

          <div style={responsiveStyles.shortcutBar}>
            <span>F1 Refresh</span>
            <span>F2 Focus Search</span>
            <span>F3 Search</span>
            <span>F4 Reset</span>
          </div>

          <div style={headerContainer}>
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
              style={{
                ...responsiveStyles.searchBox,
                maxWidth: "100%",
              }}
            />

            <div style={buttonGroup}>
              <button
                onClick={handleSearch}
                style={{
                  ...responsiveStyles.saveBtn,
                  padding: "10px 20px",
                }}
                disabled={loading}
              >
                Search
              </button>

              <button
                onClick={handleRefresh}
                style={{
                  ...responsiveStyles.reloadBtn,
                  padding: "10px 20px",
                }}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && <p style={loadingText}>Loading stock data...</p>}

          <div style={tableWrapper}>
            <table style={responsiveStyles.table}>
              <thead>
                <tr>
                  <th style={{ ...responsiveStyles.th, borderRadius: "8px 0 0 8px" }}>ID</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "150px", textAlign: "left", paddingLeft: "20px" }}>Product</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "80px" }}>Purchase Qty</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "80px" }}>Sale Qty</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "80px" }}>Available Qty</th>
                  <th style={{ ...responsiveStyles.th, borderRadius: "0 8px 8px 0", minWidth: "100px" }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={responsiveStyles.td}>
                      {loading ? "Loading..." : "No Stock Found"}
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((item) => (
                    <tr key={item.id} style={responsiveStyles.row}>
                      <td style={responsiveStyles.td}>{item.id}</td>
                      <td style={{ ...responsiveStyles.td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                        {item.product_name}
                      </td>
                      <td style={responsiveStyles.td}>{item.purchase_qty}</td>
                      <td style={responsiveStyles.td}>{item.sale_qty}</td>
                      <td style={{ 
                        ...responsiveStyles.td, 
                        fontWeight: "bold", 
                        fontSize: "16px",
                        color: item.available_qty > 10 ? "#16a34a" : item.available_qty > 0 ? "#f59e0b" : "#dc2626",
                      }}>
                        {item.available_qty}
                      </td>
                      <td style={responsiveStyles.td}>
                        {item.available_qty > 10 ? (
                          <span style={statusGreen}>✅ In Stock</span>
                        ) : item.available_qty > 0 ? (
                          <span style={statusOrange}>⚠️ Low Stock</span>
                        ) : (
                          <span style={statusRed}>❌ Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredStocks.length > 0 && (
            <div style={responsiveStyles.summary}>
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

const headerContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "25px",
  marginBottom: "20px",
  gap: "10px",
  flexWrap: "wrap",
  width: "100%",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const loadingText = {
  color: "#3b82f6",
  textAlign: "center",
  padding: "20px",
};

const tableWrapper = {
  overflowX: "auto",
  marginTop: "20px",
  WebkitOverflowScrolling: "touch",
};

const statusGreen = {
  background: "#16a34a",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block",
};

const statusOrange = {
  background: "#f59e0b",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block",
};

const statusRed = {
  background: "#dc2626",
  color: "#fff",
  padding: "5px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "500",
  display: "inline-block",
};

const summaryDivider = {
  color: "#cbd5e1",
};