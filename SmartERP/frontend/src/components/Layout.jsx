import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    localStorage.removeItem("token");
    navigate("/login");
  };

  // All menu items - flat structure
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
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        transform: !isMobile ? 'none' : (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'),
        width: isMobile ? '280px' : '250px',
      }}>
        {/* Logo */}
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

        {/* Navigation */}
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

        {/* Logout */}
        <div style={styles.logoutContainer}>
          <button 
            onClick={() => {
              handleLogout();
              if (isMobile) {
                setSidebarOpen(false);
              }
            }} 
            style={styles.logoutBtn}
          >
            <span style={styles.menuText}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: !isMobile ? '250px' : '0',
        paddingTop: '70px',
      }}>
        {/* Navbar */}
        <header style={{
          ...styles.navbar,
          left: !isMobile ? '250px' : '0',
        }}>
          <div style={styles.navbarLeft}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={styles.hamburger}
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
            )}
            <h1 style={styles.pageTitle}>{title || 'Dashboard'}</h1>
          </div>
          <div style={styles.navbarRight}>
            <span style={styles.userInfo}>Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          {children}
        </div>
      </main>

      <style>{`
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
            font-size: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .page-title {
            font-size: 14px !important;
          }
          .sidebar {
            width: 260px !important;
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
      `}</style>
    </div>
  );
}

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
    padding: '16px 20px',
    borderTop: '1px solid #1e293b',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '15px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    margin: '0 10px',
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
    gap: '16px',
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
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userInfo: {
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '500',
  },
  content: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
};