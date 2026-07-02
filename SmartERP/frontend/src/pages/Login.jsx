  import { useNavigate } from "react-router-dom";

  function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
      navigate("/dashboard");
    };

    return (
      <div style={{ padding: "50px" }}>
        <h1>SmartERP Login</h1>

        <input
          type="text"
          placeholder="Username"
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
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
