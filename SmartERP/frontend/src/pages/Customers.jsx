import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const API = "https://smarterp-1-6rfs.onrender.com/customers/";

export default function Customers() {
  const initialForm = {
    customer_name: "",
    phone: "",
    email: "",
    address: ""
  };

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        saveCustomer();
      }

      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }

      if (e.key === "F4") {
        e.preventDefault();
        if (selectedId) {
          deleteCustomer(selectedId);
        } else {
          toast.error("Please select a customer first", {
            position: "top-right",
            duration: 3000,
            style: {
              background: "#ef4444",
              color: "#fff"
            }
          });
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        saveCustomer();
      }
    };

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [form, selectedId, editingId]);

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCustomers(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      toast.error("Failed to load customers", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearForm = () => {
    setForm(initialForm);
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

  const saveCustomer = async () => {
    if (!form.customer_name) {
      toast.error("Please enter customer name", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        await axios.put(
          `${API}${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("Customer Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(
          API,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success("Customer Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }

      clearForm();
      loadCustomers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Server Error", {
        position: "top-right",
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = (customer) => {
    setEditingId(customer.id);
    setSelectedId(customer.id);

    setForm({
      customer_name: customer.customer_name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || ""
    });

    toast.info("Editing customer: " + customer.customer_name, {
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

  const deleteCustomer = async (id) => {
    // Professional Delete Confirmation Toast
    toast.custom((t) => (
      <div style={deleteOverlay}>
        <div style={deleteContainer}>
          {/* Warning Icon */}
          <div style={deleteIconWrapper}>
            <div style={deleteIconCircle}>
              <svg style={deleteIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div style={deleteContent}>
            <h3 style={deleteTitle}>Delete Customer</h3>
            <p style={deleteMessage}>
              Are you sure you want to delete this customer? This action cannot be undone.
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
      const token = localStorage.getItem("token");
      await axios.delete(`${API}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      loadCustomers();
      toast.success("Customer Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      toast.error("Failed to delete customer", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Customers">
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
          <h1>Customer Master</h1>

          <div style={shortcut}>
            <span>F1 Save Customer</span>
            <span>F2 New</span>
            <span>F4 Delete</span>
            <span>Enter Save</span>
          </div>

          <div style={grid}>
            <input
              name="customer_name"
              placeholder="Enter Customer Name"
              value={form.customer_name}
              onChange={handleChange}
              style={input}
            />

            <input
              name="phone"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={handleChange}
              style={input}
            />

            <input
              name="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={handleChange}
              style={input}
            />

            <input
              name="address"
              placeholder="Enter Customer Address"
              value={form.address}
              onChange={handleChange}
              style={input}
            />
          </div>

          <button onClick={saveCustomer} style={saveBtn} disabled={loading}>
            {loading ? "Processing..." : editingId ? "Update Customer" : "Save Customer"}
          </button>

          <button onClick={clearForm} style={newBtn}>
            New
          </button>

          <h2>Customer List</h2>

          <input
            placeholder="Search Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />

          {loading && <p style={{ color: "#3b82f6" }}>Loading...</p>}

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Customer</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Address</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers
                .filter(c =>
                  c.customer_name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    style={
                      selectedId === c.id
                        ? selectedRow
                        : row
                    }
                  >
                    <td style={td}>{c.id}</td>
                    <td style={td}>{c.customer_name}</td>
                    <td style={td}>{c.phone}</td>
                    <td style={td}>{c.email}</td>
                    <td style={td}>{c.address}</td>

                    <td style={td}>
                      <button
                        onClick={() => editCustomer(c)}
                        style={editBtn}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCustomer(c.id)}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animation styles for custom toast */}
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

const page = {
  background: "#f1f5f9",
  padding: 30,
  minHeight: "100vh"
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 15,
  boxShadow: "0 5px 20px rgba(0,0,0,.1)"
};

const shortcut = {
  background: "#111827",
  color: "#fff",
  padding: 15,
  borderRadius: 10,
  display: "flex",
  gap: 30,
  marginBottom: 25,
  fontWeight: "bold"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 15
};

const input = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 8
};

const saveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: 0,
  padding: "12px 25px",
  borderRadius: 8,
  marginTop: 25,
  cursor: "pointer",
  fontWeight: "500"
};

const newBtn = {
  background: "#2563eb",
  color: "#fff",
  border: 0,
  padding: "12px 25px",
  borderRadius: 8,
  marginLeft: 10,
  cursor: "pointer",
  fontWeight: "500"
};

const searchBox = {
  padding: 12,
  width: 250,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 20,
  marginBottom: 20
};

const table = {
  width: "100%",
  marginTop: 20,
  borderCollapse: "collapse"
};

const th = {
  padding: 15,
  background: "#0f172a",
  color: "#fff"
};

const td = {
  padding: 14,
  textAlign: "center",
  borderBottom: "1px solid #ddd"
};

const row = {
  cursor: "pointer"
};

const selectedRow = {
  background: "#dbeafe",
  cursor: "pointer"
};

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: 0,
  padding: "7px 15px",
  borderRadius: 6,
  marginRight: 8,
  cursor: "pointer",
  fontWeight: "500"
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: 0,
  padding: "7px 15px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "500"
};