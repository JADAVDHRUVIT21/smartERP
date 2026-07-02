import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Ledger() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/ledger/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLedger(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout title="Ledger">
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,.1)",
        }}
      >
        <h2>Ledger Transactions</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20,
          }}
        >
          <thead
            style={{
              background: "#1e293b",
              color: "#fff",
            }}
          >
            <tr>
              <th style={{ padding: 12 }}>Date</th>
              <th>Type</th>
              <th>Party</th>
              <th>Invoice</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((item, index) => (
              <tr
                key={index}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: 10 }}>{item.date}</td>

                <td>
                  <span
                    style={{
                      background:
                        item.type === "Purchase"
                          ? "#dc2626"
                          : "#16a34a",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {item.type}
                  </span>
                </td>

                <td>{item.party}</td>

                <td>{item.invoice}</td>

                <td style={{ color: "red", fontWeight: "bold" }}>
                  ₹ {item.debit}
                </td>

                <td style={{ color: "green", fontWeight: "bold" }}>
                  ₹ {item.credit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}