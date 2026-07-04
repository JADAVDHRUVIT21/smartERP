import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import { responsiveStyles } from "../styles/responsiveStyles";

const API = "https://smarterp-1-6rfs.onrender.com/sales/";

export default function Sales() {
  const initialForm = {
    customerName: "",
    productName: "",
    quantity: "",
    invoiceNo: "",
    invoiceDate: "",
    sellingPrice: "",
    gst: "18",
    discount: "0",
    paymentType: "CASH",
    paidAmount: ""
  };

  const [sales, setSales] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSales();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        saveSale();
      }

      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }

      if (e.key === "F3") {
        e.preventDefault();
        if (editingId) {
          saveSale();
        } else {
          toast.error("Please select a sale first", {
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
        if (selectedId) {
          deleteSale(selectedId);
        } else {
          toast.error("Please select a sale first", {
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

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [form, editingId, selectedId]);

  const loadSales = async () => {
    try {
      const res = await axios.get(API);
      setSales(res.data);
    } catch (err) {
      toast.error("Failed to load sales", {
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

  const saveSale = async () => {
    if (
      !form.customerName ||
      !form.productName ||
      !form.quantity ||
      !form.invoiceNo ||
      !form.invoiceDate ||
      !form.sellingPrice ||
      !form.paidAmount
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

    setLoading(true);

    try {
      const data = {
        customer_name: form.customerName,
        product_name: form.productName,
        quantity: Number(form.quantity),
        invoice_no: form.invoiceNo,
        invoice_date: form.invoiceDate,
        selling_price: Number(form.sellingPrice),
        gst: Number(form.gst),
        discount: Number(form.discount),
        payment_type: form.paymentType,
        paid_amount: Number(form.paidAmount)
      };

      if (editingId) {
        await axios.put(`${API}${editingId}`, data);
        toast.success("Sale Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(API, data);
        toast.success("Sale Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }

      clearForm();
      loadSales();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Server Error", {
        position: "top-right",
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff"
        }
      });
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  const editSale = (sale) => {
    setEditingId(sale.id);
    setSelectedId(sale.id);

    setForm({
      customerName: sale.customer_name || "",
      productName: sale.product_name || "",
      quantity: sale.quantity || "",
      invoiceNo: sale.invoice_no || "",
      invoiceDate: sale.invoice_date || "",
      sellingPrice: sale.selling_price || "",
      gst: sale.gst || 18,
      discount: sale.discount || 0,
      paymentType: sale.payment_type || "CASH",
      paidAmount: sale.paid_amount || ""
    });

    toast.info("Editing sale: " + sale.invoice_no, {
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

  const deleteSale = async (id) => {
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
            <h3 style={deleteTitle}>Delete Sale</h3>
            <p style={deleteMessage}>
              Are you sure you want to delete this sale? This action cannot be undone.
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
      loadSales();
      toast.success("Sale Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      toast.error("Failed to delete sale", {
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
    <Layout title="Sales">
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
          <h1 style={responsiveStyles.title}>Sales Master</h1>

          <div style={responsiveStyles.shortcutBar}>
            <span>F1 Save Sale</span>
            <span>F2 New</span>
            <span>F3 Update Sale</span>
            <span>F4 Delete</span>
          </div>

          <div style={responsiveStyles.grid}>
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
              placeholder="Invoice Number *"
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
              type="number"
              placeholder="Selling Price *"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              style={responsiveStyles.input}
            />

            <input
              type="number"
              placeholder="GST %"
              name="gst"
              value={form.gst}
              onChange={handleChange}
              style={responsiveStyles.input}
            />

            <input
              type="number"
              placeholder="Discount"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              style={responsiveStyles.input}
            />

            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              style={responsiveStyles.input}
            >
              <option value="CASH">CASH</option>
              <option value="CREDIT">CREDIT</option>
            </select>

            <input
              type="number"
              placeholder="Paid Amount *"
              name="paidAmount"
              value={form.paidAmount}
              onChange={handleChange}
              style={responsiveStyles.input}
            />
          </div>

          <div style={responsiveStyles.buttonRow}>
            <button 
              onClick={saveSale} 
              style={{
                ...responsiveStyles.saveBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }} 
              disabled={loading}
            >
              {loading ? "Processing..." : editingId ? "Update Sale" : "Save Sale"}
            </button>

            <button onClick={clearForm} style={responsiveStyles.reloadBtn}>
              New
            </button>
          </div>

          <h2 style={responsiveStyles.h2}>Sales List</h2>

          <input
            placeholder="Search Customer/Product"
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
                  <th style={{ ...responsiveStyles.th, minWidth: "120px", textAlign: "left", paddingLeft: "20px" }}>Customer</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "120px" }}>Product</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "60px" }}>Qty</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Invoice</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Date</th>
                  <th style={{ ...responsiveStyles.th, minWidth: "100px" }}>Amount</th>
                  <th style={{ ...responsiveStyles.th, borderRadius: "0 8px 8px 0", minWidth: "130px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {sales
                  .filter(s =>
                    s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                    s.product_name?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(s => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      style={{
                        ...responsiveStyles.row,
                        background: selectedId === s.id ? "#dbeafe" : "white"
                      }}
                    >
                      <td style={responsiveStyles.td}>{s.id}</td>
                      <td style={{ ...responsiveStyles.td, textAlign: "left", paddingLeft: "20px" }}>{s.customer_name}</td>
                      <td style={responsiveStyles.td}>{s.product_name}</td>
                      <td style={responsiveStyles.td}>{s.quantity}</td>
                      <td style={responsiveStyles.td}>{s.invoice_no}</td>
                      <td style={responsiveStyles.td}>{s.invoice_date}</td>
                      <td style={{ ...responsiveStyles.td, fontWeight: "500" }}>₹ {s.total_amount}</td>
                      <td style={responsiveStyles.td}>
                        <div style={actionButtonGroup}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editSale(s);
                            }}
                            style={responsiveStyles.editBtn}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSale(s.id);
                            }}
                            style={responsiveStyles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {sales.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} style={{ ...responsiveStyles.td, textAlign: "center", color: "#64748b" }}>
                      No sales found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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