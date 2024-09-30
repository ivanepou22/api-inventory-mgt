import { Request, Response } from "express";
import { vatBusPostingGroupService } from "@/services/vatBusPostingGroupService";

export const createVatBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const newVatBusPostingGroup =
      await vatBusPostingGroupService.createVatBusPostingGroup(req.body);
    return res.status(201).json(newVatBusPostingGroup);
  } catch (error: any) {
    console.error("Error creating Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `Failed to create Vat Bus Posting Group: ${error.message}`,
    });
  }
};

export const getVatBusPostingGroups = async (_req: Request, res: Response) => {
  try {
    const vatBusPostingGroups =
      await vatBusPostingGroupService.getVatBusPostingGroups();
    return res.status(200).json(vatBusPostingGroups);
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Groups:", error);
    return res.status(500).json({
      error: `Failed to fetch Vat Bus Posting Groups: ${error.message}`,
    });
  }
};

export const getVatBusPostingGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vatBusPostingGroup =
      await vatBusPostingGroupService.getVatBusPostingGroup(id);
    return res.status(200).json(vatBusPostingGroup);
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `Failed to fetch Vat Bus Posting Group: ${error.message}`,
    });
  }
};

export const updateVatBusPostingGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedVatBusPostingGroup =
      await vatBusPostingGroupService.updateVatBusPostingGroup(id, req.body);
    return res.status(200).json(updatedVatBusPostingGroup);
  } catch (error: any) {
    console.error("Error updating Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `Failed to update Vat Bus Posting Group: ${error.message}`,
    });
  }
};

export const deleteVatBusPostingGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedVatBusPostingGroup =
      await vatBusPostingGroupService.deleteVatBusPostingGroup(id);
    return res.status(200).json(deletedVatBusPostingGroup);
  } catch (error: any) {
    console.error("Error deleting Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `Failed to delete Vat Bus Posting Group: ${error.message}`,
    });
  }
};
