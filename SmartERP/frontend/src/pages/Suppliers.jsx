import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast, { Toaster } from "react-hot-toast";

const API = 'https://smarterp-1-6rfs.onrender.com/suppliers/';

export default function Suppliers() {
  const initialForm = {
    name: "",
    phone: "",
    email: "",
    address: ""
  };

  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSuppliers();

    const shortcut = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        saveSupplier();
      }

      if (e.key === "F2") {
        e.preventDefault();
        clearForm();
      }

      if (e.key === "F4") {
        e.preventDefault();
        if (selectedId) {
          deleteSupplier(selectedId);
        } else {
          toast.error("Please select a supplier first", {
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
        saveSupplier();
      }
    };

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [form, selectedId, editingId]);

  const loadSuppliers = async () => {
    try {
      const res = await axios.get(API);
      setSuppliers(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      toast.error("Failed to load suppliers", {
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

  const saveSupplier = async () => {
    if (!form.name || !form.phone) {
      toast.error("Supplier Name and Phone are required", {
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
      if (editingId) {
        await axios.put(
          `${API}${editingId}`,
          form
        );
        toast.success("Supplier Updated Successfully!", {
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
          form
        );
        toast.success("Supplier Added Successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff"
          }
        });
      }

      clearForm();
      loadSuppliers();
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

  const editSupplier = (supplier) => {
    setEditingId(supplier.id);
    setSelectedId(supplier.id);

    setForm({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || ""
    });

    toast.info("Editing supplier: " + supplier.name, {
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

  const deleteSupplier = async (id) => {
    // Custom confirm toast with actions
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Delete Supplier?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this supplier? This action cannot be undone.
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
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
      loadSuppliers();
      toast.success("Supplier Deleted Successfully!", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      toast.error("Failed to delete supplier", {
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
    <Layout title="Suppliers">
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
          <h1>Supplier Master</h1>

          <div style={shortcut}>
            <span>F1 Save Supplier</span>
            <span>F2 New</span>
            <span>F4 Delete</span>
            <span>Enter Save</span>
          </div>

          <div style={grid}>
            <input
              name="name"
              placeholder="Enter Supplier Name"
              value={form.name}
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
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              style={input}
            />

            <input
              name="address"
              placeholder="Enter Address"
              value={form.address}
              onChange={handleChange}
              style={input}
            />
          </div>

          <button onClick={saveSupplier} style={saveBtn} disabled={loading}>
            {loading ? "Processing..." : editingId ? "Update Supplier" : "Save Supplier"}
          </button>

          <button onClick={clearForm} style={newBtn}>
            New
          </button>

          <h2>Supplier List</h2>

          <input
            placeholder="Search Supplier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />

          {loading && <p style={{ color: "#3b82f6" }}>Loading...</p>}

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Address</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {suppliers
                .filter(s =>
                  s.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map(supplier => (
                  <tr
                    key={supplier.id}
                    onClick={() => setSelectedId(supplier.id)}
                    style={
                      selectedId === supplier.id
                        ? selectedRow
                        : row
                    }
                  >
                    <td style={td}>{supplier.id}</td>
                    <td style={td}>{supplier.name}</td>
                    <td style={td}>{supplier.phone}</td>
                    <td style={td}>{supplier.email}</td>
                    <td style={td}>{supplier.address}</td>

                    <td style={td}>
                      <button
                        onClick={() => editSupplier(supplier)}
                        style={editBtn}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteSupplier(supplier.id)}
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
        .animate-enter {
          animation: enter 0.2s ease-out;
        }
        .animate-leave {
          animation: leave 0.15s ease-in;
        }
      `}</style>
    </Layout>
  );
}

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
  border: "1px solid #ccc",
  borderRadius: 8,
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