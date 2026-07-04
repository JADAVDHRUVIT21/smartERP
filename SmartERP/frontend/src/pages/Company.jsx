import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const API = "https://smarterp-1-6rfs.onrender.com/companies/";

export default function Company() {
  const initialState = {
    company_name: "",
    owner_name: "",
    phone: "",
    email: "",
    gst_number: "",
    address: "",
  };

  const [company, setCompany] = useState(initialState);
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        saveCompany();
      }

      if (e.key === "F2") {
        e.preventDefault();
        loadCompanies();
      }

      if (e.key === "F3") {
        e.preventDefault();
        clearForm();
      }

      if (e.key === "F4") {
        e.preventDefault();
        setSelectedId((currentId) => {
          if (currentId) {
            deleteCompany(currentId);
          } else {
            toast.error("Please select a company first", {
              position: "top-right",
              duration: 3000,
              style: {
                background: "#ef4444",
                color: "#fff"
              }
            });
          }
          return currentId;
        });
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [company, editingId]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setCompanies(res.data);
      toast.success("Companies loaded successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("Unable to load companies", {
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

  const saveCompany = async () => {
    if (!company.company_name || !company.owner_name) {
      toast.error("Company Name and Owner Name are required", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API}${editingId}`, company);
        toast.success("Company Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(API, company);
        toast.success("Company Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }
      clearForm();
      loadCompanies();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.detail || "Unable to save company", {
        position: "top-right",
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setCompany(initialState);
    setEditingId(null);
    setSelectedId(null);
    toast.success("Form cleared successfully!", {
      position: "top-right",
      duration: 2000,
      style: {
        background: "#22c55e",
        color: "#fff"
      }
    });
  };

  const editCompany = (item) => {
    setEditingId(item.id);
    setSelectedId(item.id);
    setCompany(item);
    toast.info("Editing company: " + item.company_name, {
      position: "top-right",
      duration: 2000,
      style: {
        background: "#3b82f6",
        color: "#fff"
      }
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteCompany = async (id) => {
    // Professional Delete Confirmation Toast with Pulse Animation
    toast.custom((t) => (
      <div style={deleteOverlay}>
        <div style={deleteContainer}>
          {/* Warning Icon with Pulse */}
          <div style={deleteIconWrapper}>
            <div style={deleteIconCircle}>
              <svg style={deleteIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div style={deleteContent}>
            <h3 style={deleteTitle}>Delete Company</h3>
            <p style={deleteMessage}>
              Are you sure you want to delete this company? This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div style={deleteActions}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(id);
              }}
              style={deleteButton}
              onMouseEnter={(e) => {
                e.target.style.background = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#ef4444";
              }}
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={cancelButton}
              onMouseEnter={(e) => {
                e.target.style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
    });
  };

  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API}${id}`);
      loadCompanies();
      clearForm();
      toast.success("Company Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("Error deleting company", {
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

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout title="Company Profile">
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

      <div style={card}>
        <h1>Company Information</h1>

        <div style={shortcutBar}>
          <span>F1 Save</span>
          <span>F2 Reload List</span>
          <span>F3 Clear Form</span>
          <span>F4 Delete Selected</span>
        </div>

        {/* Input Form Fields */}
        <div style={grid}>
          <input
            name="company_name"
            placeholder="Company Name *"
            value={company.company_name}
            onChange={handleChange}
            style={input}
          />

          <input
            name="owner_name"
            placeholder="Owner Name *"
            value={company.owner_name}
            onChange={handleChange}
            style={input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={company.phone}
            onChange={handleChange}
            style={input}
          />

          <input
            name="email"
            placeholder="Email"
            value={company.email}
            onChange={handleChange}
            style={input}
          />

          <input
            name="gst_number"
            placeholder="GST Number"
            value={company.gst_number}
            onChange={handleChange}
            style={input}
          />
        </div>

        <textarea
          name="address"
          placeholder="Company Address"
          value={company.address}
          onChange={handleChange}
          rows={5}
          style={textarea}
        />

        {/* Action Buttons */}
        <div style={buttonRow}>
          <button style={saveBtn} onClick={saveCompany} disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update Company" : "Save Company"}
          </button>

          <button style={reloadBtn} onClick={loadCompanies} disabled={loading}>
            Reload List
          </button>

          <button style={clearBtn} onClick={clearForm}>
            Clear
          </button>
        </div>

        <hr style={{ margin: "40px 0", border: "0", borderTop: "1px solid #e2e8f0" }} />

        {/* Company List Table Section */}
        <h2>Company List</h2>

        <input
          placeholder="Search Company..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ ...input, width: "100%", boxSizing: "border-box", marginBottom: 20 }}
        />

        {loading && <p style={{ color: "#3b82f6", textAlign: "center" }}>Loading...</p>}

        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...th, borderRadius: "8px 0 0 8px" }}>ID</th>
              <th style={th}>Company</th>
              <th style={th}>Owner</th>
              <th style={th}>Phone</th>
              <th style={{ ...th, borderRadius: "0 8px 8px 0" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies
              .filter((c) =>
                c.company_name?.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      ...tableRow,
                      background: isSelected ? "#dbeafe" : "transparent",
                      fontWeight: isSelected ? "500" : "normal"
                    }}
                  >
                    <td style={td}>{item.id}</td>
                    <td style={{ ...td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                      {item.company_name}
                    </td>
                    <td style={td}>{item.owner_name}</td>
                    <td style={td}>{item.phone || "-"}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button
                          style={{ ...reloadBtn, padding: "6px 16px", fontSize: 13, borderRadius: 6 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            editCompany(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...clearBtn, padding: "6px 16px", fontSize: 13, borderRadius: 6 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCompany(item.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {companies.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "center", color: "#64748b" }}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-enter {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-leave {
          animation: fadeOut 0.2s ease-in;
        }
        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
}

// Delete Toast Styles
const deleteOverlay = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "20px",
};

const deleteContainer = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  width: "440px",
  maxWidth: "95vw",
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  animation: "fadeIn 0.25s ease-out",
};

const deleteIconWrapper = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const deleteIconCircle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#fef2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "pulse 1s ease-in-out infinite",
};

const deleteIconSvg = {
  width: "36px",
  height: "36px",
  color: "#ef4444",
};

const deleteContent = {
  marginBottom: "28px",
};

const deleteTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 8px 0",
};

const deleteMessage = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  lineHeight: "1.6",
};

const deleteActions = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};

const deleteButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 36px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.2s",
  minWidth: "120px",
};

const cancelButton = {
  background: "transparent",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "10px 36px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  minWidth: "120px",
};

// Main Styles
const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 5px 20px rgba(0,0,0,.08)",
};

const shortcutBar = {
  display: "flex",
  justifyContent: "space-around",
  background: "#0f172a",
  color: "#fff",
  padding: 15,
  borderRadius: 10,
  margin: "20px 0",
  fontWeight: "bold",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 15,
};

const input = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 15,
};

const textarea = {
  width: "100%",
  padding: 12,
  marginTop: 20,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  resize: "vertical",
};

const buttonRow = {
  display: "flex",
  gap: 15,
  marginTop: 20,
  flexWrap: "wrap",
};

const saveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "500"
};

const reloadBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "500"
};

const clearBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "500"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20,
};

const tableRow = {
  cursor: "pointer",
  transition: "background 0.2s ease",
};

const th = {
  padding: 12,
  border: "1px solid #e2e8f0",
  background: "#0f172a",
  color: "#fff",
  textAlign: "center",
};

const td = {
  padding: 12,
  border: "1px solid #e2e8f0",
  color: "#334155",
  textAlign: "center",
};