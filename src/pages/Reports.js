import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Reports() {

  const isMobile = window.innerWidth < 768;

  const [date, setDate] = useState("");
  const [services, setServices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    service: "",
    client: "",
    amount: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    note: ""
  });

  const loadDay = async (selectedDate) => {
    setLoading(true);

    const ref = doc(db, "reports", selectedDate);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setServices(snap.data().services || []);
      setExpenses(snap.data().expenses || []);
    } else {
      setServices([]);
      setExpenses([]);
    }

    setLoading(false);
  };

  const handleDate = (e) => {
    const d = e.target.value;
    setDate(d);
    loadDay(d);
  };

  const addService = () => {
    if (!serviceForm.service || !serviceForm.amount) return;

    setServices([
      ...services,
      { ...serviceForm, amount: Number(serviceForm.amount) }
    ]);

    setServiceForm({ service: "", client: "", amount: "" });
  };

  const addExpense = () => {
    if (!expenseForm.amount) return;

    setExpenses([
      ...expenses,
      { ...expenseForm, amount: Number(expenseForm.amount) }
    ]);

    setExpenseForm({ amount: "", note: "" });
  };

  useEffect(() => {
    if (!date || loading) return;

    const save = async () => {
      await setDoc(doc(db, "reports", date), {
        date,
        services,
        expenses
      });
    };

    save();
  }, [services, expenses, date, loading]);

  const totalIncome = services.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0);
  const net = totalIncome - totalExpense;

  return (
    <div style={{
      ...container,
      padding: isMobile ? "15px" : "30px"
    }}>
      <h1 style={title}>📊 Reports</h1>

      <input type="date" onChange={handleDate} style={dateInput} />

      {date && (
        <>
          {/* 💼 Services */}
          <div style={card}>
            <h2>خدمات اليوم</h2>

            <div style={{
              ...formGrid,
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr auto"
            }}>
              <input
                placeholder="الخدمة"
                style={input}
                value={serviceForm.service}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, service: e.target.value })
                }
              />

              <input
                placeholder="العميل"
                style={input}
                value={serviceForm.client}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, client: e.target.value })
                }
              />

              <input
                placeholder="المبلغ"
                style={input}
                value={serviceForm.amount}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, amount: e.target.value })
                }
              />

              <button style={primaryBtn} onClick={addService}>
                + إضافة
              </button>
            </div>

            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  ...itemCard,
                  flexDirection: isMobile ? "column" : "row"
                }}
              >
                <span>{s.service}</span>
                <span>{s.client}</span>
                <span style={money}>💰 {s.amount}</span>
              </div>
            ))}
          </div>

          {/* 💸 Expenses */}
          <div style={card}>
            <h2>مصاريف اليوم</h2>

            <div style={{
              ...formGrid,
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto"
            }}>
              <input
                placeholder="المبلغ"
                style={input}
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: e.target.value })
                }
              />

              <input
                placeholder="السبب"
                style={input}
                value={expenseForm.note}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, note: e.target.value })
                }
              />

              <button style={dangerBtn} onClick={addExpense}>
                + إضافة
              </button>
            </div>

            {expenses.map((e, i) => (
              <div
                key={i}
                style={{
                  ...itemCardRed,
                  flexDirection: isMobile ? "column" : "row"
                }}
              >
                <span>{e.note}</span>
                <span style={moneyRed}>💸 {e.amount}</span>
              </div>
            ))}
          </div>

          {/* 📊 Summary */}
          <div style={{
            ...summaryGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr"
          }}>
            <div style={incomeBox}>💰 {totalIncome}</div>
            <div style={expenseBox}>💸 {totalExpense}</div>
            <div style={netBox}>📊 {net}</div>
          </div>
        </>
      )}
    </div>
  );
}

/* 🎨 */

const container = {
  background: "#f1f5f9",
  minHeight: "100vh"
};

const title = {
  fontSize: "26px",
  marginBottom: "15px"
};

const dateInput = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "20px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const formGrid = {
  display: "grid",
  gap: "10px",
  marginBottom: "15px"
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px"
};

const primaryBtn = {
  width: "100%",
  background: "#2563eb",
  color: "white",
  padding: "10px",
  borderRadius: "8px"
};

const dangerBtn = {
  width: "100%",
  background: "#ef4444",
  color: "white",
  padding: "10px",
  borderRadius: "8px"
};

const itemCard = {
  display: "flex",
  justifyContent: "space-between",
  background: "#ecfdf5",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "8px"
};

const itemCardRed = {
  display: "flex",
  justifyContent: "space-between",
  background: "#fef2f2",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "8px"
};

const money = {
  color: "green",
  fontWeight: "bold"
};

const moneyRed = {
  color: "red",
  fontWeight: "bold"
};

const summaryGrid = {
  display: "grid",
  gap: "10px",
  marginTop: "20px"
};

const incomeBox = {
  background: "#22c55e",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center"
};

const expenseBox = {
  background: "#ef4444",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center"
};

const netBox = {
  background: "#3b82f6",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center"
};