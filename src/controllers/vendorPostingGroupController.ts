import { Request, Response } from "express";
import { vendorPostingGroupService } from "@/services/vendorPostingGroupService";

export const createVendorPostingGroup = async (req: Request, res: Response) => {
  try {
    const newVendorPostingGroup =
      await vendorPostingGroupService.createVendorPostingGroup(req.body);
    return res.status(201).json(newVendorPostingGroup);
  } catch (error: any) {
    console.error("Error creating Vendor Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVendorPostingGroups = async (_req: Request, res: Response) => {
  try {
    const vendorPostingGroups =
      await vendorPostingGroupService.getVendorPostingGroups();
    return res.status(200).json(vendorPostingGroups);
  } catch (error: any) {
    console.error("Error fetching Vendor Posting Groups:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const vendorPostingGroup =
      await vendorPostingGroupService.getVendorPostingGroup(id);
    return res.status(200).json(vendorPostingGroup);
  } catch (error: any) {
    console.error("Error fetching Vendor Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const updateVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedVendorPostingGroup =
      await vendorPostingGroupService.updateVendorPostingGroup(id, req.body);
    return res.status(200).json(updatedVendorPostingGroup);
  } catch (error: any) {
    console.error("Error updating Vendor Posting Group:", error.message);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

//delete
export const deleteVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedVendorPostingGroup =
      await vendorPostingGroupService.deleteVendorPostingGroup(id);
    return res.status(200).json(deletedVendorPostingGroup);
  } catch (error: any) {
    console.error("Error deleting Vendor Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};
