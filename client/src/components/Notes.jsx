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
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Notes</h1>

      {editingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit({ id: editingId, ...form }); // call your update API
                setEditingId(null);
                setForm({ title: "", content: "" });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {note.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  (setEditingId(note.id),
                    setForm({ title: note.title, content: note.content }));
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
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
