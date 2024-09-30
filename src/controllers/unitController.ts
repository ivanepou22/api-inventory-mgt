import { unitService } from "@/services/unitService";
import { Request, Response } from "express";

export const createUnit = async (req: Request, res: Response) => {
  try {
    const unit = await unitService.createUnit(req.body);
    return res.status(201).json(unit);
  } catch (error: any) {
    console.error("Error creating Unit:", error);
    return res.status(500).json({
      error: `Failed to create Unit: ${error.message}`,
    });
  }
};

export const getUnits = async (_req: Request, res: Response) => {
  try {
    const units = await unitService.getUnits();
    return res.status(200).json(units);
  } catch (error: any) {
    console.error("Error fetching Units:", error);
    return res.status(500).json({
      error: `Failed to fetch Units: ${error.message}`,
    });
  }
};

export const getUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const unit = await unitService.getUnit(id);
    return res.status(200).json(unit);
  } catch (error: any) {
    console.error("Error fetching Unit:", error);
    return res.status(500).json({
      error: `Failed to fetch Unit: ${error.message}`,
    });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const unit = await unitService.updateUnit(id, req.body);
    return res.status(200).json(unit);
  } catch (error: any) {
    console.error("Error updating Unit:", error);
    return res.status(500).json({
      error: `Failed to update Unit: ${error.message}`,
    });
  }
};

// Delete unit
export const deleteUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const unit = await unitService.deleteUnit(id);
    return res.status(200).json(unit);
  } catch (error: any) {
    console.error("Error deleting Unit:", error);
    return res.status(500).json({
      error: `Failed to delete Unit: ${error.message}`,
    });
  }
};
