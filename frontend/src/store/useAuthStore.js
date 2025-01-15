import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set , get) => ({
    authUser : null ,
    isCheckingAuth : false ,
    isLoggingin : false ,
    isSigningUp : false ,
    isUpdatingProfile : false ,
    onlineUsers : [] ,
    socket : null ,

    checkAuth : async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({authUser : response.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth" , error);
            set({authUser : null});
        } finally {
            set({isCheckingAuth : false});
        }
    } ,

    signup : async (data) => {
        set({isSigningUp : true});
        try {
            const response = await axiosInstance.post("/auth/signup" , data);
            toast.success(`Account Created Welcome ${response.data.fullName}`);
            set({authUser : response.data});
            get().connectSocket();
        } catch (error) {
            toast.error(error);
        } finally {
            set({isSigningUp : false});
        }
    } ,

    login : async (data) => {
        set({isLoggingin : true});
        try {
            const response = await axiosInstance.post("/auth/login" , data);
            toast.success(`Logged in Welcome ${response.data.fullName}`);
            set({authUser : response.data});
            get().connectSocket();
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingin : false});
        }
    } ,

    updateProfile : async (data) => {
        try {
            set({isUpdatingProfile : true});
            const response = await axiosInstance.put("/auth/update-profile" , data);
            set({authUser : response.data});
            toast.success("Profile Picture Updated");
        } catch (error) {
            // console.log(error.response.data.message);
            toast.error("Something went wrong");
        } finally {
            set({isUpdatingProfile : false});
        }
    } ,

    logout : async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Logged out");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Something went wrong");
        }
    } ,

    connectSocket : () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;   // not authorized or already connected then return
        const socket = io(BASE_URL , {
            query : {
                userId : authUser._id
            }
        });
        
        socket.connect();
        set({socket : socket});

        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers : userIds});   
        });
    } ,

    disconnectSocket : () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}));