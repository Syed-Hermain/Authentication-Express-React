import React, { useState, useEffect } from "react";
import { deleteNote, updateNote } from "../api/notesApi";
import { useOutletContext } from "react-router";

function Notes() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const { notes, fetchNotes } = useOutletContext();

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEdit = async (note) => {
    await updateNote(note.id, { title: note.title, content: note.content });
    await fetchNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    await fetchNotes();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
  <h1 className="text-3xl font-extrabold text-yellow-400 mb-8 tracking-wide">
    Notes
  </h1>

  {editingId && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 border border-red-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Edit Note</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit({ id: editingId, ...form });
            setEditingId(null);
            setForm({ title: "", content: "" });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {notes.map((note) => (
      <div
        key={note.id}
        className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 hover:border-red-500 hover:shadow-red-500/40 transition-all duration-300"
      >
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">
          {note.title}
        </h2>
        <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setEditingId(note.id);
              setForm({ title: note.title, content: note.content });
            }}
            className="px-4 py-2 text-sm font-medium text-yellow-400 bg-gray-700 rounded-md hover:bg-yellow-500 hover:text-black transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(note.id)}
            className="px-4 py-2 text-sm font-medium text-red-400 bg-gray-700 rounded-md hover:bg-red-600 hover:text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

export default Notes;
