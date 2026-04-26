import React, { useState } from "react";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Reports from "./pages/Reports";
import Schedule from "./pages/Schedule"; 

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const isAdmin = user?.email === "admin@gmail.com";

  // 🔐 لو مش مسجل
  if (!user) return <Login setUser={setUser} />;

  return (
    <div>
      {/* ✅ Navbar */}
<Navbar page={page} setPage={setPage} isAdmin={isAdmin} setUser={setUser} />
      {/* 👤 User */}
      {!isAdmin && (
        <>
          {page === "tasks" && (
            <Tasks user={user} setUser={setUser} />
          )}

          {page === "reports" && <Reports />}

          {page === "schedule" && (
            <Schedule user={user} />
          )}
        </>
      )}

      {/* 👑 Admin */}
      {isAdmin && (
        <>
          {page === "dashboard" && <Dashboard />}

          {page === "tasks" && (
            <Tasks user={user} setUser={setUser} />
          )}

          {page === "clients" && <Clients />}

          {page === "reports" && <Reports />}

          {page === "schedule" && (
            <Schedule user={user} />
          )}
        </>
      )}
    </div>
  );
}

export default App;