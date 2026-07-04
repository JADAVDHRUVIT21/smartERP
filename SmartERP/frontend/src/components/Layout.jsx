import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Update date and time every second (12-hour format)
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = String(hours).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      setCurrentDateTime(`${day}/${month}/${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    toast.custom((t) => (
      <div style={confirmOverlay}>
        <div style={confirmContainer}>
          <div style={confirmIconWrapper}>
            <div style={confirmIconCircle}>
              <svg style={confirmIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <div style={confirmContent}>
            <h3 style={confirmTitle}>Logout Confirmation</h3>
            <p style={confirmMessage}>
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
          </div>
          <div style={confirmActions}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout();
              }}
              style={confirmYesButton}
            >
              Yes, Logout
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={confirmNoButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
    });
  };

  const performLogout = () => {
    localStorage.clear();
    
    toast.success("Logout Successful! Redirecting to login page...", {
      position: "top-right",
      duration: 2000,
      style: {
        background: "#22c55e",
        color: "#fff",
        padding: "16px",
        borderRadius: "8px",
      },
    });

    if (isMobile) {
      setSidebarOpen(false);
    }

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const menuItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Products", path: "/products" },
    { title: "Customers", path: "/customers" },
    { title: "Suppliers", path: "/suppliers" },
    { title: "Purchases", path: "/purchases" },
    { title: "Sales", path: "/sales" },
    { title: "Stock", path: "/stock" },
    { title: "Invoice", path: "/invoice" },
    { title: "Ledger", path: "/ledger" },
    { title: "Reports", path: "/reports" },
    { title: "Company", path: "/company" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.container}>
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
          },
          info: {
            duration: 2000,
            style: {
              background: "#3b82f6",
              color: "#fff"
            }
          }
        }}
      />

      {sidebarOpen && isMobile && (
        <div 
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside style={{
        ...styles.sidebar,
        transform: !isMobile ? 'none' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
        width: isMobile ? '280px' : '250px',
      }}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <span style={styles.logoText}>SmartERP</span>
          </div>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              style={styles.closeBtn}
            >
              ✕
            </button>
          )}
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item, index) => {
            const isItemActive = isActive(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                style={{
                  ...styles.menuLink,
                  ...(isItemActive ? styles.menuLinkActive : {})
                }}
                onClick={() => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <span style={styles.menuText}>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.logoutContainer}>
          <button 
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.target.style.background = "#dc2626";
              e.target.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#94a3b8";
            }}
          >
            <span style={styles.menuText}>Logout</span>
          </button>
        </div>
      </aside>

      <main style={{
        ...styles.main,
        marginLeft: !isMobile ? '250px' : '0',
        paddingTop: '70px',
      }}>
        <header style={{
          ...styles.navbar,
          left: !isMobile ? '250px' : '0',
        }}>
          <div style={styles.navbarLeft}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={styles.hamburger}
              >
                ☰
              </button>
            )}
            <h1 style={styles.pageTitle}>{title || 'Dashboard'}</h1>
          </div>
          <div style={styles.navbarRight}>
            <div style={styles.userContainer}>
              <span style={styles.adminText}>Admin</span>
              <span style={styles.dateTimeText}>{currentDateTime}</span>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {children}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        @media (max-width: 1024px) {
          .sidebar {
            width: 280px !important;
          }
        }
        @media (max-width: 768px) {
          .sidebar-open {
            overflow: hidden;
          }
          .page-title {
            font-size: 14px !important;
          }
          .datetime-text {
            font-size: 10px !important;
          }
          .admin-text {
            font-size: 11px !important;
          }
          .navbar {
            padding: 10px 15px !important;
            height: 56px !important;
          }
          .content {
            padding: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .page-title {
            font-size: 13px !important;
          }
          .sidebar {
            width: 260px !important;
          }
          .datetime-text {
            display: none !important;
          }
          .admin-text {
            font-size: 12px !important;
          }
          .hamburger {
            font-size: 20px !important;
            padding: 4px !important;
          }
          .navbar {
            padding: 8px 12px !important;
            height: 50px !important;
          }
          .content {
            padding: 8px !important;
          }
          .user-container {
            gap: 0px !important;
          }
        }
        @media print {
          .sidebar, .navbar {
            display: none !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: 0 !important;
          }
        }
        .user-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .admin-text {
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
        }
        .datetime-text {
          color: #64748b;
          font-size: 11px;
          font-weight: 400;
        }
        .logout-btn:hover {
          background-color: #dc2626;
          color: #ffffff;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

// Confirmation Toast Styles
const confirmOverlay = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "20px",
};

const confirmContainer = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  width: "420px",
  maxWidth: "95vw",
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  animation: "fadeIn 0.25s ease-out",
};

const confirmIconWrapper = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const confirmIconCircle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#fef2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: "pulse 1s ease-in-out infinite",
};

const confirmIconSvg = {
  width: "36px",
  height: "36px",
  color: "#ef4444",
};

const confirmContent = {
  marginBottom: "28px",
};

const confirmTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 8px 0",
};

const confirmMessage = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  lineHeight: "1.6",
};

const confirmActions = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};

const confirmYesButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 36px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background 0.2s",
  minWidth: "120px",
};

const confirmNoButton = {
  background: "transparent",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "10px 36px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  minWidth: "120px",
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    animation: 'fadeIn 0.3s ease',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
  },
  logoContainer: {
    padding: '20px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '5px',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: '10px 0',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'all 0.2s',
    borderRadius: '8px',
    margin: '2px 10px',
    cursor: 'pointer',
  },
  menuLinkActive: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
  },
  menuText: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  logoutContainer: {
    padding: '8px 20px 16px 20px',
    borderTop: '1px solid #1e293b',
    flexShrink: 0,
    marginTop: 'auto',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '15px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    margin: '2px 10px',
  },
  main: {
    flex: 1,
    minHeight: '100vh',
    transition: 'margin-left 0.3s ease',
    width: '100%',
  },
  navbar: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#ffffff',
    padding: '12px 30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
    transition: 'left 0.3s ease',
  },
  navbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  adminText: {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
  },
  dateTimeText: {
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '400',
  },
  content: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
};