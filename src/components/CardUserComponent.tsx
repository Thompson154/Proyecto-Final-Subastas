"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import { SimpleModal } from "./ModalComponent";

// Icons for edit and delete (using SVG from Heroicons)
const EditIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-blue-500 hover:text-blue-700"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </motion.svg>
);

const DeleteIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-red-500 hover:text-red-700"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </motion.svg>
);

const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

interface User {
  id: string;
  username: string;
  avatar: string;
  role: "admin" | "user";
}

interface CardUserComponentProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function CardUserComponent({ users, onEdit, onDelete }: CardUserComponentProps) {
  const [active, setActive] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
        setIsModalOpen(false);
      }
    }

    if (active || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, isModalOpen]);

  useOutsideClick(ref, () => {
    setActive(null);
    setIsModalOpen(false);
  });

  const handleEditClick = (user: User) => {
    setFormData({
      id: user.id,
      username: user.username,
      avatar: user.avatar || "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData) {
      onEdit(formData);
      setIsModalOpen(false);
      setFormData(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-close-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.avatar || "https://via.placeholder.com/200"}
                  alt={active.username}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`username-${active.id}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.username}
                    </motion.h3>
                    <motion.p
                      layoutId={`role-${active.id}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 capitalize"
                    >
                      Rol: {active.role}
                    </motion.p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      layoutId={`edit-${active.id}-${id}`}
                      onClick={() => handleEditClick(active)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                      <EditIcon />
                    </motion.button>
                    <motion.button
                      layoutId={`delete-${active.id}-${id}`}
                      onClick={() => onDelete(active.id)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                      <DeleteIcon />
                    </motion.button>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <p>Usuario: {active.username}</p>
                    <p>Rol: {active.role}</p>
                    <p>ID: {active.id}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && formData && (
          <SimpleModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-2xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-200">
              Editar Usuario
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">Nombre de Usuario</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => p && { ...p, username: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">Avatar (URL)</span>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData((p) => p && { ...p, avatar: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">Rol</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((p) => p && { ...p, role: e.target.value as "admin" | "user" })
                  }
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="admin">Admin</option>
                  <option value="user">Usuario</option>
                </select>
              </label>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </SimpleModal>
        )}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {users.map((user) => (
          <motion.div
            layoutId={`card-${user.id}-${id}`}
            key={`card-${user.id}-${id}`}
            onClick={() => setActive(user)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${user.id}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={user.avatar || "https://via.placeholder.com/100"}
                  alt={user.username}
                  className="h-14 w-14 rounded-full object-cover object-center"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`username-${user.id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {user.username}
                </motion.h3>
                <motion.p
                  layoutId={`role-${user.id}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left capitalize"
                >
                  Rol: {user.role}
                </motion.p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <motion.button
                layoutId={`edit-${user.id}-${id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(user);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <EditIcon />
              </motion.button>
              <motion.button
                layoutId={`delete-${user.id}-${id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(user.id);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <DeleteIcon />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}