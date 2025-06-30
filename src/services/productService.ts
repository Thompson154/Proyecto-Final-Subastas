import jsonServerInstance from "../api/jsonInstance";
import type { Product } from "../interfaces/ProductInterface";

export const getProducts = async () => {
  try {
    const res = await jsonServerInstance.get("/products");
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await jsonServerInstance.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    return null;
  }
};

export const createProduct = async (product: Product) => {
  try {
    const res = await jsonServerInstance.post("/products", product);
    return res.data;
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const res = await jsonServerInstance.put(
      `/products/${product.id}`,
      product,
    );
    return res.data;
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await jsonServerInstance.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
};


