import { useState, useEffect } from "react";
import "./App.css";
import { getNotes, updateNote, deleteNote, createNote } from "./api/notesApi";
// import { useEffect } from "react";
import Notes from "./components/Notes";
import { Navigate, Routes, Route } from "react-router";
import NoteLayout from "./components/NoteLayout";
// import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/loginPage";
import Userlayout from "./components/UserLayout";
import Users from "./components/users";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const [notes, setNotes] = useState([]);
  //const [form, setForm] = useState({title:'', content:''});
  //const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    const { data } = await getNotes();
    setNotes(data);
  };

  const newNote = async (note) => {
    await createNote({ title: note.title, content: note.content });
    await fetchNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    await fetchNotes();
  };

  const handleEdit = async (note) => {
    await updateNote(note.id, { title: note.title, content: note.content });
    await fetchNotes();
  };

  useEffect(() => {
    async function fetchData() {
      await fetchNotes();
    }
    fetchData();
  }, []);

  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Authenticated User:", authUser);

  return (
    // Correct ✓

    <Routes>
      <Route
        path="/login"
        element={authUser ? <Navigate to="/" /> : <LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<NoteLayout onCreate={newNote} />}>
          <Route
            path="/"
            element={
              <Notes
                notes={notes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
          />
        </Route>

        <Route element={<Userlayout />}>
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
