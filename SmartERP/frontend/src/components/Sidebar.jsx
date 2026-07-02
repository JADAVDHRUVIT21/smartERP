import { NavLink } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Products", path: "/products" },
  { name: "Customers", path: "/customers" },
  { name: "Suppliers", path: "/suppliers" },
  { name: "Purchases", path: "/purchases" },
  { name: "Sales", path: "/sales" },
  { name: "Stock", path: "/stock" },
  { name: "Invoice", path: "/invoice" },
  { name: "Ledger", path: "/ledger" },
  { name: "Reports", path: "/reports" },  
  { name: "Company", path: "/company" },
];

export default function Sidebar() {
  return (
    <div
      style={{
        width: 240,
        height: "100vh",
        background: "#0f172a",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          padding: 25,
          fontSize: 28,
          fontWeight: "bold",
          borderBottom: "1px solid #334155",
        }}
      >
        SmartERP
      </div>

      <div style={{ padding: 15 }}>
        {menus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "block",
              padding: "12px 18px",
              marginBottom: 8,
              borderRadius: 8,
              textDecoration: "none",
              color: "#fff",
              background: isActive ? "#2563eb" : "transparent",
              fontWeight: isActive ? "bold" : "normal",
              transition: "0.3s",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}