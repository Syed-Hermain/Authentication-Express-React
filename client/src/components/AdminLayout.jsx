// import React from "react";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-800">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-800">
            Users
          </a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-800">
            Settings
          </a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-800">
            Reports
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hello, Admin</span>
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}