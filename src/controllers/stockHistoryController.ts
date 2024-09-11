import { Request, Response } from "express";
import { db } from "@/db/db";

export const getStockHistories = async (_req: Request, res: Response) => {
  try {
    const stockHistories = await db.stockHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: stockHistories,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const stockHistory = await db.stockHistory.findUnique({
      where: {
        id,
      },
    });
    if (!stockHistory) {
      return res.status(404).json({
        data: null,
        error: `Stock History not found.`,
      });
    }
    return res.status(200).json({
      data: stockHistory,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    description,
    productId,
    productName,
    unitName,
    unitAbbreviation,
    open,
  } = req.body;
  try {
    const stockHistoryExists = await db.stockHistory.findUnique({
      where: { id },
    });
    if (!stockHistoryExists) {
      return res.status(404).json({ error: "Stock History not found." });
    }
    // Perform the update
    const updatedStockHistory = await db.stockHistory.update({
      where: { id },
      data: {
        description,
        productId,
        productName,
        unitName,
        unitAbbreviation,
        open,
      },
    });
    return res.status(200).json({
      data: updatedStockHistory,
      message: "Stock History updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Stock History:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the brand exists
    const stockHistory = await db.stockHistory.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!stockHistory) {
      return res.status(404).json({ error: "Stock History not found." });
    }
    // Delete the brand
    const deletedStockHistory = await db.stockHistory.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedStockHistory,
      message: `Stock History deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Stock History:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
