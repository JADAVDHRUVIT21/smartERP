import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
// 1. Import chart components from Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    purchase: 0,
    sales: 0,
    profit: 0,
    customers: 0,
    suppliers: 0,
    products: 0,
    stock: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://smarterp-1-6rfs.onrender.com/dashboard/finance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard Response:", res.data);

      setData({
        purchase: res.data.purchase || 0,
        sales: res.data.sales || 0,
        profit: res.data.profit || 0,
        customers: res.data.customers || 0,
        suppliers: res.data.suppliers || 0,
        products: res.data.products || 0,
        stock: res.data.stock || 0,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }
    }
  };

  // 2. Prepare data structures for the charts
  const financialData = [
    { name: "Total Purchase", Amount: data.purchase },
    { name: "Total Sales", Amount: data.sales },
    { name: "Net Profit", Amount: data.profit },
  ];

  const operationalData = [
    { name: "Products", value: data.products },
    { name: "Customers", value: data.customers },
    { name: "Suppliers", value: data.suppliers },
    { name: "Stock Items", value: data.stock },
  ];

  // Colors for the Pie Chart sections
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  // Custom tooltips to show clean currency formatting in the bar chart
  const renderCurrencyTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: "#2563eb" }}>
            ₹ {Number(payload[0].value).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Dashboard">
      <div style={{ padding: 30, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <h2 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#1e293b" }}>
          Finance Overview
        </h2>

        {/* --- KPI Cards Section --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 25,
          }}
        >
          <div style={{ background: "#2563eb", color: "#fff", padding: 25, borderRadius: 15 }}>
            <h3 style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>Total Purchase</h3>
            <h1 style={{ margin: "10px 0 0 0" }}>₹ {Number(data.purchase).toLocaleString("en-IN")}</h1>
          </div>

          <div style={{ background: "#16a34a", color: "#fff", padding: 25, borderRadius: 15 }}>
            <h3 style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>Total Sales</h3>
            <h1 style={{ margin: "10px 0 0 0" }}>₹ {Number(data.sales).toLocaleString("en-IN")}</h1>
          </div>

          <div style={{ background: data.profit >= 0 ? "#059669" : "#dc2626", color: "#fff", padding: 25, borderRadius: 15 }}>
            <h3 style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>Profit</h3>
            <h1 style={{ margin: "10px 0 0 0" }}>₹ {Number(data.profit).toLocaleString("en-IN")}</h1>
          </div>
        </div>

        {/* --- Count Cards Section --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
            marginTop: 40,
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#64748b", margin: 0 }}>Products</h3>
            <h1 style={{ color: "#1e293b", margin: "10px 0 0 0" }}>{data.products}</h1>
          </div>

          <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#64748b", margin: 0 }}>Customers</h3>
            <h1 style={{ color: "#1e293b", margin: "10px 0 0 0" }}>{data.customers}</h1>
          </div>

          <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#64748b", margin: 0 }}>Suppliers</h3>
            <h1 style={{ color: "#1e293b", margin: "10px 0 0 0" }}>{data.suppliers}</h1>
          </div>

          <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#64748b", margin: 0 }}>Stock Items</h3>
            <h1 style={{ color: "#1e293b", margin: "10px 0 0 0" }}>{data.stock}</h1>
          </div>
        </div>

        {/* --- Visual Graphs Section --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: 30,
            marginTop: 40,
          }}
        >
          {/* Chart 1: Financial Bar Chart */}
          <div style={{ background: "#fff", padding: 25, borderRadius: 15, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: 20, color: "#1e293b" }}>Financial Health (Money Value)</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={financialData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis tickFormatter={(val) => `₹${val}`} stroke="#64748b" />
                  <Tooltip content={renderCurrencyTooltip} />
                  <Bar dataKey="Amount" radius={[8, 8, 0, 0]}>
                    {financialData.map((entry, index) => {
                      // Color code bars individually to match the UI cards
                      const colors = ["#2563eb", "#16a34a", data.profit >= 0 ? "#059669" : "#dc2626"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Operations Breakdown Pie Chart */}
          <div style={{ background: "#fff", padding: 25, borderRadius: 15, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: 20, color: "#1e293b" }}>Business Operations Mix</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={operationalData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {operationalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}