import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

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
                Delete Sale?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this sale? This action cannot be undone.
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

      <div style={page}>
        <div style={card}>
          <h1>Sales Master</h1>

          <div style={shortcutBar}>
            <span>F1 Save Sale</span>
            <span>F2 New</span>
            <span>F3 Update Sale</span>
            <span>F4 Delete</span>
          </div>

          <div style={grid}>
            <input
              placeholder="Customer Name"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              placeholder="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              placeholder="Invoice Number"
              name="invoiceNo"
              value={form.invoiceNo}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Selling Price"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="GST %"
              name="gst"
              value={form.gst}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Discount"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              style={inputStyle}
            />

            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>CASH</option>
              <option>CREDIT</option>
            </select>

            <input
              type="number"
              placeholder="Paid Amount"
              name="paidAmount"
              value={form.paidAmount}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button onClick={saveSale} style={saveBtn} disabled={loading}>
            {loading ? "Processing..." : editingId ? "Update Sale" : "Save Sale"}
          </button>

          <button onClick={clearForm} style={newBtn}>
            New
          </button>

          <h2>Sales List</h2>

          <input
            placeholder="Search Customer/Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />

          {loading && <p style={{ color: "#3b82f6" }}>Loading...</p>}

          <table style={table}>
            <thead>
              <tr style={thRow}>
                <th style={{ ...thStyle, borderRadius: "8px 0 0 8px" }}>ID</th>
                <th style={{ ...thStyle, textAlign: "left", paddingLeft: "20px" }}>Customer</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Invoice</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Amount</th>
                <th style={{ ...thStyle, borderRadius: "0 8px 8px 0" }}>Action</th>
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
                      ...trStyle,
                      background: selectedId === s.id ? "#dbeafe" : "white"
                    }}
                  >
                    <td style={tdStyle}>{s.id}</td>
                    <td style={{ ...tdStyle, textAlign: "left", paddingLeft: "20px" }}>{s.customer_name}</td>
                    <td style={tdStyle}>{s.product_name}</td>
                    <td style={tdStyle}>{s.quantity}</td>
                    <td style={tdStyle}>{s.invoice_no}</td>
                    <td style={tdStyle}>{s.invoice_date}</td>
                    <td style={{ ...tdStyle, fontWeight: "500" }}>₹ {s.total_amount}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editSale(s);
                        }}
                        style={editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSale(s.id);
                        }}
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

// Styling definitions
const page = {
  background: "#f8fafc",
  padding: 30,
  minHeight: "100vh"
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 15,
  boxShadow: "0 5px 20px rgba(0,0,0,.08)"
};

const shortcutBar = {
  background: "#0f172a",
  color: "#fff",
  padding: 15,
  borderRadius: 10,
  display: "flex",
  gap: 30,
  fontWeight: "bold",
  marginBottom: 20
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 15,
  marginTop: 25
};

const inputStyle = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: "14px"
};

const searchBox = {
  ...inputStyle,
  width: 250,
  marginTop: 20,
  marginBottom: 20
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

const table = {
  width: "100%",
  marginTop: 20,
  borderCollapse: "collapse",
  fontSize: "14px",
  color: "#334155"
};

const thRow = {
  background: "#0f172a",
  color: "#fff",
  textAlign: "center",
  height: "50px"
};

const thStyle = {
  padding: "14px 16px",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "center"
};

const trStyle = {
  textAlign: "center",
  borderBottom: "1px solid #f1f5f9",
  height: "60px",
  cursor: "pointer",
  transition: "background 0.2s ease"
};

const tdStyle = {
  padding: "14px 16px",
  verticalAlign: "middle"
};

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: 0,
  padding: "6px 16px",
  borderRadius: "6px",
  fontWeight: "500",
  cursor: "pointer",
  marginRight: 8
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: 0,
  padding: "6px 16px",
  borderRadius: "6px",
  fontWeight: "500",
  cursor: "pointer"
};