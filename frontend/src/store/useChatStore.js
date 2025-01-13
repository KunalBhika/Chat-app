import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set , get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    onlineUsers : [] ,

    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers : async () => {
        { set({ isUsersLoading: true }) };
        try {
            const response = await axiosInstance.get("/message/users");
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages : async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            set({ isMessagesLoading: false });
        }
    } ,

    sendMessage : async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}` , messageData);
            set({messages : [...messages , response.data]});
            console.log(response);
        } catch (error) {
            console.log(error.response.data.message);
        }
    } ,

    setSelectedUser : (selectedUser) => set({selectedUser})

}));