import jsonServerInstance from "../api/jsonInstance";
import type { ChatMessage } from "../interfaces/Message";
import type { Product } from "../interfaces/ProductInterface";


/**
 * Devuelve el array de mensajes de un producto.
 */
export const getChat = async (productId: number) => {
  try {
    const res = await jsonServerInstance.get<Product>(`/products/${productId}`);
    return res.data.chat; // solo el chat
  } catch (err) {
    console.error(`Error fetching chat for product ${productId}:`, err);
  }
};

/**
 * Agrega un mensaje al chat (PATCH sobre el array).
 */
export const addChatMessage = async (
  productId: number,
  newMsg: ChatMessage,
) => {
  try {
    // Traemos el chat actual
    const productRes = await jsonServerInstance.get<Product>(
      `/products/${productId}`,
    );
    const updatedChat = [...productRes.data.chat, newMsg];

    // Enviamos solo la parte que cambia
    const res = await jsonServerInstance.patch<Product>(
      `/products/${productId}`,
      { chat: updatedChat },
    );
    return res.data.chat;
  } catch (err) {
    console.error(`Error adding chat message to product ${productId}:`, err);
    throw err;
  }
};
