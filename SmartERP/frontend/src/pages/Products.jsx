import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

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
          alert("Select product first");
        }
      }
      if (e.key === "F4") {
        e.preventDefault();
        if (selectedId) {
          deleteProduct(selectedId);
        } else {
          alert("Select product first");
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
        alert("Product Name and Code required");
        return;
      }
      setLoading(true);

      if (editingId) {
        await axios.put(`${API}${editingId}`, form);
        alert("Product Updated Successfully");
      } else {
        await axios.post(API, form);
        alert("Product Added Successfully");
      }

      clearForm();
      await loadProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Server Error");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API}${id}`);
      await loadProducts();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Product Master">
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

          <button onClick={saveProduct} style={saveBtn}>
            {editingId ? "Update Product" : "Save Product"}
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

          {loading && <p>Loading...</p>}

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
    </Layout>
  );
}

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