import { create } from "zustand";
import { checkAuth, signup, login, logout } from "../api/notesApi";
// import { login } from "../api/notesApi";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await checkAuth();
      set({ authUser: res.data });
      get().connectSocket();

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

      get().connectSocket();
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
        get().connectSocket();
    }catch(error){
        console.error("Signup error:", error);
        set({ authUser: null });
    }
  },
  logout: async() =>{
    await logout();
    set({ authUser: null });
    get().disconnectSocket();
  },
   
  connectSocket: () =>{
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();

    set({socket: socket});

    socket.on("getOnlineUsers", (userIds)=>{
      set({onlineUsers: userIds});
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected){
        get().socket.disconnect();
    }
  }
}));
