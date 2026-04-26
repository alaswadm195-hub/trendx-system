import React, { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

export default function Dashboard() {

  const isMobile = window.innerWidth < 768;

  const [date, setDate] = useState("");

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [employees, setEmployees] = useState({});
  const [clientsCount, setClientsCount] = useState(0);

  const [monthData, setMonthData] = useState([]);
  const [showMonth, setShowMonth] = useState(false);
  const [monthTotals, setMonthTotals] = useState({
    income: 0,
    expense: 0
  });

  const loadReport = async (d) => {
    const ref = doc(db, "reports", d);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      const totalIncome = (data.services || []).reduce(
        (a, b) => a + b.amount,
        0
      );

      const totalExpense = (data.expenses || []).reduce(
        (a, b) => a + b.amount,
        0
      );

      setIncome(totalIncome);
      setExpense(totalExpense);
    } else {
      setIncome(0);
      setExpense(0);
    }
  };

  const loadTasksByDate = async (d) => {
    const snap = await getDocs(
      collection(db, "tasks_by_date", d, "tasks")
    );

    let emp = {};

    snap.forEach((doc) => {
      const t = doc.data();
      if (t.deleted) return;

      const name = t.assigned || "unknown";

      if (!emp[name]) {
        emp[name] = {
          pending: 0,
          in_progress: 0,
          done: 0,
          total: 0,
        };
      }

      emp[name].total++;

      if (t.status === "pending") emp[name].pending++;
      if (t.status === "in_progress") emp[name].in_progress++;
      if (t.status === "done") emp[name].done++;
    });

    setEmployees(emp);
  };

  const loadClients = async () => {
    const snap = await getDocs(collection(db, "clients"));
    setClientsCount(snap.size);
  };

  const handleDate = async (e) => {
    const d = e.target.value;
    setDate(d);

    await loadReport(d);
    await loadTasksByDate(d);
    await loadClients();
  };

  const loadMonth = async () => {
    if (!date) return;

    const selectedMonth = date.slice(0, 7);

    const snap = await getDocs(collection(db, "reports"));

    let all = [];
    let totalIncome = 0;
    let totalExpense = 0;

    snap.forEach((doc) => {
      if (doc.id.startsWith(selectedMonth)) {
        const data = doc.data();

        (data.services || []).forEach((s) => {
          all.push({
            type: "income",
            date: doc.id,
            ...s,
          });
          totalIncome += s.amount;
        });

        (data.expenses || []).forEach((e) => {
          all.push({
            type: "expense",
            date: doc.id,
            ...e,
          });
          totalExpense += e.amount;
        });
      }
    });

    setMonthData(all);
    setMonthTotals({
      income: totalIncome,
      expense: totalExpense
    });

    setShowMonth(true);
  };

  const net = income - expense;
  const monthNet = monthTotals.income - monthTotals.expense;

  return (
    <div style={{
      ...container,
      padding: isMobile ? "15px" : "30px"
    }}>
      <h1 style={title}>📊 Dashboard</h1>

      <input type="date" onChange={handleDate} style={dateInput} />

      {date && (
        <>
          <button onClick={loadMonth} style={monthBtn}>
            📅 تقرير الشهر
          </button>

          {/* 💰 اليوم */}
          <div style={{
            ...grid,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)"
          }}>
            <div style={cardGreen}>💰 دخل: {income}</div>
            <div style={cardRed}>💸 مصروف: {expense}</div>
            <div style={cardBlue}>📊 صافي: {net}</div>
            <div style={cardDark}>👥 Clients: {clientsCount}</div>
          </div>

          {/* 👨‍💻 الموظفين */}
          <h2>👨‍💻 الموظفين</h2>

          <div style={{
            ...employeesGrid,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))"
          }}>
            {Object.keys(employees).map((emp) => {
              const e = employees[emp];

              return (
                <div key={emp} style={employeeCard}>
                  <h3>{emp}</h3>
                  <p>📋 Total: {e.total}</p>
                  <p style={{ color: "#f39c12" }}>⏳ {e.pending}</p>
                  <p style={{ color: "#3498db" }}>🔄 {e.in_progress}</p>
                  <p style={{ color: "#2ecc71" }}>✅ {e.done}</p>
                </div>
              );
            })}
          </div>

          {/* 🔥 تقرير الشهر */}
          {showMonth && (
            <div style={monthBox}>
              <h2>📊 تقرير الشهر</h2>

              <div style={{
                ...grid,
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)"
              }}>
                <div style={cardGreen}>💰 {monthTotals.income}</div>
                <div style={cardRed}>💸 {monthTotals.expense}</div>
                <div style={cardBlue}>📊 {monthNet}</div>
              </div>

              {monthData.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...row,
                    flexDirection: isMobile ? "column" : "row",
                    gap: "5px"
                  }}
                >
                  <span>{item.date}</span>

                  {item.type === "income" ? (
                    <span style={{ color: "green" }}>
                      💰 {item.client} - {item.service} : {item.amount}
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      💸 {item.reason} : {item.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* 🎨 Styles */

const container = {
  background: "#f1f5f9",
  minHeight: "100vh"
};

const title = {
  fontSize: "30px",
  marginBottom: "20px"
};

const dateInput = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "20px"
};

const monthBtn = {
  width: "100%",
  padding: "12px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  marginBottom: "20px",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gap: "15px",
  marginBottom: "20px"
};

const card = {
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  fontWeight: "bold"
};

const cardGreen = { ...card, background: "#22c55e", color: "white" };
const cardRed = { ...card, background: "#ef4444", color: "white" };
const cardBlue = { ...card, background: "#3b82f6", color: "white" };
const cardDark = { ...card, background: "#111827", color: "white" };

const employeesGrid = {
  display: "grid",
  gap: "15px"
};

const employeeCard = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const monthBox = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #eee",
  padding: "10px 0"
};