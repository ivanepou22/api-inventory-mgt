import { Request, Response } from "express";
import { stockHistoryService } from "@/services/stockHistoryService";

export const getStockHistories = async (_req: Request, res: Response) => {
  try {
    const stockHistories = await stockHistoryService.getStockHistories();
    return res.status(200).json(stockHistories);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `Failed to fetch stock histories: ${error.message}`,
    });
  }
};

export const getStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const stockHistory = await stockHistoryService.getStockHistory(id);
    return res.status(200).json(stockHistory);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `Failed to fetch stock history: ${error.message}`,
    });
  }
};

export const updateStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedStockHistory = await stockHistoryService.updateStockHistory(
      id,
      req.body
    );
    return res.status(200).json(updatedStockHistory);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `Failed to update stock history: ${error.message}`,
    });
  }
};

//delete
export const deleteStockHistory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedStockHistory = await stockHistoryService.deleteStockHistory(
      id
    );
    return res.status(200).json(deletedStockHistory);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `Failed to delete stock history: ${error.message}`,
    });
  }
};
