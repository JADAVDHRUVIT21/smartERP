import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

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
          alert("Select Purchase First");
        }
      }

      if (e.key === "F4") {
        e.preventDefault();
        if (selectedId) {
          deletePurchase(selectedId);
        } else {
          alert("Select Purchase First");
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
      alert("Please fill all fields");
      return;
    }

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
        alert("Purchase Updated Successfully");
      } else {
        await axios.post(API, data);
        alert("Purchase Added Successfully");
      }

      clearForm();
      loadPurchases();
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.detail || "Server Error");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deletePurchase = async (id) => {
    if (!window.confirm("Delete this Purchase?")) return;

    try {
      await axios.delete(`${API}${id}`);
      loadPurchases();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout title="Purchases">
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

          <button onClick={savePurchase} style={saveBtn}>
            {editingId ? "Update Purchase" : "Save Purchase"}
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
};

const newBtn = {
  background: "#2563eb",
  color: "#fff",
  border: 0,
  padding: "12px 25px",
  borderRadius: 8,
  marginLeft: 10,
  cursor: "pointer",
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