import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createVendorPostingGroup = async (req: Request, res: Response) => {
  const { name, payableAccount } = req.body;

  //make name uppercase
  const nameUppercase = name.toUpperCase();

  // Generate a unique code for the vendor posting group
  const vendorPostingGroupCount = await db.vendorPostingGroup.count();
  const code = await generateCode({
    format: "VPG",
    valueCount: vendorPostingGroupCount,
  });
  const vendorPostingGroupExists = await db.vendorPostingGroup.findUnique({
    where: {
      code,
    },
  });
  if (vendorPostingGroupExists) {
    return res.status(409).json({
      error: `VendorPostingGroup with code: ${code} already exists`,
    });
  }
  try {
    const newVendorPostingGroup = await db.vendorPostingGroup.create({
      data: {
        code,
        name: nameUppercase,
        payableAccount,
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    return res.status(201).json({
      data: newVendorPostingGroup,
      message: "Vendor Posting Group created successfully",
    });
  } catch (error) {
    console.error("Error creating Vendor Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getVendorPostingGroups = async (_req: Request, res: Response) => {
  try {
    const vendorPostingGroups = await db.vendorPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    return res.status(200).json({
      data: vendorPostingGroups,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const vendorPostingGroup = await db.vendorPostingGroup.findUnique({
      where: {
        id,
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    if (!vendorPostingGroup) {
      return res.status(404).json({
        error: `Vendor Posting Group not found.`,
      });
    }
    return res.status(200).json({
      data: vendorPostingGroup,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, payableAccount } = req.body;
  //make name uppercase
  const nameUppercase = name.toUpperCase();

  try {
    const vendorPostingGroupExists = await db.vendorPostingGroup.findUnique({
      where: { id },
      select: { id: true, code: true, name: true, payableAccount: true },
    });
    if (!vendorPostingGroupExists) {
      return res.status(404).json({ error: "Vendor Posting Group not found." });
    }
    // Perform the update
    const updatedVendorPostingGroup = await db.vendorPostingGroup.update({
      where: { id },
      data: { name: nameUppercase, payableAccount },
    });
    return res.status(200).json({
      data: updatedVendorPostingGroup,
      message: "Vendor Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vendor Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteVendorPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the vendorPostingGroup exists
    const vendorPostingGroup = await db.vendorPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vendorPostingGroup) {
      return res.status(404).json({ error: "Vendor Posting Group not found." });
    }
    // Delete the vendorPostingGroup
    const deletedVendorPostingGroup = await db.vendorPostingGroup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedVendorPostingGroup,
      message: `Vendor Posting Group deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Vendor Posting Group:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
