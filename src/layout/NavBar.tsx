"use client";
import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "../components/ui/resizable-navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import { SimpleModal } from "../components/ModalComponent";
import { v4 as uuidv4 } from "uuid";

export function NavbarComponent() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { logout, updateUser, deleteUser } = useAuthStore();
  const { createProduct } = useProductStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [editUserFormData, setEditUserFormData] = useState({
    username: currentUser?.username || "",
    avatar: currentUser?.avatar || "",
    role: currentUser?.role || ("user" as "user" | "admin"),
    token: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navItems = [
    { name: "Products", link: "/app/home" },
    { name: "Pricing", link: "/app/pricing" },
    { name: "Contact", link: "/app/contact" },
  ];

  const handleCreateClick = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      basePrice: 0,
      duration: {
        years: 0,
        months: 0,
        weeks: 0,
        hours: 0,
      },
      state: "active",
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createProduct({
        id: uuidv4(),
        chat: [],
        auction: {
          startTime: new Date().toISOString(),
          endTime: "",
          currentPrice: formData.basePrice,
          bids: [],
          winnerId: null,
        },
        ...formData,
      });
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        image: "",
        basePrice: 0,
        duration: {
          years: 0,
          months: 0,
          weeks: 0,
          hours: 0,
        },
        state: "active",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleLoginLogout = () => {
    if (currentUser) {
      logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleEditUserClick = () => {
    setEditUserFormData({
      username: currentUser?.username || "",
      avatar: currentUser?.avatar || "",
      role: currentUser?.role || "user",
      token: "",
    });
    setError(null);
    setIsUserMenuOpen(false);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      await deleteUser(currentUser.id);
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (error) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUserSave = async () => {
    if (!currentUser) return;
    setError(null);

    // Validation
    if (!editUserFormData.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!editUserFormData.avatar.trim()) {
      setError("Avatar URL is required");
      return;
    }
    if (editUserFormData.role === "admin" && !editUserFormData.token.trim()) {
      setError("Admin token is required");
      return;
    }

    try {
      const updatedUser = {
        id: currentUser.id,
        username: editUserFormData.username.trim(),
        avatar: editUserFormData.avatar.trim(),
        role: editUserFormData.role,
      };
      await updateUser(updatedUser);
      setIsEditUserModalOpen(false);
    } catch (error) {
      setError("Failed to update user. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    basePrice: 0,
    duration: {
      years: 0,
      months: 0,
      weeks: 0,
      hours: 0,
    },
    state: "active" as "active" | "past" | "future" | null,
  });

  return (
    <div className="top-0 z-50 bg-white dark:bg-slate-900">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="focus:outline-none"
            >
              <NavbarLogo
                name={currentUser?.username}
                avatar={currentUser?.avatar}
              />
            </button>
            {currentUser && isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleEditUserClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Edit User
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Delete User
                </button>
              </div>
            )}
          </div>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={handleLoginLogout}>
              {currentUser ? "Log Out" : "Log In"}
            </NavbarButton>
            {currentUser?.role === "admin" && (
              <NavbarButton variant="primary" onClick={handleCreateClick}>
                Create Product
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="focus:outline-none"
              >
                <NavbarLogo
                  name={currentUser?.username}
                  avatar={currentUser?.avatar}
                />
              </button>
              {currentUser && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleEditUserClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={handleLoginLogout}
                variant="secondary"
                className="w-full"
              >
                {currentUser ? "Log Out" : "Log In"}
              </NavbarButton>
              {currentUser?.role === "admin" && (
                <NavbarButton
                  onClick={handleCreateClick}
                  variant="primary"
                  className="w-full"
                >
                  Create Product
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Create Product Modal */}
      <SimpleModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-200">
          Crear Producto
        </h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Título</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Descripción</span>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              rows={4}
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Precio</span>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  basePrice: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
              min="0"
              step="0.01"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Imagen URL</span>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData((p) => ({ ...p, image: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Duración (años)</span>
            <input
              type="number"
              value={formData.duration.years}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  duration: { ...p.duration, years: Number(e.target.value) },
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
              min="0"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Duración (meses)</span>
            <input
              type="number"
              value={formData.duration.months}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  duration: { ...p.duration, months: Number(e.target.value) },
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
              min="0"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Duración (semanas)</span>
            <input
              type="number"
              value={formData.duration.weeks}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  duration: { ...p.duration, weeks: Number(e.target.value) },
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
              min="0"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Duración (horas)</span>
            <input
              type="number"
              value={formData.duration.hours}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  duration: { ...p.duration, hours: Number(e.target.value) },
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
              min="0"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Estado</span>
            <select
              id="state"
              name="state"
              value={formData.state || "active"}
              onChange={(e) =>
                setFormData((p) => ({ ...p, state: e.target.value as "active" | "past" | "future" }))
              }
              className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:text-neutral-200"
            >
              <option value="active">Activo</option>
              <option value="past">Finalizado</option>
              <option value="future">Futuro</option>
            </select>
          </label>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreateSave}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              Crear
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Edit User Modal */}
      <SimpleModal
        open={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-200">
          Edit User
        </h2>
        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Username</span>
            <input
              type="text"
              value={editUserFormData.username}
              onChange={(e) =>
                setEditUserFormData((p) => ({ ...p, username: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Avatar URL</span>
            <input
              type="text"
              value={editUserFormData.avatar}
              onChange={(e) =>
                setEditUserFormData((p) => ({ ...p, avatar: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Role</span>
            <select
              id="role"
              value={editUserFormData.role}
              onChange={(e) =>
                setEditUserFormData((p) => ({
                  ...p,
                  role: e.target.value as "user" | "admin",
                }))
              }
              className="w-full rounded-md border bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:text-neutral-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {editUserFormData.role === "admin" && (
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Admin confirmation token</span>
              <input
                type="text"
                value={editUserFormData.token}
                onChange={(e) =>
                  setEditUserFormData((p) => ({ ...p, token: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                placeholder="Enter your token"
              />
            </label>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditUserModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditUserSave}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      </SimpleModal>

      <Outlet />
    </div>
  );
}