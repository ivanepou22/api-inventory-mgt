import { Request, Response } from "express";
import { vatProductPostingGroupService } from "@/services/vatProdPostingGroupService";

export const createVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const newVatProductPostingGroup =
      await vatProductPostingGroupService.createVatProductPostingGroup(
        req.body
      );
    return res.status(201).json(newVatProductPostingGroup);
  } catch (error: any) {
    console.error("Error creating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to create Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const getVatProductPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const vatProductPostingGroups =
      await vatProductPostingGroupService.getVatProductPostingGroups();
    return res.status(200).json(vatProductPostingGroups);
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Groups:", error);
    return res.status(500).json({
      error: `Failed to fetch Vat Product Posting Groups: ${error.message}`,
    });
  }
};

export const getVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const vatProductPostingGroup =
      await vatProductPostingGroupService.getVatProductPostingGroup(id);
    return res.status(200).json(vatProductPostingGroup);
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to fetch Vat Product Posting Group: ${error.message}`,
    });
  }
};

//getVatProductPostingGroupByCode
export const getVatProductPostingGroupByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.params;
    const vatProductPostingGroup =
      await vatProductPostingGroupService.getVatProductPostingGroupByCode(code);
    return res.status(200).json(vatProductPostingGroup);
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to fetch Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const updateVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const vatProductPostingGroup =
      await vatProductPostingGroupService.updateVatProductPostingGroup(
        id,
        req.body
      );
    return res.status(200).json(vatProductPostingGroup);
  } catch (error: any) {
    console.error("Error updating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to update Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const deleteVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedVatProductPostingGroup =
      await vatProductPostingGroupService.deleteVatProductPostingGroup(id);
    return res.status(200).json(deletedVatProductPostingGroup);
  } catch (error: any) {
    console.error("Error deleting Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to delete Vat Product Posting Group: ${error.message}`,
    });
  }
};
