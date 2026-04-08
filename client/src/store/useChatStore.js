import { create } from "zustand";
// import axios from 'axios';
import { api } from "../api/notesApi";
import { useAuthStore } from "./useAuthStore";
// import { searchUsers } from '../../../server/controllers/message.controller
// import toast from 'react-hot-toast';
// import { io } from "socket.io-client";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  chatUsers: [],
  searchResults: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/messages/users");
      set({ users: res.data, chatUsers: res.data }); // ✅ res.data not res.json()
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true }); // ✅ correct flag
    try {
      const res = await api.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ isMessagesLoading: false }); // ✅ correct flag
    }
  },

  sendMessage: async (messageData) => {
    // ✅ was missing
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        `/messages/send/${selectedUser.id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  searchUsers: async (query) => {
    try {
      const res = await api.get(
        `/messages/search?query=${encodeURIComponent(query)}`,
      );
      set({ searchResults: res.data });
    } catch (error) {
      console.error("Failed to search users:", error);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    //todo:
    socket.on("newMessage", (newMessage) => {
      if (newMessage.sender_id !== selectedUser.id) return;
      set({ messages: [...get().messages, newMessage] }); // ✅ also res.data directly
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
