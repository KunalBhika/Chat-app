import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser : null ,
    isCheckingAuth : true ,
    isLoggingin : false ,
    isSigningUp : false ,
    isUpdatingProfile : false ,

    checkAuth : async () => {
        try {
            const response = await axiosInstance.get("/check");
            set({authUser : response.data});
        } catch (error) {
            console.log("Error in checkAuth" , error);
            set({authUser : null});
        } finally {
            set({isCheckingAuth : false});
        }
    } ,

    signup : async () => {

    }
}));