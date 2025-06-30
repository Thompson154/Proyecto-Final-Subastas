"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { v4 as uuidv4 } from "uuid";

export function SignupFormComponent() {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { createUser, login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!avatar.trim()) {
      setError("Avatar URL is required");
      return;
    }
    if (role === "admin" && !token.trim()) {
      setError("Admin token is required");
      return;
    }

    try {
      const newUser = {
        id: uuidv4(),
        username: username.trim(),
        avatar: avatar.trim(),
        role,
      };
      await createUser(newUser);
      await login(newUser);
      navigate("/app/home");
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md bg-white p-8 rounded-none md:rounded-2xl dark:bg-black">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
        Sign Up
      </h2>
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            type="url"
            placeholder="https://…"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className={cn(
              "w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-zinc-900 dark:text-neutral-200"
            )}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </LabelInputContainer>

        {role === "admin" && (
          <LabelInputContainer>
            <Label htmlFor="token">Admin confirmation token</Label>
            <Input
              id="token"
              type="text"
              placeholder="Enter your token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </LabelInputContainer>
        )}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign Up
          <BottomGradient />
        </button>
                <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          onClick={() => navigate("/login", { replace: true })}
        >
          Log In
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