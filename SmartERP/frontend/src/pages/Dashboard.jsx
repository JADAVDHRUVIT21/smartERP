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
    }
  };

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

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  const renderCurrencyTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipContainer}>
          <p style={tooltipTitle}>{payload[0].name}</p>
          <p style={tooltipValue}>
            ₹ {Number(payload[0].value).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout title="Dashboard">
      <div style={responsiveStyles.page}>
        <h2 style={dashboardTitle}>Finance Overview</h2>

        {/* KPI Cards */}
        <div style={kpiGrid}>
          <div style={{ ...responsiveStyles.kpiCard, background: "#2563eb" }}>
            <h3 style={kpiLabel}>Total Purchase</h3>
            <h1 style={kpiValue}>₹ {Number(data.purchase).toLocaleString("en-IN")}</h1>
          </div>

          <div style={{ ...responsiveStyles.kpiCard, background: "#16a34a" }}>
            <h3 style={kpiLabel}>Total Sales</h3>
            <h1 style={kpiValue}>₹ {Number(data.sales).toLocaleString("en-IN")}</h1>
          </div>

          <div style={{ 
            ...responsiveStyles.kpiCard, 
            background: data.profit >= 0 ? "#059669" : "#dc2626" 
          }}>
            <h3 style={kpiLabel}>Profit</h3>
            <h1 style={kpiValue}>₹ {Number(data.profit).toLocaleString("en-IN")}</h1>
          </div>
        </div>

        {/* Count Cards */}
        <div style={countGrid}>
          <div style={countCard}>
            <h3 style={countLabel}>Products</h3>
            <h1 style={countValue}>{data.products}</h1>
          </div>

          <div style={countCard}>
            <h3 style={countLabel}>Customers</h3>
            <h1 style={countValue}>{data.customers}</h1>
          </div>

          <div style={countCard}>
            <h3 style={countLabel}>Suppliers</h3>
            <h1 style={countValue}>{data.suppliers}</h1>
          </div>

          <div style={countCard}>
            <h3 style={countLabel}>Stock Items</h3>
            <h1 style={countValue}>{data.stock}</h1>
          </div>
        </div>

        {/* Charts */}
        <div style={responsiveStyles.chartContainer}>
          <div style={chartCard}>
            <h3 style={chartTitle}>Financial Health (Money Value)</h3>
            <div style={chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(val) => `₹${val}`} stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip content={renderCurrencyTooltip} />
                  <Bar dataKey="Amount" radius={[8, 8, 0, 0]}>
                    {financialData.map((entry, index) => {
                      const colors = ["#2563eb", "#16a34a", data.profit >= 0 ? "#059669" : "#dc2626"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={chartCard}>
            <h3 style={chartTitle}>Business Operations Mix</h3>
            <div style={chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
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
      </div>
    </Layout>
  );
}

// Styles
const dashboardTitle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "30px",
  color: "#1e293b",
  '@media (max-width: 768px)': {
    fontSize: "22px",
  },
  '@media (max-width: 480px)': {
    fontSize: "18px",
  },
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
  marginBottom: "30px",
  '@media (max-width: 768px)': {
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: "1fr",
    gap: "12px",
  },
};

const kpiLabel = {
  margin: "0",
  opacity: "0.9",
  fontSize: "1rem",
  fontWeight: "500",
  '@media (max-width: 480px)': {
    fontSize: "0.9rem",
  },
};

const kpiValue = {
  margin: "10px 0 0 0",
  fontSize: "28px",
  '@media (max-width: 768px)': {
    fontSize: "22px",
  },
  '@media (max-width: 480px)': {
    fontSize: "18px",
  },
};

const countGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px",
  marginBottom: "30px",
  '@media (max-width: 768px)': {
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  '@media (max-width: 480px)': {
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
};

const countCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  '@media (max-width: 768px)': {
    padding: "15px",
  },
  '@media (max-width: 480px)': {
    padding: "12px",
  },
};

const countLabel = {
  color: "#64748b",
  margin: "0",
  fontSize: "14px",
  '@media (max-width: 480px)': {
    fontSize: "12px",
  },
};

const countValue = {
  color: "#1e293b",
  margin: "10px 0 0 0",
  fontSize: "24px",
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
  borderRadius: "15px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  width: "100%",
  '@media (max-width: 768px)': {
    padding: "20px",
  },
  '@media (max-width: 480px)': {
    padding: "15px",
  },
};

const chartTitle = {
  marginBottom: "20px",
  color: "#1e293b",
  fontSize: "16px",
  '@media (max-width: 768px)': {
    fontSize: "14px",
  },
  '@media (max-width: 480px)': {
    fontSize: "13px",
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

const tooltipContainer = {
  backgroundColor: "#fff",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const tooltipTitle = {
  margin: 0,
  fontWeight: "bold",
  fontSize: "13px",
};

const tooltipValue = {
  margin: 0,
  color: "#2563eb",
  fontSize: "13px",
};