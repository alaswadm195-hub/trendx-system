import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(res.user);
    } catch (err) {
      setError("❌ Email أو Password غلط");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Trend X 🚀</h1>
        <p style={subtitle}>Welcome back 👋</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && <p style={errorText}>{error}</p>}

        <button onClick={handleLogin} style={btn}>
          Login
        </button>
      </div>
    </div>
  );
}

/* 🎨 UI */

const page = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #2c3e50, #3498db)",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "15px",
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  marginBottom: "5px",
};

const subtitle = {
  textAlign: "center",
  color: "#777",
  marginBottom: "15px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const btn = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const errorText = {
  color: "red",
  fontSize: "13px",
  textAlign: "center",
};