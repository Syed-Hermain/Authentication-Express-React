import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import { getNotes, createNote } from "../api/notesApi";
import { useAuthStore } from "../store/useAuthStore";

function NoteLayout() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [dataId, setDataId] = useState(false);
  const { logout } = useAuthStore();
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const { data } = await getNotes();
    setNotes(data);
  };

  const newNote = async (note) => {
    await createNote({ title: note.title, content: note.content });
    await fetchNotes();
  };

  return (
    <>
      <nav className="bg-black shadow-lg border-b border-red-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      {/* Left side - Logo/Brand */}
      <div className="flex items-center">
        <span className="text-2xl font-extrabold text-yellow-500 tracking-wide">
          My Notes
        </span>
      </div>

      {/* Right side - Navigation links */}
      <div className="hidden md:flex items-center space-x-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-red-500 font-semibold"
                : "text-gray-300 hover:text-yellow-400"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-red-500 font-semibold"
                : "text-gray-300 hover:text-yellow-400"
            }`
          }
        >
          Profile
        </NavLink>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium shadow-md"
          onClick={logout}
        >
          Logout
        </button>

        <button
          className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors font-semibold shadow-md"
          onClick={() => setDataId(true)}
        >
          New Note
        </button>
      </div>
    </div>
  </div>
</nav>

{/* Page content */}
{dataId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 border border-red-700">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">
        Create New Note
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          newNote(form);
          setForm({ title: "", content: "" });
          setDataId(false);
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
            placeholder="Write the title for your note..."
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
            placeholder="Write the content for your note..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setDataId(null)}
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

<div className="max-w-4xl mx-auto px-6 py-10">
  <div className="p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
    <Outlet context={{ notes: notes, fetchNotes: fetchNotes }} />
  </div>
</div>
</>
  );
}

export default NoteLayout;
