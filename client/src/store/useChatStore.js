import { create } from 'zustand';
// import axios from 'axios';
import { api } from '../api/notesApi';
// import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
           const res = await api.get('/messages/users');
            set({ users: res.data });                    // ✅ res.data not res.json()
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });                // ✅ correct flag
        try {
           const res = await api.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            set({ isMessagesLoading: false });           // ✅ correct flag
        }
    },

    sendMessage: async (messageData) => {               // ✅ was missing
        const { selectedUser, messages } = get();
        try {
            const res = await api.post(`/messages/send/${selectedUser.id}`, messageData);
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}));