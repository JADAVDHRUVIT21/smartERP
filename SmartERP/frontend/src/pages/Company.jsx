import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://smarterp-1-6rfs.onrender.com/api/company/";

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
        // Since event listeners capture the initial state scope, we read selectedId safely
        setSelectedId((currentId) => {
          if (currentId) {
            deleteCompany(currentId);
          }
          return currentId;
        });
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [company, editingId]); // Dependencies updated to ensure functions access fresh state data

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setCompanies(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load companies.");
    } finally {
      setLoading(false);
    }
  };

  const saveCompany = async () => {
    if (!company.company_name || !company.owner_name) {
      alert("Fill required fields");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API}${editingId}`, company);
        alert("Company Updated");
      } else {
        await axios.post(API, company);
        alert("Company Added");
      }
      clearForm();
      loadCompanies();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Unable to save company.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setCompany(initialState);
    setEditingId(null);
    setSelectedId(null);
  };

  const editCompany = (item) => {
    setEditingId(item.id);
    setSelectedId(item.id);
    setCompany(item);
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete Company?")) return;
    try {
      await axios.delete(`${API}${id}`);
      loadCompanies();
      clearForm();
    } catch (err) {
      console.log(err);
      alert("Error deleting company");
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

          <button style={reloadBtn} onClick={loadCompanies}>
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

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Company</th>
              <th style={th}>Owner</th>
              <th style={th}>Phone</th>
              <th style={th}>Action</th>
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
                      background: isSelected ? "#f1f5f9" : "transparent",
                      fontWeight: isSelected ? "500" : "normal"
                    }}
                  >
                    <td style={td}>{item.id}</td>
                    <td style={td}>{item.company_name}</td>
                    <td style={td}>{item.owner_name}</td>
                    <td style={td}>{item.phone || "-"}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{ ...reloadBtn, padding: "6px 12px", fontSize: 13 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents row selection override
                            editCompany(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...clearBtn, padding: "6px 12px", fontSize: 13 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents row selection override
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
            {companies.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "center", color: "#64748b" }}>
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// Styles
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
};

const reloadBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: 8,
  cursor: "pointer",
};

const clearBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: 8,
  cursor: "pointer",
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
  textAlign: "left",
};

const td = {
  padding: 12,
  border: "1px solid #e2e8f0",
  color: "#334155",
};