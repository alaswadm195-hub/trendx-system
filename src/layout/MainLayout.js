import React from "react";
import "./layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Trend X</h2>
        <ul>
          <li>Dashboard</li>
          <li>Tasks</li>
          <li>Clients</li>
          <li>Payments</li>
        </ul>
      </aside>

      <div className="main">
        <div className="topbar">
          <span>Welcome, Admin</span>
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}