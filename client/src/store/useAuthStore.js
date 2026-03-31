import { create } from "zustand";
import { checkAuth, signup, login, logout } from "../api/notesApi";
// import { login } from "../api/notesApi";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await checkAuth();
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // In your store
  login: async (email, password) => {
    try {
      const res = await login({ email, password }); // your API function
      set({ authUser: res.data });
    //   set({ isLoggingIn: false });
    } catch (error) {
      console.error("Login error:", error);
      set({ authUser: null });
    }
  },

  signup: async ( name, email, password) =>{
    try{
        const res = await signup({ name, email, password });
        set({ authUser: res.data });
    }catch(error){
        console.error("Signup error:", error);
        set({ authUser: null });
    }
  },
  logout: async() =>{
    await logout();
    set({ authUser: null });
  }
}));
