import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(data);
    });

    return () => unsub();
  }, []);

  return (
    <div style={box}>
      <h3>🔔 Notifications</h3>

      {notes.length === 0 && <p>مفيش إشعارات</p>}

      {notes.map(note => (
        <div key={note.id} style={item}>
          {note.message}
        </div>
      ))}
    </div>
  );
}

const box = {
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "250px",
  background: "white",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  zIndex: 1000
};

const item = {
  padding: "8px",
  borderBottom: "1px solid #eee",
  fontSize: "14px"
};