"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "../store/useUserStore";
import type { User } from "../interfaces/UserInterface";

const userSchema = Yup.object({
  username: Yup.string().required("El nombre de usuario es requerido"),
  avatar: Yup.string().url("Debe ser una URL válida").optional(),
  role: Yup.string()
    .oneOf(["admin", "user", "moderator"], "Rol inválido")
    .required("El rol es requerido"),
});

export const useUsers = () => {
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      avatar: "",
      role: "user" as "admin" | "user",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        if (editingUser) {
          await updateUser({ ...editingUser, ...values });
        } else {
          await createUser({
            id: uuidv4(),
            ...values,
          });
        }
        formik.resetForm();
        setEditingUser(null);
        setOpenDialog(false);
      } catch (err) {
        console.error("Error saving user:", err);
      }
    },
  });

  const openDialogHandler = (user?: User) => {
    if (user) {
      formik.setValues({
        username: user.username,
        avatar: user.avatar || "",
        role: user.role,
      });
      setEditingUser(user);
    } else {
      formik.resetForm();
      setEditingUser(null);
    }
    setOpenDialog(true);
  };

  const closeDialogHandler = () => {
    formik.resetForm();
    setEditingUser(null);
    setOpenDialog(false);
  };

  const deleteUserHandler = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [fetchUsers, users.length]);

  return {
    users,
    isLoading,
    error,
    formik,
    openDialog,
    createUser,
    updateUser,
    editingUser,
    setEditingUser,
    setOpenDialog,
    deleteUser,
    fetchUsers,
    openDialogHandler,
    closeDialogHandler,
    deleteUserHandler,
  };
};