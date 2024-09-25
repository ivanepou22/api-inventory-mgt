import { Request, Response } from "express";
import { inventoryPostingGroupService } from "@/services/inventoryPostingGroupService";

export const createInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const newInventoryPostingGroup =
      await inventoryPostingGroupService.createInventoryPostingGroup(req.body);
    return res.status(201).json(newInventoryPostingGroup);
  } catch (error: any) {
    console.error("Error creating Inventory Posting Group:", error.message);
    return res.status(500).json({
      error: `Failed to create inventory posting group: ${error.message}`,
    });
  }
};

export const getInventoryPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventoryPostingGroups =
      await inventoryPostingGroupService.getInventoryPostingGroups();
    return res.status(200).json(inventoryPostingGroups);
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Inventory Posting Groups.",
    });
  }
};

export const getInventoryPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryPostingGroup =
      await inventoryPostingGroupService.getInventoryPostingGroup(id);
    return res.status(200).json(inventoryPostingGroup);
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Group:", error.message);
    return res.status(500).json({
      error: `Failed to fetch inventory posting group: ${error.message}`,
    });
  }
};

export const updateInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const updateInventoryPostingGroup =
      await inventoryPostingGroupService.updateInventoryPostingGroup(
        req.params.id,
        req.body
      );
    return res.status(200).json(updateInventoryPostingGroup);
  } catch (error: any) {
    console.error("Error updating Inventory Posting Group:", error.message);
    return res.status(500).json({
      error: `Failed to update inventory posting group: ${error.message}`,
    });
  }
};

export const deleteInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const deletedInventoryPostingGroup =
      await inventoryPostingGroupService.deleteInventoryPostingGroup(
        req.params.id
      );
    return res.status(200).json(deletedInventoryPostingGroup);
  } catch (error: any) {
    console.error("Error deleting Inventory Posting Group:", error.message);
    return res.status(500).json({
      error: `Failed to delete inventory posting group: ${error.message}`,
    });
  }
};
