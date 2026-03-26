import { useState } from "react";
import "./App.css";
import { getNotes, updateNote, deleteNote, createNote} from "./api/notesApi";
import { useEffect } from "react";
import Notes from "./components/Notes";
import { Routes, Route } from "react-router";
import NoteLayout from "./components/NoteLayout";

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
    fetchNotes();
  }, []);

  return (
    <Routes>
      <Route element={<NoteLayout onCreate={newNote} />}>
        <Route
          path="/"
          element={
            <Notes notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
