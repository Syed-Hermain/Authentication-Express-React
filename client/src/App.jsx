import { useState } from "react";
import "./App.css";
import { getNotes, updateNote, deleteNote, createNote } from "./api/notesApi";
import { useEffect } from "react";
import Notes from "./components/Notes";
import { Routes, Route } from "react-router";
import NoteLayout from "./components/NoteLayout";
import { AuthProvider } from "./context/AuthContext";
import CheckAuth from "./components/checkAuth";
import LoginPage from "./components/loginPage";
import Userlayout from "./components/UserLayout";
import Users from "./components/users";

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

  return (
    // Correct ✓
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<CheckAuth />}>
          <Route element={<NoteLayout onCreate={newNote} />}>
            {" "}
            {/* ← indented INSIDE CheckAuth */}
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

<Route element = {<Userlayout/>}>
  <Route path = "/users" element = {<Users/>}/>
</Route>


        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
