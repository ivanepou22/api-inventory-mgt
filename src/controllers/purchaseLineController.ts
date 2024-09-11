import { Request, Response } from "express";
import { db } from "@/db/db";

export const getPurchaseLines = async (_req: Request, res: Response) => {
  try {
    const purchaseLines = await db.purchaseLine.findMany();
    return res.status(200).json({
      data: purchaseLines,
      message: "Purchase lines fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching purchase lines:", error);
    return res.status(500).json({
      message: "An error occurred while fetching purchase lines",
    });
  }
};

export const getPurchaseLine = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const purchaseLine = await db.purchaseLine.findUnique({
      where: { id },
    });
    if (!purchaseLine) {
      return res.status(404).json({
        message: "Purchase line not found",
      });
    }
    return res.status(200).json({
      data: purchaseLine,
      message: "Purchase line fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching purchase line:", error);
    return res.status(500).json({
      message: "An error occurred while fetching purchase line",
    });
  }
};

//delete purchase line
export const deletePurchaseLine = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const purchaseLine = await db.purchaseLine.delete({
      where: { id },
    });
    return res.status(200).json({
      data: purchaseLine,
      message: "Purchase line deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchase line:", error);
    return res.status(500).json({
      message: "An error occurred while deleting purchase line",
    });
  }
};

//update purchase line
export const updatePurchaseLine = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity, discount, tax, total } = req.body;

  const purchaseLine = await db.purchaseLine.findUnique({
    where: { id },
  });
  if (!purchaseLine) {
    return res.status(404).json({
      error: "Purchase line not found",
    });
  }

  //   try {
  //     const updatedPurchaseLine = await db.purchaseLine.update({
  //       where: { id },
  //       data: {
  //         quantity,
  //         price,
  //         discount,
  //         tax,
  //         total,
  //       },
  //     });
  //     return res.status(200).json({
  //       data: updatedPurchaseLine,
  //       message: "Purchase line updated successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error updating purchase line:", error);
  //     return res.status(500).json({
  //       error: "An error occurred while updating purchase line",
  //     });
  //   }
};
