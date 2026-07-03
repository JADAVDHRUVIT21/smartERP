import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    // endpoint https://smarterp-1-6rfs.onrender.com/auth/login
    // using axios or fetch to make the API call and handle the response accordingly
    axios.post("https://smarterp-1-6rfs.onrender.com/auth/login", {
      username,
      password,
    })
      .then((response) => {
        console.log("Login successful:", response.data);
        const token = response.data.access_token;
        localStorage.setItem("token", token);

        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>SmartERP Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
