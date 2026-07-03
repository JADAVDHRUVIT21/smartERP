import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  const [report, setReport] = useState({
    total_products: 0,
    total_customers: 0,
    total_suppliers: 0,
    total_purchase: 0,
    total_sale: 0,
    total_stock: 0,
    profit: 0,
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await axios.get("https://smarterp-1-6rfs.onrender.com/reports/");
      setReport(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Modern UI Card
  const Card = ({ title, value, color }) => (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 10px 20px rgba(0,0,0,.05)",
      }}
    >
      <h3 style={{ margin: 0, opacity: 0.9, fontSize: "1rem", fontWeight: "500" }}>{title}</h3>
      <h1 style={{ marginTop: 15, fontSize: 32, fontWeight: "700", marginBottom: 0 }}>{value}</h1>
    </div>
  );

  // --- UNIQUE DATA STRUCTURING ---
  // Storing Cash Flow as positive vs negative values to plot a dynamic visual comparison
  const customBarData = [
    {
      name: "Cash Flow Stream",
      "Sales (Inflow)": report.total_sale,
      "Purchases (Outflow)": -Math.abs(report.total_purchase), // Plotted downwards
      "Net Profit": report.profit,
    },
  ];

  const pieData = [
    { name: "Products", value: report.total_products },
    { name: "Available Stock", value: report.total_stock },
    { name: "Customers", value: report.total_customers },
    { name: "Suppliers", value: report.total_suppliers },
  ];

  const PIE_COLORS = ["#2563eb", "#0284c7", "#16a34a", "#9333ea"];

  // Formatter for Currency Ticks
  const currencyFormatter = (value) => `₹ ${Number(Math.abs(value)).toLocaleString("en-IN")}`;

  return (
    <Layout title="Reports">
      <div style={{ padding: "30px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        
        <h2 style={{ marginBottom: 30, fontWeight: "700", color: "#0f172a" }}>
          Business Reports
        </h2>

        {/* --- Top Metrics Summary Cards --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <Card title="Products" value={report.total_products} color="#2563eb" />
          <Card title="Customers" value={report.total_customers} color="#16a34a" />
          <Card title="Suppliers" value={report.total_suppliers} color="#9333ea" />
          <Card title="Purchase" value={`₹ ${Number(report.total_purchase).toLocaleString("en-IN")}`} color="#ea580c" />
          <Card title="Sales" value={`₹ ${Number(report.total_sale).toLocaleString("en-IN")}`} color="#0891b2" />
          <Card title="Available Stock" value={report.total_stock} color="#0284c7" />
          <Card
            title="Profit / Loss"
            value={`₹ ${Number(report.profit).toLocaleString("en-IN")}`}
            color={report.profit >= 0 ? "#059669" : "#dc2626"}
          />
        </div>

        {/* --- Charts Grid --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: 30,
          }}
        >
          
          {/* Unique Chart 1: Bi-Directional Cash Flow Variance Bar */}
          <div
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 16,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>Cash Flow Balance Tracker</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 20px 0" }}>
              Upward bars mean incoming cash; downward bars represent spending.
            </p>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={customBarData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis tickFormatter={currencyFormatter} stroke="#64748b" />
                  <Tooltip formatter={(value) => `₹ ${Number(Math.abs(value)).toLocaleString("en-IN")}`} />
                  <Legend verticalAlign="top" height={36}/>
                  
                  {/* Baseline indicator dividing money coming in vs going out */}
                  <ReferenceLine y={0} stroke="#000" strokeWidth={1.5} />
                  
                  <Bar dataKey="Sales (Inflow)" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} />
                  <Bar dataKey="Purchases (Outflow)" fill="#ef4444" radius={[0, 0, 6, 6]} barSize={50} />
                  <Bar dataKey="Net Profit" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Operations Donut Chart */}
          <div
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 16,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>Operations Distribution</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 20px 0" }}>
              Unified operational metrics breakdown.
            </p>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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