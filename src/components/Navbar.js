import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ page, setPage, isAdmin, setUser }) {

  const isMobile = window.innerWidth < 768;

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{
      ...nav,
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
    }}>
      
      <h2 style={{ color: "white", marginBottom: isMobile ? "10px" : "0" }}>
        Trend X
      </h2>

      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: isMobile ? "100%" : "auto"
      }}>

        {/* 👑 Admin */}
        {isAdmin && (
          <>
            <button
              style={btn(page === "dashboard", isMobile)}
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </button>

            <button
              style={btn(page === "clients", isMobile)}
              onClick={() => setPage("clients")}
            >
              Clients
            </button>
          </>
        )}

        {/* 👤 + 👑 */}
        <button
          style={btn(page === "tasks", isMobile)}
          onClick={() => setPage("tasks")}
        >
          Tasks
        </button>

        <button
          style={btn(page === "reports", isMobile)}
          onClick={() => setPage("reports")}
        >
          Reports
        </button>

        <button
          style={btn(page === "schedule", isMobile)}
          onClick={() => setPage("schedule")}
        >
          Schedule
        </button>

        {/* 🔥 Logout */}
        <button style={logoutBtn(isMobile)} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

/* 🎨 Styles */

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  background: "#2c3e50",
};

const btn = (active, isMobile) => ({
  width: isMobile ? "100%" : "auto",
  margin: isMobile ? "5px 0" : "0 0 0 10px",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: active ? "#3498db" : "#ecf0f1",
  color: active ? "white" : "#2c3e50",
  fontWeight: "bold",
});

const logoutBtn = (isMobile) => ({
  width: isMobile ? "100%" : "auto",
  margin: isMobile ? "10px 0 0 0" : "0 0 0 15px",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "#e74c3c",
  color: "white",
  fontWeight: "bold",
});