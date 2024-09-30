import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const getStockHistories = async () => {
  try {
    const stockHistories = await db.stockHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: stockHistories,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting stock histories.");
  }
};

const getStockHistory = async (id: string) => {
  try {
    const stockHistory = await db.stockHistory.findUnique({
      where: {
        id,
      },
    });
    if (!stockHistory) {
      throw new Error("Stock history not found.");
    }
    return {
      data: stockHistory,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateStockHistory = async (
  id: string,
  stockHistory: Prisma.StockHistoryUncheckedUpdateInput
) => {
  const { description, open } = stockHistory;
  try {
    const stockHistoryExists = await db.stockHistory.findUnique({
      where: { id },
    });
    if (!stockHistoryExists) {
      throw new Error("Stock history not found.");
    }
    // Perform the update
    const updatedStockHistory = await db.stockHistory.update({
      where: { id },
      data: {
        description,
        open,
      },
    });
    return {
      data: updatedStockHistory,
      message: "Stock History updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteStockHistory = async (id: string) => {
  try {
    // Check if the brand exists
    const stockHistory = await db.stockHistory.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!stockHistory) {
      throw new Error("Stock history not found.");
    }
    // Delete the brand
    const deletedStockHistory = await db.stockHistory.delete({
      where: { id },
    });
    return {
      data: deletedStockHistory,
      message: `Stock History deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getStockHistoryByProductId = async (productId: string) => {
  try {
    if (!productId) {
      throw new Error("Product id is required.");
    }
    const stockHistory = await db.stockHistory.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: stockHistory,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${productId}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const stockHistoryService = {
  getStockHistories,
  getStockHistory,
  updateStockHistory,
  deleteStockHistory,
  getStockHistoryByProductId,
};
