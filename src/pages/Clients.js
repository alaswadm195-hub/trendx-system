import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export default function Clients() {

  const isMobile = window.innerWidth < 768;

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    startDate: "",
    endDate: "",
    hours: "",
    extraHours: "",
    price: "",
    paid: "",
    notes: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clients"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    const data = {
      ...form,
      remaining: Number(form.price || 0) - Number(form.paid || 0)
    };

    if (editingId) {
      await updateDoc(doc(db, "clients", editingId), data);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "clients"), data);
    }

    setForm({
      name: "",
      phone: "",
      service: "",
      startDate: "",
      endDate: "",
      hours: "",
      extraHours: "",
      price: "",
      paid: "",
      notes: "",
    });
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditingId(client.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("متأكد؟")) {
      await deleteDoc(doc(db, "clients", id));
    }
  };

  return (
    <div style={{
      ...page,
      padding: isMobile ? "15px" : "30px"
    }}>
      <h1 style={title}>Clients 💼</h1>

      {/* FORM */}
      <div style={card}>
        <h3>{editingId ? "Edit Client" : "Add Client"}</h3>

        <div style={{
          ...formGrid,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))"
        }}>
          <input style={input} value={form.name} placeholder="اسم العميل"
            onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <input style={input} value={form.phone} placeholder="الموبايل"
            onChange={(e)=>setForm({...form,phone:e.target.value})}/>
          <input style={input} value={form.service} placeholder="الخدمة"
            onChange={(e)=>setForm({...form,service:e.target.value})}/>
          <input style={input} type="date"
            value={form.startDate}
            onChange={(e)=>setForm({...form,startDate:e.target.value})}/>
          <input style={input} type="date"
            value={form.endDate}
            onChange={(e)=>setForm({...form,endDate:e.target.value})}/>
          <input style={input} value={form.hours} placeholder="الساعات"
            onChange={(e)=>setForm({...form,hours:e.target.value})}/>
          <input style={input} value={form.extraHours} placeholder="إضافي"
            onChange={(e)=>setForm({...form,extraHours:e.target.value})}/>
          <input style={input} value={form.price} placeholder="التكلفة"
            onChange={(e)=>setForm({...form,price:e.target.value})}/>
          <input style={input} value={form.paid} placeholder="المدفوع"
            onChange={(e)=>setForm({...form,paid:e.target.value})}/>
          <input style={input} value={form.notes} placeholder="ملاحظات"
            onChange={(e)=>setForm({...form,notes:e.target.value})}/>
        </div>

        <button style={mainBtn} onClick={handleSubmit}>
          {editingId ? "Update" : "+ Add"}
        </button>
      </div>

      {/* TABLE */}
      <div style={{
        ...card,
        overflowX: "auto" // 🔥 أهم تعديل
      }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>الاسم</th>
              <th style={th}>الموبايل</th>
              <th style={th}>الخدمة</th>
              <th style={th}>بداية</th>
              <th style={th}>نهاية</th>
              <th style={th}>الساعات</th>
              <th style={th}>إضافي</th>
              <th style={th}>التكلفة</th>
              <th style={th}>دفع</th>
              <th style={th}>متبقي</th>
              <th style={th}>تحكم</th>
            </tr>
          </thead>

          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.phone}</td>
                <td style={td}>{c.service}</td>
                <td style={td}>{c.startDate}</td>
                <td style={td}>{c.endDate}</td>
                <td style={td}>{c.hours}</td>
                <td style={td}>{c.extraHours}</td>
                <td style={td}>{c.price}</td>
                <td style={td}>{c.paid}</td>

                <td style={{
                  ...td,
                  color: c.remaining > 0 ? "red" : "green",
                  fontWeight: "bold"
                }}>
                  {c.remaining}
                </td>

                <td style={td}>
                  <button style={editBtn} onClick={()=>handleEdit(c)}>✏️</button>
                  <button style={deleteBtn} onClick={()=>handleDelete(c.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 */

const page = {
  background: "#f4f6f9",
  minHeight: "100vh",
};

const title = {
  fontSize: "24px",
  marginBottom: "15px"
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

const mainBtn = {
  width: "100%",
  background: "#2c3e50",
  color: "white",
  padding: "12px",
  borderRadius: "8px"
};

const table = {
  width: "100%",
  minWidth: "800px"
};

const th = {
  padding: "10px",
  fontSize: "13px"
};

const td = {
  padding: "10px",
  fontSize: "13px"
};

const editBtn = {
  background: "#3498db",
  color: "#fff",
  padding: "6px",
  borderRadius: "6px"
};

const deleteBtn = {
  background: "#e74c3c",
  color: "#fff",
  padding: "6px",
  borderRadius: "6px"
};