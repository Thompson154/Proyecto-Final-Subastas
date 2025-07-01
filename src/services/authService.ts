import { AxiosError } from "axios";
import jsonServerInstance from "../api/jsonInstance";
import type { User } from "../interfaces/UserInterface";

interface ApiError {
  message: string;
}

export const loginUser = async (username: string, role: string): Promise<User> => {
  try {
    const response = await jsonServerInstance.get("/users", {
        params: { username, role }
    });
    console.log("Server response:", response.data);
    return response.data[0];
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Credenciales incorrectas.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
};


export const getUsers = async (): Promise<User> => {
  try {
    const response = await jsonServerInstance.get("/users");
    if (!response.data || response.data.length === 0) {
      throw new Error('No se encontraron usuarios.');
    }
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Credenciales incorrectas.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const res = await jsonServerInstance.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching user ${id}:`, err);
    return null;
  }
};


export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await jsonServerInstance.post("/users", user);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Error al registrar el usuario.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
}

export const updateUser = async (user: User): Promise<User> => {
  try {
    const response = await jsonServerInstance.put(`/users/${user.id}`, user);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Error al actualizar el usuario.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
}

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await jsonServerInstance.delete(`/users/${userId}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = (error.response?.data as ApiError)?.message || 'Error al eliminar el usuario.';
      throw new Error(errorMessage);
    }
    throw new Error('Error de conexión con el servidor.');
  }
}