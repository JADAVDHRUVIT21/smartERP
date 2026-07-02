import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Invoice() {
  const API = "http://127.0.0.1:8000/invoices/";

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
          alert("Select Invoice First");
        }
      }
      if (e.key === "F4") {
        e.preventDefault();
        if (current.selectedId) {
          deleteInvoice(current.selectedId);
        } else {
          alert("Select Invoice First");
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
    } catch (err) {
      console.error(err);
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
      alert("Please fill all fields");
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

    try {
      if (currentEditingId) {
        await axios.put(`${API}${currentEditingId}`, data);
        alert("Invoice Updated");
      } else {
        await axios.post(API, data);
        alert("Invoice Saved");
      }
      clearForm();
      loadInvoices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Server Error");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await axios.delete(`${API}${id}`);
      loadInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Invoice Management">
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
            <button onClick={saveInvoice} style={saveBtn}>
              {editingId ? "Update Invoice" : "Save Invoice"}
            </button>
            <button onClick={clearForm} style={newBtn}>
              New
            </button>
          </div>

          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr style={thRow}>
                  <th style={th}>ID</th>
                  <th style={th}>Invoice</th>
                  <th style={th}>Date</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Product</th>
                  <th style={th}>Qty</th>
                  <th style={th}>Price</th>
                  <th style={th}>Total</th>
                  <th style={th}>Action</th>
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
                        <td style={td}>{item.customer_name}</td>
                        <td style={td}>{item.product_name}</td>
                        <td style={td}>{item.quantity}</td>
                        <td style={td}>₹ {item.price}</td>
                        <td style={td}>₹ {item.total_amount}</td>
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
        </div>
      </div>
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
  background: "#0f172a", // Dark matching bar color
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
  background: "#0f172a" // Matches the dark bar header layout from the image
};

const th = {
  padding: "12px 15px",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "14px"
};

const tr = {
  borderBottom: "1px solid #e2e8f0",
  cursor: "pointer",
  background: "#ffffff"
};

// Applied dynamically on click matching the reference image's color
const rowSelected = {
  background: "#dbeafe" 
};

const td = {
  padding: "12px 15px",
  fontSize: "14px",
  color: "#334155"
};