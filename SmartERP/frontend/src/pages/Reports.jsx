import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { responsiveStyles } from "../styles/responsiveStyles";
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
import toast, { Toaster } from "react-hot-toast";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://smarterp-1-6rfs.onrender.com/reports/");
      setReport(res.data);
      toast.success("Reports loaded successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff"
        }
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load reports", {
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

  // Modern UI Card
  const Card = ({ title, value, color, icon }) => (
    <div
      style={{
        ...cardStyle,
        background: color,
      }}
    >
      <div style={cardHeader}>
        <span style={cardIcon}>{icon}</span>
        <h3 style={cardTitle}>{title}</h3>
      </div>
      <h1 style={cardValue}>{value}</h1>
    </div>
  );

  // Custom Bar Data
  const customBarData = [
    {
      name: "Cash Flow Stream",
      "Sales (Inflow)": report.total_sale,
      "Purchases (Outflow)": -Math.abs(report.total_purchase),
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

  const currencyFormatter = (value) => `₹ ${Number(Math.abs(value)).toLocaleString("en-IN")}`;

  return (
    <Layout title="Reports">
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
          }
        }}
      />

      <div style={responsiveStyles.page}>
        <h2 style={reportTitle}>Business Reports</h2>

        {loading && <p style={loadingText}>Loading report data...</p>}

        {/* Top Metrics Summary Cards */}
        <div style={cardsGrid}>
          <Card 
            title="Products" 
            value={report.total_products} 
            color="#2563eb" 
            icon="📦" 
          />
          <Card 
            title="Customers" 
            value={report.total_customers} 
            color="#16a34a" 
            icon="👥" 
          />
          <Card 
            title="Suppliers" 
            value={report.total_suppliers} 
            color="#9333ea" 
            icon="🏭" 
          />
          <Card 
            title="Purchase" 
            value={`₹ ${Number(report.total_purchase).toLocaleString("en-IN")}`} 
            color="#ea580c" 
            icon="📥" 
          />
          <Card 
            title="Sales" 
            value={`₹ ${Number(report.total_sale).toLocaleString("en-IN")}`} 
            color="#0891b2" 
            icon="📤" 
          />
          <Card 
            title="Available Stock" 
            value={report.total_stock} 
            color="#0284c7" 
            icon="📊" 
          />
          <Card
            title="Profit / Loss"
            value={`₹ ${Number(report.profit).toLocaleString("en-IN")}`}
            color={report.profit >= 0 ? "#059669" : "#dc2626"}
            icon={report.profit >= 0 ? "📈" : "📉"}
          />
        </div>

        {/* Charts Grid */}
        <div style={responsiveStyles.chartContainer}>
          {/* Chart 1: Bi-Directional Cash Flow Variance Bar */}
          <div style={chartCard}>
            <h3 style={chartTitle}>Cash Flow Balance Tracker</h3>
            <p style={chartSubtitle}>
              Upward bars mean incoming cash; downward bars represent spending.
            </p>
            <div style={chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customBarData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={currencyFormatter} stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `₹ ${Number(Math.abs(value)).toLocaleString("en-IN")}`} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <ReferenceLine y={0} stroke="#000" strokeWidth={1.5} />
                  <Bar dataKey="Sales (Inflow)" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} />
                  <Bar dataKey="Purchases (Outflow)" fill="#ef4444" radius={[0, 0, 6, 6]} barSize={50} />
                  <Bar dataKey="Net Profit" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Operations Donut Chart */}
          <div style={chartCard}>
            <h3 style={chartTitle}>Operations Distribution</h3>
            <p style={chartSubtitle}>
              Unified operational metrics breakdown.
            </p>
            <div style={chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
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
                  <Legend 
                    iconType="circle" 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {!loading && (
          <div style={responsiveStyles.summary}>
            <span>Total Products: <strong>{report.total_products}</strong></span>
            <span style={summaryDivider}>|</span>
            <span>Total Customers: <strong>{report.total_customers}</strong></span>
            <span style={summaryDivider}>|</span>
            <span>Total Suppliers: <strong>{report.total_suppliers}</strong></span>
            <span style={summaryDivider}>|</span>
            <span>
              Net Profit: <strong style={{ color: report.profit >= 0 ? "#16a34a" : "#dc2626" }}>
                ₹ {Number(report.profit).toLocaleString("en-IN")}
              </strong>
            </span>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .reports-cards {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          }
        }
        @media (max-width: 480px) {
          .reports-cards {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

// Styles
const reportTitle = {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "30px",
  color: "#0f172a",
  '@media (max-width: 768px)': {
    fontSize: "22px",
    marginBottom: "20px",
  },
  '@media (max-width: 480px)': {
    fontSize: "18px",
    marginBottom: "15px",
  },
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
  '@media (max-width: 768px)': {
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
};

const cardStyle = {
  color: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 10px 20px rgba(0,0,0,.05)",
  '@media (max-width: 768px)': {
    padding: "15px",
  },
  '@media (max-width: 480px)': {
    padding: "12px",
  },
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
};

const cardIcon = {
  fontSize: "20px",
  '@media (max-width: 480px)': {
    fontSize: "16px",
  },
};

const cardTitle = {
  margin: 0,
  opacity: 0.9,
  fontSize: "0.9rem",
  fontWeight: "500",
  '@media (max-width: 480px)': {
    fontSize: "0.8rem",
  },
};

const cardValue = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  '@media (max-width: 768px)': {
    fontSize: "20px",
  },
  '@media (max-width: 480px)': {
    fontSize: "16px",
  },
};

const chartCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  width: "100%",
  '@media (max-width: 768px)': {
    padding: "20px",
  },
  '@media (max-width: 480px)': {
    padding: "15px",
  },
};

const chartTitle = {
  margin: "0 0 5px 0",
  color: "#1e293b",
  fontSize: "16px",
  '@media (max-width: 768px)': {
    fontSize: "14px",
  },
  '@media (max-width: 480px)': {
    fontSize: "13px",
  },
};

const chartSubtitle = {
  color: "#64748b",
  fontSize: "0.9rem",
  margin: "0 0 20px 0",
  '@media (max-width: 768px)': {
    fontSize: "0.8rem",
  },
  '@media (max-width: 480px)': {
    fontSize: "0.7rem",
  },
};

const chartWrapper = {
  width: "100%",
  height: "300px",
  '@media (max-width: 768px)': {
    height: "250px",
  },
  '@media (max-width: 480px)': {
    height: "200px",
  },
};

const loadingText = {
  color: "#3b82f6",
  textAlign: "center",
  padding: "20px",
};

const summaryDivider = {
  color: "#cbd5e1",
};