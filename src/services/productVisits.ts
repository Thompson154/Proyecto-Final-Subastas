import jsonServerInstance from "../api/jsonInstance";

export const getLogVisitByUserId = async (userId: string) => {
  try {
    const res = await jsonServerInstance.get(`/productVisits?owner=${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product visits:", error);
    throw error;
  }
};

export const createLogVisit = async (userId: string, productId: string) => {
  try {
    const response = await jsonServerInstance.post("/productVisits", { userId, productId });
    return response.data;
  } catch (error) {
    console.error("Error creating product visit:", error);
    throw error;
  }
};
