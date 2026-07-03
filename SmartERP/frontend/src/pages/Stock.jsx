import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";

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
        const res = await API.get("/stock/");

        console.log("Response:", res.data);
        console.log("Is Array:", Array.isArray(res.data));
      console.log(res.data);

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
    } catch (err) {
      console.log(err);
      setStocks([]);
      setFilteredStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredStocks(stocks);
      return;
    }

    const result = stocks.filter((item) =>
      item.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredStocks(result);
  };

  const handleRefresh = () => {
    setSearch("");
    loadStock();
  };

  return (
    <Layout title="Stock">
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
              style={searchBox}
            />

            <div style={buttonGroup}>
              <button
                onClick={handleSearch}
                style={searchBtn}
              >
                Search
              </button>

              <button
                onClick={handleRefresh}
                style={refreshBtn}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <p style={{ textAlign: "center" }}>
              Loading...
            </p>
          )}

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Product</th>
                <th style={th}>Purchase Qty</th>
                <th style={th}>Sale Qty</th>
                <th style={th}>Available Qty</th>
                <th style={th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStocks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={td}
                  >
                    No Stock Found
                  </td>
                </tr>
              ) : (
                filteredStocks.map((item) => (
                  <tr
                    key={item.id}
                    style={row}
                  >
                    <td style={td}>{item.id}</td>

                    <td style={td}>{item.product_name}</td>

                    <td style={td}>{item.purchase_qty}</td>

                    <td style={td}>{item.sale_qty}</td>

                    <td
                      style={{
                        ...td,
                        fontWeight: "bold",
                        color:
                          item.available_qty > 10
                            ? "green"
                            : item.available_qty > 0
                            ? "orange"
                            : "red",
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
};

const refreshBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: 8,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: 12,
  background: "#1e293b",
  color: "#fff",
};

const td = {
  padding: 12,
  textAlign: "center",
  borderBottom: "1px solid #e5e7eb",
};

const row = {
  textAlign: "center",
};

const green = {
  background: "#16a34a",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: 20,
};

const orange = {
  background: "#f59e0b",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: 20,
};

const red = {
  background: "#dc2626",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: 20,
};