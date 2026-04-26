import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc
} from "firebase/firestore";

export default function Schedule({ user }) {

  const isMobile = window.innerWidth < 768;

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    time: "",
    title: "",
    client: "",
    assigned: "",
  });

  // 🔄 تحميل
  useEffect(() => {
    if (!date) return;

    const ref = collection(db, "schedule_by_date", date, "slots");

    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort((a, b) => a.time.localeCompare(b.time));

      setSlots(data);
    });

    return () => unsub();
  }, [date]);

  // ➕ Add
  const addSlot = async () => {
    if (!form.time || !form.title || !date) return;

    await addDoc(
      collection(db, "schedule_by_date", date, "slots"),
      form
    );

    setForm({
      time: "",
      title: "",
      client: "",
      assigned: "",
    });
  };

  // 🗑 Delete
  const deleteSlot = async (id) => {
    await deleteDoc(
      doc(db, "schedule_by_date", date, "slots", id)
    );
  };

  return (
    <div style={{
      ...page,
      padding: isMobile ? "15px" : "25px"
    }}>
      <h1 style={title}>📅 Schedule</h1>

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        style={input}
      />

      {date && (
        <>
          {/* ➕ Add */}
          <div style={{
            ...addBox,
            flexDirection: isMobile ? "column" : "row"
          }}>
            <input
              placeholder="الساعة"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              style={input}
            />

            <input
              placeholder="نوع الشغل"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              style={input}
            />

            <input
              placeholder="العميل"
              value={form.client}
              onChange={(e) =>
                setForm({ ...form, client: e.target.value })
              }
              style={input}
            />

            <input
              placeholder="الموظف"
              value={form.assigned}
              onChange={(e) =>
                setForm({ ...form, assigned: e.target.value })
              }
              style={input}
            />

            <button style={addBtn} onClick={addSlot}>
              + إضافة
            </button>
          </div>

          {/* 📋 Slots */}
          <div style={table}>
            {slots.map((s) => (
              <div
                key={s.id}
                style={{
                  ...row,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center"
                }}
              >
                <div style={time}>{s.time}</div>

                <div style={content}>
                  <strong>{s.title}</strong>
                  <p>👤 {s.client}</p>
                  <p>🎬 {s.assigned}</p>
                </div>

                <button
                  onClick={() => deleteSlot(s.id)}
                  style={deleteBtn}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* 🎨 Styles */

const page = {
  background: "#f5f6fa",
  minHeight: "100vh",
};

const title = {
  fontSize: "26px",
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const addBox = {
  display: "flex",
  gap: "10px",
  margin: "15px 0",
};

const addBtn = {
  width: "100%",
  background: "#2c3e50",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
};

const table = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  background: "white",
  padding: "12px",
  borderRadius: "10px",
  gap: "10px"
};

const time = {
  fontWeight: "bold",
  color: "#2980b9",
};

const content = {
  flex: 1,
};

const deleteBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
};