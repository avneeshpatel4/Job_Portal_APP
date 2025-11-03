// store/useAuthStore.js
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,   // recruiter info
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (fullname, email, phoneNumber, password, role) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, phoneNumber, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // ✅ Use user._id as companyId
      const userWithCompanyId = {
        ...data.user,
        companyId: data.user._id,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userWithCompanyId));
      await AsyncStorage.setItem("token", data.token);

      set({ user: userWithCompanyId, token: data.token, isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      set({ token, user });
    } catch (error) {
      console.log("Auth check failed:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
