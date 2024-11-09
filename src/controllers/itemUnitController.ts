import { Request, Response } from "express";
import { itemUnitService } from "@/services/itemUnitService";

export const createItemUnit = async (req: Request, res: Response) => {
  try {
    const itemUnit = await itemUnitService().createItemUnit(req.body);
    return res.status(201).json(itemUnit);
  } catch (error: any) {
    console.error("Error creating ItemUnit:", error);
    return res.status(500).json({
      error: `Failed to create ItemUnit: ${error.message}`,
    });
  }
};

export const getItemUnits = async (_req: Request, res: Response) => {
  try {
    const itemUnits = await itemUnitService().getItemUnits();
    return res.status(200).json(itemUnits);
  } catch (error: any) {
    console.error("Error fetching ItemUnits:", error);
    return res.status(500).json({
      error: `Failed to fetch ItemUnits: ${error.message}`,
    });
  }
};

export const getItemUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const itemUnit = await itemUnitService().getItemUnit(id);
    return res.status(200).json(itemUnit);
  } catch (error: any) {
    console.error("Error fetching ItemUnit:", error);
    return res.status(500).json({
      error: `Failed to fetch ItemUnit: ${error.message}`,
    });
  }
};

export const updateItemUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const itemUnit = await itemUnitService().updateItemUnit(id, req.body);
    return res.status(200).json(itemUnit);
  } catch (error: any) {
    console.error("Error updating ItemUnit:", error);
    return res.status(500).json({
      error: `Failed to update ItemUnit: ${error.message}`,
    });
  }
};

// Delete item unit
export const deleteItemUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const itemUnit = await itemUnitService().deleteItemUnit(id);
    return res.status(200).json(itemUnit);
  } catch (error: any) {
    console.error("Error deleting ItemUnit:", error);
    return res.status(500).json({
      error: `Failed to delete ItemUnit: ${error.message}`,
    });
  }
};
