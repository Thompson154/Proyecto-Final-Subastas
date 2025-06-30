import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../interfaces/UserInterface";
import { deleteUser, updateUser, createUser } from "../services/authService";

export interface authStoreInterface {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void; 
  deleteUser: (userId: string) => void;
  updateUser: (user: User) => void;
  createUser: (user: User) => void;
}
export const useAuthStore = create<authStoreInterface>()(
  persist(
    (set) => ({
      user: {} as User,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user: User) => set({ user }),
      deleteUser: async (userId: string) => {
        try {
          await deleteUser(userId);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      },
      updateUser: async (user: User) => {
        try {
          const updatedUser = await updateUser(user);
          set({ user: updatedUser });
        } catch (error) {
          console.error("Error updating user:", error);
        }
      },
      createUser: async (user: User) => {
        try {
          const newUser = await createUser(user);
          set({ user: newUser });
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    }),
    {
      name: "auth", 
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), 
    }
  )
)
