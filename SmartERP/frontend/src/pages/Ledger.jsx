import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { responsiveStyles } from "../styles/responsiveStyles";

export default function Ledger() {
  const [ledger, setLedger] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://smarterp-1-6rfs.onrender.com/ledger/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLedger(res.data);
      toast.success("Ledger loaded successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load ledger", {
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

  // Filter ledger entries
  const filteredLedger = ledger.filter(item =>
    item.party?.toLowerCase().includes(search.toLowerCase()) ||
    item.invoice?.toLowerCase().includes(search.toLowerCase()) ||
    item.type?.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate totals
  const totalDebit = filteredLedger.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = filteredLedger.reduce((sum, item) => sum + (item.credit || 0), 0);

  return (
    <Layout title="Ledger">
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
          }
        }}
      />

      <div style={responsiveStyles.page}>
        <div style={responsiveStyles.card}>
          <h1 style={responsiveStyles.title}>Ledger Transactions</h1>

          <div style={responsiveStyles.shortcutBar}>
            <span>📊 View All Transactions</span>
            <span>🔍 Search Records</span>
            <span>📈 Total: {filteredLedger.length} entries</span>
          </div>

          <input
            placeholder="Search by Party, Invoice or Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...responsiveStyles.searchBox,
              maxWidth: "100%",
              marginBottom: "20px",
            }}
          />

          {loading && <p style={loadingText}>Loading ledger data...</p>}

          <div style={tableWrapper}>
            <table style={responsiveStyles.table}>
              <thead>
                <tr>
                  <th style={{ ...responsiveStyles.th, borderRadius: "8px 0 0 8px", minWidth: "100px" }}>Date</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Type</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "120px", textAlign: "left", paddingLeft: "20px" }}>Party</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Invoice</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Debit</th>
                  <th style={{ ...responsiveStyles.th, borderRadius: "0 8px 8px 0", minWidth: "100px" }}>Credit</th>
                </tr>
              </thead>

              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={responsiveStyles.td}>
                      {loading ? "Loading..." : "No transactions found"}
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        ...responsiveStyles.row,
                        background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <td style={responsiveStyles.td}>{item.date}</td>

                      <td style={responsiveStyles.td}>
                        <span
                          style={{
                            ...typeBadge,
                            background: item.type === "Purchase" ? "#dc2626" : "#16a34a",
                          }}
                        >
                          {item.type}
                        </span>
                      </td>

                      <td style={{ ...responsiveStyles.td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                        {item.party}
                      </td>

                      <td style={responsiveStyles.td}>{item.invoice}</td>

                      <td style={{ ...responsiveStyles.td, color: "#dc2626", fontWeight: "bold" }}>
                        {item.debit > 0 ? `₹ ${item.debit}` : "-"}
                      </td>

                      <td style={{ ...responsiveStyles.td, color: "#16a34a", fontWeight: "bold" }}>
                        {item.credit > 0 ? `₹ ${item.credit}` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {!loading && filteredLedger.length > 0 && (
            <div style={responsiveStyles.summary}>
              <span>Total Entries: <strong>{filteredLedger.length}</strong></span>
              <span style={summaryDivider}>|</span>
              <span>
                Total Debit: <strong style={{ color: "#dc2626" }}>₹ {totalDebit.toLocaleString()}</strong>
              </span>
              <span style={summaryDivider}>|</span>
              <span>
                Total Credit: <strong style={{ color: "#16a34a" }}>₹ {totalCredit.toLocaleString()}</strong>
              </span>
              <span style={summaryDivider}>|</span>
              <span>
                Balance: <strong style={{ color: totalDebit > totalCredit ? "#dc2626" : "#16a34a" }}>
                  ₹ {(totalDebit - totalCredit).toLocaleString()}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ledger-table td, .ledger-table th {
            padding: 8px 10px;
            font-size: 12px;
          }
        }
        @media (max-width: 480px) {
          .ledger-table td, .ledger-table th {
            padding: 6px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </Layout>
  );
}

// Import toast
import toast, { Toaster } from "react-hot-toast";

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

const typeBadge = {
  color: "#fff",
  padding: "4px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  display: "inline-block",
  whiteSpace: "nowrap",
};

const summaryDivider = {
  color: "#cbd5e1",
};