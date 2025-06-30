"use client";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { cn } from "../lib/utils";
import { loginUser } from "../services/authService"; // tu nuevo servicio
import { useAuthStore } from "../store/useAuthStore";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Validación con Yup
const LoginSchema = Yup.object({
  username: Yup.string()
    .min(2, "Debe tener al menos 2 caracteres")
    .required("Requerido"),
  role: Yup.mixed<"user" | "admin">()
    .oneOf(["user", "admin"], "Rol inválido")
    .required("Requerido"),
});

export function LoginFormComponent() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const formik = useFormik({
    initialValues: {
      username: "",
      role: "user" as "user" | "admin",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const user = await loginUser(values.username, values.role);
        if (!user) throw new Error("Usuario no encontrado");

        loginStore(user); // Guarda usuario en Zustand

        console.log("Login exitoso", user);
        navigate("/app/home", { replace: true });
      } catch (err: any) {
        setErrors({ username: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="shadow-input mx-auto w-full max-w-md bg-white p-8 rounded-none md:rounded-2xl dark:bg-black">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
        Log In
      </h2>

      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Tu nombre"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-600 text-sm">{formik.errors.username}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="role">Login as</Label>
          <select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-zinc-900 dark:text-neutral-200"
            )}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-600 text-sm">{formik.errors.role}</p>
          )}
        </LabelInputContainer>

        <button
          disabled={formik.isSubmitting}
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          {formik.isSubmitting ? "Entrando..." : "Log In"}
          <BottomGradient />
        </button>
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          onClick={() => navigate("/signup", { replace: true })}
        >
          Sign Up
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
