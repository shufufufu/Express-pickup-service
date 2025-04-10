// src/store/useUserStore.js
import { create } from "zustand";
import {
  getToken,
  setToken as saveToken,
  clearToken as removeToken,
} from "@/utils/index";

export const useUserStore = create((set) => ({
  token: getToken() || "",

  setToken: (newToken) => {
    saveToken(newToken);
    set({ token: newToken });
  },

  clearToken: () => {
    removeToken();
    set({ token: "" });
  },
}));
