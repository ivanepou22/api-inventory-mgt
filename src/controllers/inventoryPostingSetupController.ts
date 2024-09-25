import { Request, Response } from "express";
import { inventoryPostingSetupService } from "@/services/inventoryPostingSetupService";

export const createInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const newInventoryPostingSetup =
      await inventoryPostingSetupService.createInventoryPostingSetup(req.body);
    return res.status(201).json(newInventoryPostingSetup);
  } catch (error: any) {
    console.error("Error creating Inventory Posting Setup:", error);
    return res.status(500).json({
      error: `Failed to create inventory posting setup: ${error.message}`,
    });
  }
};

export const getInventoryPostingSetups = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventoryPostingSetups =
      await inventoryPostingSetupService.getInventoryPostingSetups();
    return res.status(200).json(inventoryPostingSetups);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get inventory posting setups: ${error.message}`,
    });
  }
};

export const getInventoryPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryPostingSetup =
      await inventoryPostingSetupService.getInventoryPostingSetup(id);
    return res.status(200).json(inventoryPostingSetup);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get inventory posting setup: ${error.message}`,
    });
  }
};

export const updateInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const updateInventoryPostingSetup =
      await inventoryPostingSetupService.updateInventoryPostingSetup(
        req.params.id,
        req.body
      );
    return res.status(200).json(updateInventoryPostingSetup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update inventory posting setup: ${error.message}`,
    });
  }
};

export const deleteInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const deletedInventoryPostingSetup =
      await inventoryPostingSetupService.deleteInventoryPostingSetup(
        req.params.id
      );
    return res.status(200).json(deletedInventoryPostingSetup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to delete inventory posting setup: ${error.message}`,
    });
  }
};
