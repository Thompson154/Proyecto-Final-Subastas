"use client";
import {
  IconEye,
  IconHammer,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../interfaces/ProductInterface";
import { SimpleModal } from "./ModalComponent";
import { BackgroundGradient } from "./ui/background-gradient";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  hasVisited?: boolean;
  hasBid?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductCard({
  product,
  isAdmin,
  hasVisited = false,
  hasBid = false,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    basePrice: product.basePrice,
    image: product.image,
    duration: product.duration ?? {
      years: 0,
      months: 0,
      weeks: 0,
      hours: ('durationSeconds' in product && typeof product.durationSeconds === 'number')
        ? Math.floor(product.durationSeconds / 3600)
        : 0,
    },
    state: product.state || "active",
  });

  const renderStatusIcon = () => {
    if (hasBid)
      return (
        <IconHammer size={24} className="text-yellow-500" title="Has pujado" />
      );
    if (hasVisited)
      return <IconEye size={24} className="text-blue-500" title="Visitado" />;
    return null;
  };

  const handleEditClick = () => {
    setFormData({
      title: product.title,
      description: product.description,
      basePrice: product.basePrice,
      image: product.image,
      duration: product.duration ?? {
        years: 0,
        months: 0,
        weeks: 0,
        hours: ('durationSeconds' in product && typeof product.durationSeconds === 'number')
          ? Math.floor(product.durationSeconds / 3600)
          : 0,
      },
      state: product.state || "active",
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    onEdit({ ...product, ...formData });
    setIsModalOpen(false);
  };

  return (
    <>
      <BackgroundGradient className="relative rounded-[22px] max-w-sm p-4 sm:p-6 bg-white dark:bg-zinc-900">
        <div className="absolute top-4 left-4">{renderStatusIcon()}</div>
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.title}
          className="object-contain w-full h-48 sm:h-64"
        />
        <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-semibold">
          {product.title}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {product.description.length > 100
            ? product.description.slice(0, 100) + "..."
            : product.description}
        </p>
        <button
          onClick={() => navigate(`/app/products/${product.id}`)}
          className="mt-4 inline-flex items-center rounded-full bg-black/90 text-white px-4 py-2 text-xs font-bold hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
        >
          <span>Subastar Ahora</span>
          <span className="ml-auto bg-zinc-700 rounded-full px-2 py-0 text-[0.6rem]">
            {product.basePrice}€
          </span>
        </button>
        {isAdmin && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={handleEditClick}
              className="p-1 rounded-md bg-white/80 hover:bg-white dark:bg-black/80"
            >
              <IconPencil className="w-5 h-5 text-gray-700 dark:text-neutral-200" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-1 rounded-md bg-white/80 hover:bg-white dark:bg-black/80"
            >
              <IconTrash className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}
      </BackgroundGradient>

      <SimpleModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-800 dark:text-neutral-200">
          Editar Producto
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
              value={formData.state}
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
    </>
  );
}