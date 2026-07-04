import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import { responsiveStyles } from "../styles/responsiveStyles";

export default function Invoice() {
  const API = "https://smarterp-1-6rfs.onrender.com/invoices/";

  const initialForm = {
    invoiceNo: "",
    invoiceDate: "",
    customerName: "",
    productName: "",
    quantity: "",
    price: ""
  };

  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const stateRef = useRef({ form, editingId, selectedId });
  useEffect(() => {
    stateRef.current = { form, editingId, selectedId };
  }, [form, editingId, selectedId]);

  useEffect(() => {
    loadInvoices();

    const shortcut = (e) => {
      const current = stateRef.current;
      
      if (e.key === "F1") {
        e.preventDefault();
        saveInvoice();
      }
      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }
      if (e.key === "F3") {
        e.preventDefault();
        if (current.editingId) {
          saveInvoice();
        } else {
          toast.error("Please select an invoice first", {
            position: "top-right",
            duration: 3000,
            style: {
              background: "#ef4444",
              color: "#fff"
            }
          });
        }
      }
      if (e.key === "F4") {
        e.preventDefault();
        if (current.selectedId) {
          deleteInvoice(current.selectedId);
        } else {
          toast.error("Please select an invoice first", {
            position: "top-right",
            duration: 3000,
            style: {
              background: "#ef4444",
              color: "#fff"
            }
          });
        }
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setInvoices(res.data);
      toast.success("Invoices loaded successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices", {
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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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

  const saveInvoice = async () => {
    const currentForm = stateRef.current.form;
    const currentEditingId = stateRef.current.editingId;

    if (
      !currentForm.invoiceNo ||
      !currentForm.customerName ||
      !currentForm.productName ||
      !currentForm.quantity ||
      !currentForm.price
    ) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      return;
    }

    const data = {
      invoice_no: currentForm.invoiceNo,
      invoice_date: currentForm.invoiceDate,
      customer_name: currentForm.customerName,
      product_name: currentForm.productName,
      quantity: Number(currentForm.quantity),
      price: Number(currentForm.price),
    };

    setLoading(true);

    try {
      if (currentEditingId) {
        await axios.put(`${API}${currentEditingId}`, data);
        toast.success("Invoice Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(API, data);
        toast.success("Invoice Saved Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }
      clearForm();
      loadInvoices();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Server Error", {
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

  const editInvoice = (item) => {
    setEditingId(item.id);
    setSelectedId(item.id);

    setForm({
      invoiceNo: item.invoice_no || "",
      invoiceDate: item.invoice_date || "",
      customerName: item.customer_name || "",
      productName: item.product_name || "",
      quantity: item.quantity || "",
      price: item.price || "",
    });

    toast.info("Editing invoice: " + item.invoice_no, {
      position: "top-right",
      duration: 2000,
      style: {
        background: "#3b82f6",
        color: "#fff"
      }
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteInvoice = async (id) => {
    toast.custom((t) => (
      <div style={responsiveStyles.deleteOverlay}>
        <div style={responsiveStyles.deleteContainer}>
          <div style={deleteIconWrapper}>
            <div style={deleteIconCircle}>
              <svg style={deleteIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div style={deleteContent}>
            <h3 style={deleteTitle}>Delete Invoice</h3>
            <p style={deleteMessage}>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </p>
          </div>

          <div style={responsiveStyles.deleteActions}>
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
      loadInvoices();
      toast.success("Invoice Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete invoice", {
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

  return (
    <Layout title="Invoice Management">
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
          <h1 style={responsiveStyles.title}>Invoice Management</h1>

          <div style={responsiveStyles.shortcutBar}>
            <span>F1 Save Invoice</span>
            <span>F2 New Invoice</span>
            <span>F3 Update Invoice</span>
            <span>F4 Delete Invoice</span>
          </div>

          <div style={responsiveStyles.grid}>
            <input 
              placeholder="Invoice No *" 
              name="invoiceNo" 
              value={form.invoiceNo} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
            <input 
              type="date" 
              name="invoiceDate" 
              value={form.invoiceDate} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
            <input 
              placeholder="Customer Name *" 
              name="customerName" 
              value={form.customerName} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
            <input 
              placeholder="Product Name *" 
              name="productName" 
              value={form.productName} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
            <input 
              type="number" 
              placeholder="Quantity *" 
              name="quantity" 
              value={form.quantity} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
            <input 
              type="number" 
              placeholder="Price *" 
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              style={responsiveStyles.input} 
            />
          </div>

          <div style={responsiveStyles.buttonRow}>
            <button 
              onClick={saveInvoice} 
              style={{
                ...responsiveStyles.saveBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }} 
              disabled={loading}
            >
              {loading ? "Processing..." : editingId ? "Update Invoice" : "Save Invoice"}
            </button>
            <button onClick={clearForm} style={responsiveStyles.reloadBtn}>
              New
            </button>
          </div>

          <h2 style={responsiveStyles.h2}>Invoice List</h2>

          <input
            placeholder="Search Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...responsiveStyles.searchBox,
              marginBottom: 20,
            }}
          />

          {loading && <p style={loadingText}>Loading...</p>}

          <div style={tableWrapper}>
            <table style={responsiveStyles.table}>
              <thead>
                <tr>
                  <th style={{ ...responsiveStyles.th, borderRadius: "8px 0 0 8px" }}>ID</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Invoice</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Date</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "120px", textAlign: "left", paddingLeft: "20px" }}>Customer</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "120px" }}>Product</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "60px" }}>Qty</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "80px" }}>Price</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Total</th>
                  <th style={{ ...responsiveStyles.th, borderRadius: "0 8px 8px 0", minWidth: "130px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices
                  .filter((i) => i.customer_name?.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          ...responsiveStyles.row,
                          ...(isSelected ? responsiveStyles.selectedRow : {})
                        }}
                      >
                        <td style={responsiveStyles.td}>{item.id}</td>
                        <td style={responsiveStyles.td}>{item.invoice_no}</td>
                        <td style={responsiveStyles.td}>{item.invoice_date}</td>
                        <td style={{ ...responsiveStyles.td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                          {item.customer_name}
                        </td>
                        <td style={responsiveStyles.td}>{item.product_name}</td>
                        <td style={responsiveStyles.td}>{item.quantity}</td>
                        <td style={responsiveStyles.td}>₹ {item.price}</td>
                        <td style={{ ...responsiveStyles.td, fontWeight: "bold", color: "#16a34a" }}>
                          ₹ {item.total_amount}
                        </td>
                        <td style={responsiveStyles.td}>
                          <div style={actionButtonGroup}>
                            <button
                              onClick={(e) => { e.stopPropagation(); editInvoice(item); }}
                              style={responsiveStyles.editBtn}
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteInvoice(item.id); }}
                              style={responsiveStyles.deleteBtn}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {invoices.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} style={{ ...responsiveStyles.td, textAlign: "center", color: "#64748b" }}>
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && invoices.length > 0 && (
            <div style={responsiveStyles.summary}>
              <span>Total Invoices: <strong>{invoices.length}</strong></span>
              <span style={summaryDivider}>|</span>
              <span>Total Amount: <strong style={{ color: "#16a34a" }}>
                ₹ {invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toLocaleString()}
              </strong></span>
            </div>
          )}
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

        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
            gap: 4px;
          }
          .action-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}

// Delete Toast Styles
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

const actionButtonGroup = {
  display: "flex",
  gap: "8px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const summaryDivider = {
  color: "#cbd5e1"
};