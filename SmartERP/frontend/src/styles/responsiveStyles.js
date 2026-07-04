// src/styles/responsiveStyles.js

export const responsiveStyles = {
  // Page container - better desktop experience
  page: {
    background: "#f8fafc",
    padding: "24px",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    boxSizing: "border-box",
    '@media (max-width: 768px)': {
      padding: "16px",
    },
    '@media (max-width: 480px)': {
      padding: "10px",
    },
  },

  // Card container - better desktop experience
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,.08)",
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      padding: "20px",
      borderRadius: "12px",
    },
    '@media (max-width: 480px)': {
      padding: "15px",
      borderRadius: "10px",
    },
  },

  // Grid - better desktop experience
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: "1fr",
      gap: "10px",
    },
  },

  // Shortcut bar - better desktop experience
  shortcutBar: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "15px 25px",
    borderRadius: "10px",
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "20px",
    '@media (max-width: 768px)': {
      padding: "12px 15px",
      gap: "12px",
      fontSize: "12px",
      justifyContent: "center",
    },
    '@media (max-width: 480px)': {
      padding: "10px 12px",
      gap: "8px",
      fontSize: "11px",
      flexDirection: "column",
      alignItems: "center",
    },
  },

  // Table wrapper - better desktop experience
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
    WebkitOverflowScrolling: "touch",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  // Input fields - better desktop experience
  input: {
    padding: "12px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    outline: "none",
    '@media (max-width: 768px)': {
      padding: "10px 12px",
      fontSize: "13px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 10px",
      fontSize: "12px",
    },
  },

  // Buttons - better desktop experience
  saveBtn: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    '@media (max-width: 768px)': {
      padding: "10px 20px",
      fontSize: "13px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 16px",
      fontSize: "12px",
      width: "100%",
    },
  },

  reloadBtn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    '@media (max-width: 768px)': {
      padding: "10px 20px",
      fontSize: "13px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 16px",
      fontSize: "12px",
      width: "100%",
    },
  },

  clearBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "12px 30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    '@media (max-width: 768px)': {
      padding: "10px 20px",
      fontSize: "13px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 16px",
      fontSize: "12px",
      width: "100%",
    },
  },

  editBtn: {
    background: "#f59e0b",
    color: "#ffffff",
    border: "none",
    padding: "6px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    '@media (max-width: 768px)': {
      padding: "5px 12px",
      fontSize: "12px",
    },
    '@media (max-width: 480px)': {
      padding: "4px 10px",
      fontSize: "11px",
    },
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "6px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    marginLeft: "6px",
    '@media (max-width: 768px)': {
      padding: "5px 12px",
      fontSize: "12px",
      marginLeft: "4px",
    },
    '@media (max-width: 480px)': {
      padding: "4px 10px",
      fontSize: "11px",
      marginLeft: "3px",
    },
  },

  buttonRow: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
    '@media (max-width: 480px)': {
      flexDirection: "column",
      gap: "10px",
    },
  },

  searchBox: {
    padding: "10px 16px",
    width: "100%",
    maxWidth: "350px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    '@media (max-width: 768px)': {
      maxWidth: "100%",
      padding: "8px 12px",
      fontSize: "13px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 10px",
      fontSize: "12px",
    },
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    minWidth: "600px",
    '@media (max-width: 768px)': {
      fontSize: "13px",
      minWidth: "500px",
    },
    '@media (max-width: 480px)': {
      fontSize: "12px",
      minWidth: "400px",
    },
  },

  th: {
    padding: "14px 18px",
    background: "#0f172a",
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    whiteSpace: "nowrap",
    '@media (max-width: 768px)': {
      padding: "10px 14px",
      fontSize: "12px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 10px",
      fontSize: "11px",
    },
  },

  td: {
    padding: "14px 18px",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
    '@media (max-width: 768px)': {
      padding: "10px 14px",
      fontSize: "12px",
    },
    '@media (max-width: 480px)': {
      padding: "8px 10px",
      fontSize: "11px",
    },
  },

  row: {
    textAlign: "center",
    transition: "background 0.2s",
    cursor: "pointer",
  },

  selectedRow: {
    background: "#dbeafe",
    textAlign: "center",
    transition: "background 0.2s",
    cursor: "pointer",
  },

  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#0f172a",
    '@media (max-width: 768px)': {
      fontSize: "20px",
    },
    '@media (max-width: 480px)': {
      fontSize: "18px",
    },
  },

  h2: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "30px",
    marginBottom: "15px",
    color: "#0f172a",
    '@media (max-width: 768px)': {
      fontSize: "16px",
    },
    '@media (max-width: 480px)': {
      fontSize: "14px",
    },
  },

  summary: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "25px",
    padding: "15px 20px",
    background: "#f8fafc",
    borderRadius: "10px",
    fontSize: "14px",
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      fontSize: "13px",
      gap: "12px",
      padding: "12px",
    },
    '@media (max-width: 480px)': {
      fontSize: "12px",
      gap: "8px",
      padding: "10px",
      flexDirection: "column",
      alignItems: "center",
    },
  },

  chartContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "30px",
    marginTop: "30px",
    width: "100%",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "1fr",
      gap: "20px",
    },
  },

  deleteOverlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    '@media (max-width: 480px)': {
      padding: "10px",
    },
  },

  deleteContainer: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    width: "440px",
    maxWidth: "95vw",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    animation: "fadeIn 0.25s ease-out",
    '@media (max-width: 480px)': {
      padding: "24px",
      width: "100%",
    },
  },

  deleteActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    '@media (max-width: 480px)': {
      flexDirection: "column",
      gap: "8px",
    },
  },

  kpiCard: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "25px 30px",
    borderRadius: "15px",
    '@media (max-width: 768px)': {
      padding: "16px 20px",
    },
    '@media (max-width: 480px)': {
      padding: "12px 16px",
    },
  },
};