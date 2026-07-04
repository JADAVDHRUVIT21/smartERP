import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

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
    // Custom confirm toast with pulsing animation icon
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Delete Invoice?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this invoice? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-right"
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

      <div style={page}>
        <div style={card}>
          <h1 style={titleStyle}>Invoice Management</h1>

          <div style={shortcutBar}>
            <span><kbd style={kbdStyle}>F1</kbd> Save Invoice</span>
            <span><kbd style={kbdStyle}>F2</kbd> New Invoice</span>
            <span><kbd style={kbdStyle}>F3</kbd> Update Invoice</span>
            <span><kbd style={kbdStyle}>F4</kbd> Delete Invoice</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <input
              placeholder="Search Customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchBox}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // Optional: handle search
                }
              }}
            />
            {loading && <span style={{ color: "#64748b", fontSize: "14px" }}>Loading data...</span>}
          </div>

          <div style={grid}>
            <input placeholder="Invoice No" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} style={input} />
            <input type="date" name="invoiceDate" value={form.invoiceDate} onChange={handleChange} style={input} />
            <input placeholder="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} style={input} />
            <input placeholder="Product Name" name="productName" value={form.productName} onChange={handleChange} style={input} />
            <input type="number" placeholder="Quantity" name="quantity" value={form.quantity} onChange={handleChange} style={input} />
            <input type="number" placeholder="Price" name="price" value={form.price} onChange={handleChange} style={input} />
          </div>

          <div style={{ marginTop: 25 }}>
            <button onClick={saveInvoice} style={saveBtn} disabled={loading}>
              {loading ? "Processing..." : editingId ? "Update Invoice" : "Save Invoice"}
            </button>
            <button onClick={clearForm} style={newBtn}>
              New
            </button>
          </div>

          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr style={thRow}>
                  <th style={{ ...th, borderRadius: "8px 0 0 8px" }}>ID</th>
                  <th style={th}>Invoice</th>
                  <th style={th}>Date</th>
                  <th style={{ ...th, textAlign: "left", paddingLeft: "20px" }}>Customer</th>
                  <th style={th}>Product</th>
                  <th style={th}>Qty</th>
                  <th style={th}>Price</th>
                  <th style={th}>Total</th>
                  <th style={{ ...th, borderRadius: "0 8px 8px 0" }}>Action</th>
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
                          ...tr,
                          ...(isSelected ? rowSelected : {})
                        }}
                      >
                        <td style={td}>{item.id}</td>
                        <td style={td}>{item.invoice_no}</td>
                        <td style={td}>{item.invoice_date}</td>
                        <td style={{ ...td, textAlign: "left", paddingLeft: "20px", fontWeight: "500" }}>
                          {item.customer_name}
                        </td>
                        <td style={td}>{item.product_name}</td>
                        <td style={td}>{item.quantity}</td>
                        <td style={td}>₹ {item.price}</td>
                        <td style={{ ...td, fontWeight: "bold", color: "#16a34a" }}>
                          ₹ {item.total_amount}
                        </td>
                        <td style={td}>
                          <button
                            onClick={(e) => { e.stopPropagation(); editInvoice(item); }}
                            style={editBtn}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteInvoice(item.id); }}
                            style={deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {!loading && invoices.length > 0 && (
            <div style={summary}>
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
        @keyframes enter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes leave {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-enter {
          animation: enter 0.3s ease-out;
        }
        .animate-leave {
          animation: leave 0.2s ease-in;
        }
        .animate-pulse {
          animation: pulse 0.8s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
}

// --- Dynamic Matching UI Styles ---
const page = {
  background: "#f8fafc",
  padding: "30px",
  minHeight: "100vh",
  fontFamily: "system-ui, -apple-system, sans-serif"
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 15,
  boxShadow: "0 5px 20px rgba(0,0,0,.08)"
};

const titleStyle = {
  margin: "0 0 20px 0",
  fontSize: "24px",
  color: "#0f172a",
  fontWeight: "bold"
};

const shortcutBar = {
  background: "#0f172a",
  color: "#fff",
  padding: 15,
  borderRadius: 10,
  display: "flex",
  gap: 30,
  fontWeight: "bold",
  fontSize: "14px"
};

const kbdStyle = {
  background: "#1e293b",
  padding: "2px 6px",
  borderRadius: "4px",
  marginRight: "6px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 15,
  marginTop: 25
};

const input = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: "14px"
};

const searchBox = {
  ...input,
  width: 250
};

const saveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: 0,
  padding: "12px 25px",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
};

const newBtn = {
  background: "#2563eb",
  color: "#fff",
  border: 0,
  padding: "12px 25px",
  borderRadius: 8,
  fontWeight: "bold",
  marginLeft: 10,
  cursor: "pointer"
};

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: 0,
  padding: "7px 15px",
  borderRadius: 4,
  marginRight: 6,
  cursor: "pointer"
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: 0,
  padding: "7px 15px",
  borderRadius: 4,
  cursor: "pointer"
};

const tableContainer = {
  overflowX: "auto",
  marginTop: 25,
  borderRadius: "8px 8px 0 0",
  border: "1px solid #e2e8f0"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const thRow = {
  background: "#0f172a"
};

const th = {
  padding: "12px 15px",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "center"
};

const tr = {
  borderBottom: "1px solid #e2e8f0",
  cursor: "pointer",
  background: "#ffffff"
};

const rowSelected = {
  background: "#dbeafe"
};

const td = {
  padding: "12px 15px",
  fontSize: "14px",
  color: "#334155",
  textAlign: "center"
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