import Sidebar from "./Sidebar";

export default function Layout({ title, children }) {
  const today = new Date().toLocaleDateString();

  return (
    <div
      style={{
        display: "flex",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: "240px",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <small style={{ color: "gray" }}>
              Welcome to SmartERP
            </small>
          </div>

          <div style={{ textAlign: "right" }}>
            <b>Admin</b>
            <br />
            <small>{today}</small>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: 30 }}>{children}</div>
      </div>
    </div>
  );
}