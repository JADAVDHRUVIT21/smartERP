  import { useEffect, useState } from "react";
  import axios from "axios";
  import Layout from "../components/Layout";

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
          "http://127.0.0.1:8000/dashboard/finance",
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

    return (
      <Layout title="Dashboard">
        <div style={{ padding: 30 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 30,
            }}
          >
            Finance Overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 25,
            }}
          >
            <div
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: 25,
                borderRadius: 15,
              }}
            >
              <h3>Total Purchase</h3>
              <h1>₹ {Number(data.purchase).toLocaleString("en-IN")}</h1>
            </div>

            <div
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: 25,
                borderRadius: 15,
              }}
            >
              <h3>Total Sales</h3>
              <h1>₹ {Number(data.sales).toLocaleString("en-IN")}</h1>
            </div>

            <div
              style={{
                background: data.profit >= 0 ? "#059669" : "#dc2626",
                color: "#fff",
                padding: 25,
                borderRadius: 15,
              }}
            >
              <h3>Profit</h3>
              <h1>₹ {Number(data.profit).toLocaleString("en-IN")}</h1>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 20,
              marginTop: 40,
            }}
          >
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center" }}>
              <h3>Products</h3>
              <h1>{data.products}</h1>
            </div>

            <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center" }}>
              <h3>Customers</h3>
              <h1>{data.customers}</h1>
            </div>

            <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center" }}>
              <h3>Suppliers</h3>
              <h1>{data.suppliers}</h1>
            </div>

            <div style={{ background: "#fff", padding: 20, borderRadius: 12, textAlign: "center" }}>
              <h3>Stock Items</h3>
              <h1>{data.stock}</h1>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              background: "#fff",
              padding: 25,
              borderRadius: 15,
            }}
          >
            <h2>Business Summary</h2>

            <p><strong>Total Purchase:</strong> ₹ {Number(data.purchase).toLocaleString("en-IN")}</p>
            <p><strong>Total Sales:</strong> ₹ {Number(data.sales).toLocaleString("en-IN")}</p>
            <p><strong>Profit:</strong> ₹ {Number(data.profit).toLocaleString("en-IN")}</p>
            <p><strong>Products:</strong> {data.products}</p>
            <p><strong>Customers:</strong> {data.customers}</p>
            <p><strong>Suppliers:</strong> {data.suppliers}</p>
            <p><strong>Stock:</strong> {data.stock}</p>
          </div>
        </div>
      </Layout>
    );
  }
