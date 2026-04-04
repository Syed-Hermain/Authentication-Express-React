import { useEffect } from "react";
import "./App.css";
// import { getNotes, updateNote, deleteNote, createNote } from "./api/notesApi";
// import { useEffect } from "react";
import Notes from "./components/Notes";
import { Navigate, Routes, Route } from "react-router";
import NoteLayout from "./components/NoteLayout";
// import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/loginPage";
import Userlayout from "./components/UserLayout";
// import Users from "./components/users";
import { useAuthStore } from "./store/useAuthStore";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./components/ChatPage";

function App() {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  console.log("Authenticated User in the client side is :", authUser);

  return (
    <Routes>
      <Route
        path="/login"
        element={authUser ? <Navigate to="/" /> : <LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<NoteLayout />}>
          <Route path="/" element={<Notes />} />
        </Route>

        <Route element={<Userlayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          {/* Admin-only routes can go here */}
          <Route element  = {<AdminLayout />}>
            {/* Example admin route */}
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Route>  

      </Route>
    </Routes>
  );
}

export default App;
