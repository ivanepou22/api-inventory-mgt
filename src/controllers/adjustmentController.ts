import { Request, Response } from "express";
import { adjustmentService } from "@/services/adjustmentService";

export const createAdjustment = async (req: Request, res: Response) => {
  try {
    const newAdjustment = await adjustmentService.createAdjustment(req.body);
    return res.status(201).json(newAdjustment);
  } catch (error: any) {
    console.error("Error creating Adjustment:", error);
    return res.status(500).json({
      error: `Failed to create adjustment: ${error.message}`,
    });
  }
};

//get all adjustments
export const getAdjustments = async (req: Request, res: Response) => {
  try {
    const adjustments = await adjustmentService.getAdjustments();
    return res.status(200).json(adjustments);
  } catch (error: any) {
    console.error("Error fetching adjustments:", error);
    return res.status(500).json({
      error: `Failed to get adjustments: ${error.message}`,
    });
  }
};

//get adjustment
export const getAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adjustment = await adjustmentService.getAdjustment(id);
    return res.status(200).json(adjustment);
  } catch (error: any) {
    console.error("Error fetching adjustment:", error);
    return res.status(500).json({
      error: `Failed to get adjustment: ${error.message}`,
    });
  }
};

//update adjustment
export const updateAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateAdjustment = await adjustmentService.updateAdjustment(
      id,
      req.body
    );
    return res.status(200).json(updateAdjustment);
  } catch (error: any) {
    console.error("Error updating Adjustment:", error);
    return res.status(500).json({
      error: `Failed to update adjustment: ${error.message}`,
    });
  }
};

//delete adjustment
export const deleteAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAdjustment = await adjustmentService.deleteAdjustment(id);
    return res.status(200).json(deletedAdjustment);
  } catch (error: any) {
    console.error("Error deleting Adjustment:", error);
    return res.status(500).json({
      error: `Failed to delete adjustment: ${error.message}`,
    });
  }
};
