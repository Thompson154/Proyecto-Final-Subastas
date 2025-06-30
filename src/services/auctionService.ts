import jsonServerInstance from "../api/jsonInstance";
import type { Auction } from "../interfaces/AuctionInterface";
import type { Bid } from "../interfaces/BidsInterface";
import type { Product } from "../interfaces/ProductInterface";

/**
 * Obtiene la info de subasta de un producto.
 */
export const getAuction = async (productId: string) => {
  try {
    const res = await jsonServerInstance.get<Product>(`/products/${productId}`);
    return res.data.auction;
  } catch (err) {
    console.error(`Error fetching auction for product ${productId}:`, err);
  }
};

/**
 * Publica una nueva puja y recalcula precio / winner.*/
export const placeBid = async (productId: string, bid: Bid) => {
  try {
    // 1) traemos la subasta actual
    const prodRes = await jsonServerInstance.get<Product>(
      `/products/${productId}`
    );
    const auction = prodRes.data.auction;

    // 2) ensamblamos la nueva subasta
    const updatedAuction: Auction = {
      ...auction,
      currentPrice: bid.amount,
      bids: [...auction.bids, bid],
      winnerId: bid.userId,
    };

    // 3) persistimos solo la parte necesaria
    const res = await jsonServerInstance.patch<Product>(
      `/products/${productId}`,
      { auction: updatedAuction }
    );
    return res.data.auction;
  } catch (err) {
    console.error(`Error placing bid on product ${productId}:`, err);
    throw err;
  }
};

/**
 * Cierra la subasta manualmente (ej. admin).
 */
export const closeAuction = async (productId: string) => {
  try {
    const prodRes = await jsonServerInstance.get<Product>(
      `/products/${productId}`
    );
    const now = new Date().toISOString();
    const closedAuction: Auction = {
      ...prodRes.data.auction,
      endTime: now,
    };

    const res = await jsonServerInstance.patch<Product>(
      `/products/${productId}`,
      { auction: closedAuction }
    );
    return res.data.auction;
  } catch (err) {
    console.error(`Error closing auction for product ${productId}:`, err);
    throw err;
  }
};
