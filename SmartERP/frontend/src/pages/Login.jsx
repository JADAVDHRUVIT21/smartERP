import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://smarterp-1-6rfs.onrender.com/auth/login",
        {
          username,
          password,
        }
      );

      console.log("Login successful:", response.data);
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Success toast
      toast.success("Login successful! Redirecting to dashboard...", {
        duration: 3000,
        position: "top-right",
      });

      // Navigate after a small delay to show toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login failed:", error);
      
      // Error toast
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        "Invalid username or password. Please try again.",
        {
          duration: 4000,
          position: "top-right",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            style: {
              background: "#22c55e",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>📊</div>
          <h1 style={styles.title}>SmartERP</h1>
          <p style={styles.subtitle}>Welcome back! Please login to your account.</p>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              ...styles.button,
              ...(isLoading && styles.buttonDisabled),
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={styles.loadingSpinner}>
                <span style={styles.spinner}></span> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account? <span style={styles.link}>Contact Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.3s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  logo: {
    fontSize: "48px",
    marginBottom: "12px",
    display: "inline-block",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    marginTop: "8px",
    marginBottom: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#f7fafc",
    color: "#2d3748",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
    letterSpacing: "0.5px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 0.8s ease-in-out infinite",
  },
  footer: {
    textAlign: "center",
    marginTop: "8px",
  },
  footerText: {
    fontSize: "14px",
    color: "#718096",
    margin: "0",
  },
  link: {
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Login;