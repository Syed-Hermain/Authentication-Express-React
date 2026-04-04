import { NavLink, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
function Userlayout() {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <div className="flex-shrink-0 text-red-500 font-bold text-xl">
              CRM
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-red-500 hover:text-white"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-red-500 hover:text-white"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-red-500 hover:text-white"
                  }`
                }
              >
                Services
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-red-500 hover:text-white"
                  }`
                }
              >
                Contact
              </NavLink>
              {
                authUser.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:bg-red-500 hover:text-white"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )

              }
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-4">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}

export default Userlayout;