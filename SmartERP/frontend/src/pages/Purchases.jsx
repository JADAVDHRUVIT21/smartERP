import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const API = "https://smarterp-1-6rfs.onrender.com/purchases/";

export default function Purchases() {
  const initialForm = {
    supplierName: "",
    productName: "",
    quantity: "",
    invoiceNo: "",
    invoiceDate: "",
    purchasePrice: "",
    gst: "18",
    discount: "0",
    totalAmount: "",
  };

  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPurchases();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        savePurchase();
      }

      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }

      if (e.key === "F3") {
        e.preventDefault();
        if (editingId) {
          savePurchase();
        } else {
          toast.error("Please select a purchase first", {
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
          deletePurchase(selectedId);
        } else {
          toast.error("Please select a purchase first", {
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

  const loadPurchases = async () => {
    try {
      const res = await axios.get(API);
      setPurchases(res.data);
    } catch (err) {
      toast.error("Failed to load purchases", {
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

  const savePurchase = async () => {
    if (
      !form.supplierName ||
      !form.productName ||
      !form.quantity ||
      !form.invoiceNo ||
      !form.invoiceDate ||
      !form.purchasePrice ||
      !form.totalAmount
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
        supplier_name: form.supplierName,
        product_name: form.productName,
        quantity: Number(form.quantity),
        invoice_no: form.invoiceNo,
        invoice_date: form.invoiceDate,
        purchase_price: Number(form.purchasePrice),
        gst: Number(form.gst),
        discount: Number(form.discount),
        total_amount: Number(form.totalAmount),
      };

      if (editingId) {
        await axios.put(`${API}${editingId}`, data);
        toast.success("Purchase Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(API, data);
        toast.success("Purchase Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }

      clearForm();
      loadPurchases();
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

  const editPurchase = (item) => {
    setEditingId(item.id);
    setSelectedId(item.id);

    setForm({
      supplierName: item.supplier_name || "",
      productName: item.product_name || "",
      quantity: item.quantity || "",
      invoiceNo: item.invoice_no || "",
      invoiceDate: item.invoice_date || "",
      purchasePrice: item.purchase_price || "",
      gst: item.gst || 18,
      discount: item.discount || 0,
      totalAmount: item.total_amount || "",
    });

    toast.info("Editing purchase: " + item.invoice_no, {
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

  const deletePurchase = async (id) => {
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
                Delete Purchase?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this purchase? This action cannot be undone.
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
      loadPurchases();
      toast.success("Purchase Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      toast.error("Failed to delete purchase", {
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
    <Layout title="Purchases">
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
          <h1>Purchase Master</h1>

          <div style={shortcutBar}>
            <span>F1 Save Purchase</span>
            <span>F2 New</span>
            <span>F3 Update</span>
            <span>F4 Delete</span>
          </div>

          <div style={grid}>
            <input
              placeholder="Enter Supplier Name"
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              style={input}
            />

            <input
              placeholder="Enter Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              style={input}
            />

            <input
              type="number"
              placeholder="Enter Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              style={input}
            />

            <input
              placeholder="Enter Invoice Number"
              name="invoiceNo"
              value={form.invoiceNo}
              onChange={handleChange}
              style={input}
            />

            <input
              type="date"
              name="invoiceDate"
              value={form.invoiceDate}
              onChange={handleChange}
              style={input}
            />

            <input
              type="number"
              placeholder="Enter Purchase Price"
              name="purchasePrice"
              value={form.purchasePrice}
              onChange={handleChange}
              style={input}
            />

            <input
              type="number"
              placeholder="GST %"
              name="gst"
              value={form.gst}
              onChange={handleChange}
              style={input}
            />

            <input
              type="number"
              placeholder="Discount"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              style={input}
            />

            <input
              type="number"
              placeholder="Enter Total Amount"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              style={input}
            />
          </div>

          <button onClick={savePurchase} style={saveBtn} disabled={loading}>
            {loading ? "Processing..." : editingId ? "Update Purchase" : "Save Purchase"}
          </button>

          <button onClick={clearForm} style={newBtn}>
            New
          </button>

          <h2>Purchase List</h2>

          <input
            placeholder="Search Purchase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />

          {loading && <p style={{ color: "#3b82f6" }}>Loading...</p>}

          <table style={table}>
            <thead>
              <tr style={thRow}>
                <th style={{ borderRadius: "8px 0 0 8px" }}>ID</th>
                <th style={{ textAlign: "left", paddingLeft: "20px" }}>Supplier</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ borderRadius: "0 8px 8px 0" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {purchases
                .filter(
                  (p) =>
                    p.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
                    p.product_name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    style={{
                      ...trStyle,
                      background: selectedId === p.id ? "#dbeafe" : "white",
                    }}
                  >
                    <td>{p.id}</td>
                    <td style={{ textAlign: "left", paddingLeft: "20px" }}>{p.supplier_name}</td>
                    <td>{p.product_name}</td>
                    <td>{p.quantity}</td>
                    <td>{p.invoice_no}</td>
                    <td>{p.invoice_date}</td>
                    <td style={{ fontWeight: "500" }}>₹ {p.total_amount}</td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); editPurchase(p); }} style={editBtn}>
                        Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deletePurchase(p.id); }} style={deleteBtn}>
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
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 15,
  marginTop: 25,
};

const input = {
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
};

const searchBox = {
  ...input,
  marginTop: 20,
  width: 250,
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
  marginTop: 25,
  borderCollapse: "collapse",
  fontSize: "14px",
  color: "#334155",
};

const thRow = {
  background: "#0f172a",
  color: "#fff",
  textAlign: "center",
  height: "50px",
};

const trStyle = {
  textAlign: "center",
  borderBottom: "1px solid #f1f5f9",
  height: "60px",
  cursor: "pointer",
  transition: "background 0.2s ease",
};

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: 0,
  padding: "6px 16px",
  borderRadius: "6px",
  fontWeight: "500",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: 0,
  padding: "6px 16px",
  borderRadius: "6px",
  fontWeight: "500",
  marginLeft: 8,
  cursor: "pointer",
};