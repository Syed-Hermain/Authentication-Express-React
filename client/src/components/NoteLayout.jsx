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
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo/Brand */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">My Notes</span>
            </div>

            {/* Right side - Navigation links */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </NavLink>
              
              <NavLink
                to="/profile"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </NavLink>

              <button 
                className="bg-yellow-600 text-white px-4 rounded-md hover:bg-blue-700 transition-colors"
                onClick={logout }
                >
                Logout
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
        <div className="fixed inset-0 flex items-center justify-center bg-blur bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Create new Note</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // onEdit({ id: editingId, ...form }); // call your update API

                newNote(form);
                setForm({ title: "", content: "" });
                setDataId(false);
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
                  placeholder="Write the title for you note here ..."
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
                  placeholder="Write the content for you note here ..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDataId(null)}
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
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="p-6">
          <Outlet context = {{ notes: notes, fetchNotes: fetchNotes }} />
        </div>
      </div>
    </>
  );
}

export default NoteLayout;
