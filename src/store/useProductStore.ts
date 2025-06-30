import { create } from "zustand";
import type { Bid } from "../interfaces/BidsInterface";
import type { Product } from "../interfaces/ProductInterface";
import { placeBid as apiPlaceBid } from "../services/auctionService";
import { logBid } from "../services/productBidService";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/productService";
import { createLogVisit, getLogVisitByUserId } from "../services/productVisits";

interface ProductsStore {
  products: Product[];
  selectedProduct: Product | null;
  productsVisits: { userId: string; productId: string }[];
  productsBids: { userId: string; productId: string; bid: Bid }[];
  isLoading: boolean;
  error: string | null;

  fetchProduct: (productId: string) => void;
  fetchProducts: () => void;
  deleteProduct: (id: string) => void;
  createProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;

  getVisitProducts: (userId: string) => void;
  createVisitProducts: (userId: string, productId: string) => void;
  bidProduct: (userId: string, productId: string, bid: Bid) => void;
}

export const useProductStore = create<ProductsStore>((set) => ({
  products: [],
  productsVisits: [],
  productsBids: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true });
      const productsResponse = await getProducts();
      set({ products: productsResponse });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProduct: async (productId) => {
    try {
      set({ isLoading: true });
      const productResponse = await getProductById(productId);
      set({ selectedProduct: productResponse });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (product: Product) => {
    try {
      set({ isLoading: true });
      const productResponse = await createProduct(product);
      if (!productResponse) {
        throw new Error("No se logro Crear el producto");
      }
      set((state) => ({
        products: [...state.products, productResponse],
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

  updateProduct: async (product: Product) => {
    try {
      set({ isLoading: true });
      const productResponse = await updateProduct(product);
      if (!productResponse) {
        throw new Error("No se logro Actualizar el producto");
      }
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productResponse.id ? productResponse : p
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

  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true });
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
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

  getVisitProducts: async (userId) => {
    try {
      set({ isLoading: true });
      const visits = await getLogVisitByUserId(userId);
      set({ productsVisits: visits });
    } catch (e) {
      console.error("Error logging visit:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  createVisitProducts: async (userId, productId) => {
    try {
      set({ isLoading: true });
      const visited = await createLogVisit(userId, productId);
      set((state) => ({
        productsVisits: [...state.productsVisits, visited],
      }));
    } catch (e) {
      console.error("Error logging visit:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  bidProduct: async (userId, productId, bid) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAuction = await apiPlaceBid(productId, bid);
      // Guardar la puja en histórico
      await logBid(userId, productId, bid);

      // Actualizar producto localmente en la store
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, auction: updatedAuction } : p
        ),
        selectedProduct:
          state.selectedProduct?.id === productId
            ? {
                ...state.selectedProduct,
                auction: updatedAuction,
              }
            : state.selectedProduct,
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
