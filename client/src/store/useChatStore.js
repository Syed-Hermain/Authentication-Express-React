import { create } from 'zustand';
// import toast from 'react-hot-toast';

export const useChatStore = create((set) => ({
    messages:[],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () =>{
        set({ isUsersLoading: true });
        try {
            const res  = await fetch('/api/users');
            set({ users: await res.json() });

        } catch (error) {
            console.error('Failed to fetch users:', error);
            // toast.error('Failed to fetch users');
        } finally {
            set({ isUsersLoading: false });
        }
    }
}))