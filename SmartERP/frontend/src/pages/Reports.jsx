import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

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

  const Card = ({ title, value, color }) => (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 5px 15px rgba(0,0,0,.15)",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>

      <h1
        style={{
          marginTop: 20,
          fontSize: 34,
        }}
      >
        {value}
      </h1>
    </div>
  );

  return (
    <Layout title="Reports">
      <h2
        style={{
          marginBottom: 25,
        }}
      >
        Business Reports
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 20,
        }}
      >
        <Card
          title="Products"
          value={report.total_products}
          color="#2563eb"
        />

        <Card
          title="Customers"
          value={report.total_customers}
          color="#16a34a"
        />

        <Card
          title="Suppliers"
          value={report.total_suppliers}
          color="#9333ea"
        />

        <Card
          title="Purchase"
          value={`₹ ${Number(report.total_purchase).toLocaleString()}`}
          color="#ea580c"
        />

        <Card
          title="Sales"
          value={`₹ ${Number(report.total_sale).toLocaleString()}`}
          color="#0891b2"
        />

        <Card
          title="Available Stock"
          value={report.total_stock}
          color="#0284c7"
        />

        <Card
          title="Profit"
          value={`₹ ${Number(report.profit).toLocaleString()}`}
          color={report.profit >= 0 ? "#059669" : "#dc2626"}
        />
      </div>

      <div
        style={{
          marginTop: 30,
          background: "#fff",
          padding: 25,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <h3>Summary</h3>

        <p>
          <strong>Total Products:</strong> {report.total_products}
        </p>

        <p>
          <strong>Total Customers:</strong> {report.total_customers}
        </p>

        <p>
          <strong>Total Suppliers:</strong> {report.total_suppliers}
        </p>

        <p>
          <strong>Total Purchase:</strong> ₹{" "}
          {Number(report.total_purchase).toLocaleString()}
        </p>

        <p>
          <strong>Total Sales:</strong> ₹{" "}
          {Number(report.total_sale).toLocaleString()}
        </p>

        <p>
          <strong>Available Stock:</strong> {report.total_stock}
        </p>

        <p>
          <strong>Profit:</strong>{" "}
          <span
            style={{
              color: report.profit >= 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            ₹ {Number(report.profit).toLocaleString()}
          </span>
        </p>
      </div>
    </Layout>
  );
}