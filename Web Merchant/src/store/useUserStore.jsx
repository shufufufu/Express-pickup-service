// src/store/useUserStore.js
import { create } from "zustand";
import {
  getToken,
  setToken as saveToken,
  clearToken as removeToken,
  getRiderId,
  setRiderId as saveRiderId,
  clearRiderId as removeRiderId,
  getDynamicToken,
  setDynamicToken as saveDynamicToken,
  clearDynamicToken as removeDynamicToken,
  canRequestNewDynamicToken,
} from "@/utils/index";

export const useUserStore = create((set) => ({
  token: getToken() || "",
  riderId: getRiderId() || "",
  dynamicToken: getDynamicToken() || "",

  setRiderId: (newRiderId) => {
    saveRiderId(newRiderId);
    set({ riderId: newRiderId });
  },

  clearRiderId: () => {
    removeRiderId();
    set({ riderId: "" });
  },

  setToken: (newToken) => {
    saveToken(newToken);
    set({ token: newToken });
  },

  clearToken: () => {
    removeToken();
    set({ token: "" });
  },

  setDynamicToken: (newDynamicToken) => {
    saveDynamicToken(newDynamicToken);
    set({ dynamicToken: newDynamicToken });
  },

  clearDynamicToken: () => {
    removeDynamicToken();
    set({ dynamicToken: "" });
  },

  canRequestNewDynamicToken: () => {
    return canRequestNewDynamicToken();
  },
}));
