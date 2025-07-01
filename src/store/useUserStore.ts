import { create } from "zustand";
import type { User } from "../interfaces/UserInterface";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../services/authService";

interface UsersStore {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;

  fetchUser: (userId: string) => void;
  fetchUsers: () => void;
  deleteUser: (id: string) => void;
  createUser: (user: User) => void;
  updateUser: (user: User) => void;
}

export const useUserStore = create<UsersStore>((set) => ({
  users: [],
  selectedUser: null,
  productsBids: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true });
      const usersResponse = await getUsers();
      set({ users: Array.isArray(usersResponse) ? usersResponse : [usersResponse] });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async (userId) => {
    try {
      set({ isLoading: true });
      const userResponse = await getUserById(userId);
      set({ selectedUser: userResponse });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (user: User) => {
    try {
      set({ isLoading: true });
      const userResponse = await createUser(user);
      if (!userResponse) {
        throw new Error("No se logro Crear el usuario");
      }
      set((state) => ({
        users: [...state.users, userResponse],
      }));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (user: User) => {
    try {
      set({ isLoading: true });
      const userResponse = await updateUser(user);
      if (!userResponse) {
        throw new Error("No se logro Actualizar el usuario");
      }
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userResponse.id ? userResponse : u
        ),
      }));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true });
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
