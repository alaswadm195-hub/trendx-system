import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
emailjs.init("YmpfTPMnLClHNH-0K");

export default function Tasks({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
  const fetchEmployees = async () => {
    const querySnapshot = await getDocs(
      collection(db, "employees")
    );

    const list = [];

    querySnapshot.forEach((doc) => {
      list.push(doc.data().email);
    });

    setEmployees(list);
  };

  fetchEmployees();
}, []);
  const [date, setDate] = useState("");

  const [form, setForm] = useState({
    title: "",
    client: "",
    assigned: "",
  });

  const isAdmin = user?.email === "admin@gmail.com";

  const isMobile = window.innerWidth < 768;

  // 🔥 تحميل + ترحيل + حذف القديم
  const loadTasksByDate = async (selectedDate) => {
    setDate(selectedDate);

    const todayRef = collection(db, "tasks_by_date", selectedDate, "tasks");
    const todaySnap = await getDocs(todayRef);

    if (todaySnap.empty) {
      const yesterday = new Date(selectedDate);
      yesterday.setDate(yesterday.getDate() - 1);

      const yDate = yesterday.toISOString().split("T")[0];
      const yRef = collection(db, "tasks_by_date", yDate, "tasks");
      const ySnap = await getDocs(yRef);

      for (let d of ySnap.docs) {
        const task = d.data();

        if (task.status !== "done" && !task.deleted) {
          await addDoc(todayRef, task);

          await updateDoc(
            doc(db, "tasks_by_date", yDate, "tasks", d.id),
            { deleted: true }
          );
        }
      }
    }

    return onSnapshot(todayRef, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((t) => !t.deleted);

      setTasks(data);
    });
  };

  const addTask = async () => {
  try {

    // 🔥 إضافة التاسك في Firebase
    await addDoc(
      collection(db, "tasks_by_date", date, "tasks"),
      {
        title: form.title,
        client: form.client,
        assigned: form.assigned,
        status: "pending",
        createdAt: new Date(),
      }
    );

    // 🔥 إرسال الإيميل
    await emailjs.send(
      "service_5u44bvm",
      "template_2e2qgq2",
      {
        task: form.title,
        client: form.client,
        employee: form.assigned,
        to_email: form.assigned,
      }
    );

    console.log("Email Sent ✅");

    // 🔥 تفريغ الفورم
    setForm({
      title: "",
      client: "",
      assigned: "",
    });

  } catch (err) {
    console.log("Error ❌", err);
  }
};

  const changeStatus = async (task, status) => {
    if (!task?.id || !date) return;

    await updateDoc(
      doc(db, "tasks_by_date", date, "tasks", task.id),
      { status }
    );
  };

  const deleteTask = async (task) => {
    await updateDoc(
      doc(db, "tasks_by_date", date, "tasks", task.id),
      { deleted: true }
    );
  };

  const myTasks = isAdmin
    ? tasks
    : tasks.filter(
        (t) =>
          t.assigned?.toLowerCase() === user?.email ||
          t.assigned === user?.displayName
      );

  const pending = myTasks.filter((t) => t.status === "pending");
  const inProgress = myTasks.filter((t) => t.status === "in_progress");
  const done = myTasks.filter((t) => t.status === "done");

  return (
    <div style={page}>
      <button
        onClick={async () => {
          await signOut(auth);
          setUser(null);
        }}
        style={logoutBtn}
      >
        Logout
      </button>

      <h1 style={title}> Tasks </h1>

      <input
        type="date"
        onChange={(e) => loadTasksByDate(e.target.value)}
        style={input}
      />

      {isAdmin && (
        <div
          style={{
            ...addBox,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <input
            placeholder="اسم المهمة"
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

          <select
  value={form.assigned}
  onChange={(e) =>
    setForm({ ...form, assigned: e.target.value })
  }
>
  <option value="">اختر الموظف</option>

  {employees.map((email, index) => (
    <option key={index} value={email}>
      {email}
    </option>
  ))}
</select>

          <button onClick={addTask} style={addBtn}>
            + Add
          </button>
        </div>
      )}

      <div
        style={{
          ...board,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        }}
      >
        <Column title="To Do" tasks={pending} isMobile={isMobile}>
          {(task) =>
            isAdmin ? (
              <>
                <button
                  style={deleteBtn}
                  onClick={() => deleteTask(task)}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                style={startBtn}
                onClick={() => changeStatus(task, "in_progress")}
              >
                Start
              </button>
            )
          }
        </Column>

        <Column title="In Progress" tasks={inProgress} isMobile={isMobile}>
          {(task) =>
            isAdmin ? (
              <>
                <button
                  style={backBtn}
                  onClick={() => changeStatus(task, "pending")}
                >
                  🔁
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteTask(task)}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                style={doneBtn}
                onClick={() => changeStatus(task, "done")}
              >
                Done
              </button>
            )
          }
        </Column>

        <Column title="Done" tasks={done} isMobile={isMobile}>
          {(task) =>
            isAdmin && (
              <>
                <button
                  style={editBtn}
                  onClick={() =>
                    changeStatus(task, "in_progress")
                  }
                >
                  مراجعة
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteTask(task)}
                >
                  Delete
                </button>
              </>
            )
          }
        </Column>
      </div>
    </div>
  );
}

/* Column */
function Column({ title, tasks, children, isMobile }) {
  return (
    <div
      style={{
        ...column,
        height: isMobile ? "auto" : "70vh",
      }}
    >
      <h2 style={columnTitle}>{title}</h2>

      <div style={scroll}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              ...card,
              fontSize: isMobile ? "16px" : "14px",
            }}
          >
            <h4>{task.title}</h4>
            <p>{task.client}</p>
            <p>{task.assigned}</p>

            <div style={actions}>{children(task)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Styles */

const page = {
  padding: "20px",
  background: "#f5f6fa",
  minHeight: "100vh",
};

const title = { marginBottom: "10px" };

const board = {
  display: "grid",
  gap: "20px",
  marginTop: "20px",
};

const column = {
  background: "#ecf0f1",
  padding: "15px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
};

const columnTitle = {
  marginBottom: "10px",
  fontWeight: "bold",
};

const scroll = {
  overflowY: "auto",
  flex: 1,
};

const card = {
  background: "white",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
};

const actions = {
  marginTop: "10px",
  display: "flex",
  gap: "5px",
  flexWrap: "wrap",
};

const addBox = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
  flexWrap: "wrap",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "100%",
};

const addBtn = {
  background: "#2c3e50",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "8px",
};

const logoutBtn = {
  background: "red",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  marginBottom: "10px",
};

const startBtn = {
  background: "#f39c12",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};

const doneBtn = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};

const backBtn = {
  background: "#7f8c8d",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};

const editBtn = {
  background: "#2980b9",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};

const deleteBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
};