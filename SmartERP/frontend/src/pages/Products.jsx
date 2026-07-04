import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const API = "https://smarterp-1-6rfs.onrender.com/products/";

export default function Products() {
  const initialFormState = {
    product_name: "",
    product_code: "",
    barcode: "",
    category: "",
    brand: "",
    hsn_code: "",
    gst: "",
    unit: "PCS",
    purchase_price: "",
    selling_price: "",
    opening_stock: "",
    minimum_stock: "",
    stock_quantity: "",
    warehouse: "",
    description: "",
    status: true
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadProducts();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        saveProduct();
      }
      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }
      if (e.key === "F3") {
        e.preventDefault();
        if (editingId) {
          saveProduct();
        } else {
          toast.error("Please select a product first", {
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
          deleteProduct(selectedId);
        } else {
          toast.error("Please select a product first", {
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

  const loadProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products", {
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value
    }));
  };

  const clearForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setSelectedId(null);
  };

  const saveProduct = async () => {
    try {
      if (!form.product_name || !form.product_code) {
        toast.error("Product Name and Code are required", {
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

      if (editingId) {
        await axios.put(`${API}${editingId}`, form);
        toast.success("Product Updated Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      } else {
        await axios.post(API, form);
        toast.success("Product Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }

      clearForm();
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Server Error", {
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

  const editProduct = (item) => {
    setEditingId(item.id);
    setSelectedId(item.id);

    setForm({
      product_name: item.name || "",
      product_code: item.product_code || "",
      barcode: item.barcode || "",
      category: item.category || "",
      brand: item.brand || "",
      hsn_code: item.hsn_code || "",
      gst: item.gst ?? "",
      unit: item.unit || "PCS",
      purchase_price: item.purchase_price ?? "",
      selling_price: item.selling_price ?? "",
      opening_stock: item.opening_stock ?? "",
      minimum_stock: item.minimum_stock ?? "",
      stock_quantity: item.stock_quantity ?? "",
      warehouse: item.warehouse || "",
      description: item.description || "",
      status: item.status
    });

    toast.info("Editing product: " + item.name, {
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

  const deleteProduct = async (id) => {
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
            <h3 style={deleteTitle}>Delete Product</h3>
            <p style={deleteMessage}>
              Are you sure you want to delete this product? This action cannot be undone.
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
      await loadProducts();
      toast.success("Product Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      toast.error("Failed to delete product", {
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
    <Layout title="Product Master">
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
          <h1>Product Master</h1>

          <div style={shortcutBar}>
            <span>F1 Save Product</span>
            <span>F2 New Product</span>
            <span>F3 Update Product</span>
            <span>F4 Delete Product</span>
          </div>

          <div style={grid}>
            {[
              ["product_name", "Enter Product Name"],
              ["product_code", "Enter Product Code"],
              ["barcode", "Enter Barcode"],
              ["category", "Enter Category"],
              ["brand", "Enter Brand"],
              ["hsn_code", "Enter HSN Code"],
              ["warehouse", "Enter Warehouse"],
              ["description", "Enter Description"]
            ].map(([name, placeholder]) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                style={inputStyle}
              />
            ))}

            <input
              type="number"
              name="gst"
              placeholder="Enter GST Percentage"
              value={form.gst}
              onChange={handleChange}
              style={inputStyle}
            />

            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="LTR">LTR</option>
              <option value="BOX">BOX</option>
            </select>

            {[
              ["purchase_price", "Enter Purchase Price"],
              ["selling_price", "Enter Selling Price"],
              ["opening_stock", "Enter Opening Stock"],
              ["minimum_stock", "Enter Minimum Stock"],
              ["stock_quantity", "Enter Stock Quantity"]
            ].map(([name, placeholder]) => (
              <input
                key={name}
                type="number"
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                style={inputStyle}
              />
            ))}
          </div>

          <button onClick={saveProduct} style={saveBtn} disabled={loading}>
            {loading ? "Processing..." : editingId ? "Update Product" : "Save Product"}
          </button>

          <button onClick={clearForm} style={newBtn}>
            New
          </button>

          <h2 style={{ marginTop: 40 }}>Product List</h2>

          <input
            placeholder="Search Product"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={searchInput}
          />

          {loading && <p style={{ color: "#3b82f6" }}>Loading...</p>}

          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...thStyle, borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Stock</th>
                <th style={{ ...thStyle, borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {products
                .filter((item) =>
                  item.name?.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      ...trStyle,
                      background: selectedId === item.id ? "#e0f2fe" : "transparent"
                    }}
                  >
                    <td style={tdStyle}>{item.id}</td>
                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>{item.product_code || "—"}</td>
                    <td style={tdStyle}>{item.stock_quantity ?? 0}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editProduct(item);
                        }}
                        style={editBtn}
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(item.id);
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

// Layout & UI Component Styles
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

const searchInput = {
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

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: 0,
  padding: "6px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "500"
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: 0,
  padding: "6px 14px",
  borderRadius: 6,
  marginLeft: 8,
  cursor: "pointer",
  fontWeight: "500"
};

const table = {
  width: "100%",
  marginTop: 20,
  borderCollapse: "collapse",
  textAlign: "left"
};

const thStyle = {
  background: "#0f172a",
  color: "#fff",
  padding: "14px 16px",
  fontWeight: "600",
  fontSize: "14px"
};

const trStyle = {
  borderBottom: "1px solid #f1f5f9",
  cursor: "pointer",
  transition: "background 0.15s ease-in-out"
};

const tdStyle = {
  padding: "14px 16px",
  color: "#334155",
  fontSize: "14px",
  verticalAlign: "middle"
};