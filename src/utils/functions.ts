import { db } from "@/db/db";

// Generate order number
export const generateOrderNumber = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Get the count of orders for today
  const todayStart = new Date(date.setHours(0, 0, 0, 0));
  const todayEnd = new Date(date.setHours(23, 59, 59, 999));
  const orderCount = await db.order.count({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  // Generate a 4-digit sequential number
  const sequence = (orderCount + 1).toString().padStart(4, "0");

  return `ORD-${year}${month}${day}-${sequence}`;
};
