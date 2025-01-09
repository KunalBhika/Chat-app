import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,

    isUsersLoading: false,
    isMessagesLoading: false,

    getUser: async () => {
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


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            set({ isMessageLoading: false });
        }
    }

}));