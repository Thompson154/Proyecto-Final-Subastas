import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import type { Product } from "../interfaces/ProductInterface";
import type { Bid } from "../interfaces/BidsInterface";
import { useProductStore } from "../store/useProductStore";
import { createLogVisit } from "../services/productVisits";

const productSchema = Yup.object({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string().required("La descripción es requerida"),
  image: Yup.string().url("Debe ser una URL válida").optional(),
  basePrice: Yup.number().required("Precio requerido").positive(),
  durationSeconds: Yup.number().required("Duración requerida").integer().min(1),
  state: Yup.string().oneOf(["active", "past", "future"], "Estado inválido").optional(),
});

export const useProducts = () => {
  const navigate = useNavigate();
  const {
    products,
    selectedProduct,
    productsVisits,
    isLoading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getVisitProducts,
    bidProduct,
  } = useProductStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: "",
      basePrice: 0,
      state: "",
      duration: {
        years: 0,
        months: 0,
        weeks: 0,
        hours: 0,
      },
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      if (editingProduct) {
        await updateProduct({ 
          ...editingProduct, 
          ...values, 
          state: values.state === "" ? null : values.state as "active" | "past" | "future" 
        });
      } else {
        await createProduct({
          id: uuidv4(),
          chat: [],
          auction: {
            startTime: new Date().toISOString(),
            endTime: "",
            currentPrice: values.basePrice,
            bids: [],
            winnerId: null,
          },
          ...values,
        } as Product);
      }
      formik.resetForm();
      setEditingProduct(null);
      setOpenDialog(false);
    },
  });

  const openDialogHandler = () => {
    formik.resetForm();
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const closeDialogHandler = () => {
    formik.resetForm();
    setEditingProduct(null);
    setOpenDialog(false);
  };

  const editProductHandler = async (product: Product) => {
    try {
      await updateProduct(product);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProductById = async (id: string | number) => {
    if (confirm("¿Eliminar este producto?")) {
      await deleteProduct(String(id));
    }
  };

  const viewProduct = async (id: string) => {
    await fetchProduct(id);
    navigate(`/app/products/${id}`);
  };

  const handleBid = async (
    userId: string,
    productId: string,
    amount: number
  ) => {
    const bid: Bid = { userId, amount, timestamp: new Date().toISOString() };
    await bidProduct(userId, productId, bid);
  };

  const visitProduct = async (userId: string, productId: string) => {
    await getVisitProducts(userId);
    if (
      !productsVisits.some(
        (v) => v.userId === userId && v.productId === productId
      )
    ) {
      await createLogVisit(userId, productId);
    }
  };

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  const goToProduct = (id: string) => navigate(`/app/products/${id}`);

  return {
    products,
    selectedProduct,
    fetchProduct,
    productsVisits,
    isLoading,
    error,
    formik,
    openDialog,
    openDialogHandler,
    closeDialogHandler,
    editProductHandler,
    deleteProductById,
    viewProduct,
    goToProduct,
    visitProduct,
    updateProduct,
    handleBid,
  };
};