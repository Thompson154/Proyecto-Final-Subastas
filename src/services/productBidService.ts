import jsonServerInstance from "../api/jsonInstance";

export const logBid = async (userId: string, productId: string, bid: any) =>
  jsonServerInstance.post("/productBids", {
    userId, productId, bidId: bid.timestamp, timestamp: bid.timestamp
  });