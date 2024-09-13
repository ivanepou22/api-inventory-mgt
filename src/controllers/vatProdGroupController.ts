import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  const { name } = req.body;

  //name should be uppercase
  const nameUppercase = name.toUpperCase();

  // Generate a unique code for the vatProductPostingGroup
  const vatProductPostingGroupCount = await db.vatProductPostingGroup.count();
  const code = await generateCode({
    format: "VPG",
    valueCount: vatProductPostingGroupCount,
  });

  try {
    const vatProductPostingGroup = await db.vatProductPostingGroup.create({
      data: {
        name: nameUppercase,
        code,
      },
    });

    return res.status(201).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVatProductPostingGroups = async (
  req: Request,
  res: Response
) => {
  try {
    const vatProductPostingGroups = await db.vatProductPostingGroup.findMany();
    return res.status(200).json({
      data: vatProductPostingGroups,
      message: "Vat Product Posting Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Vat Product Posting Groups.",
    });
  }
};

export const getVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
    });

    if (!vatProductPostingGroup) {
      return res.status(404).json({
        error: "Vat Product Posting Group not found",
      });
    }

    return res.status(200).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const updateVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name }: any = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    // Perform the update
    const vatProductPostingGroup = await db.vatProductPostingGroup.update({
      where: { id },
      data: { name: nameUppercase },
    });
    return res.status(200).json({
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Vat Product Posting Group: ${error.message}`,
    });
  }
};

export const deleteVatProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
    });
    if (!vatProductPostingGroup) {
      return res
        .status(404)
        .json({ error: "Vat Product Posting Group not found." });
    }

    const vatProductPostingGroupDeleted =
      await db.vatProductPostingGroup.delete({
        where: { id },
      });
    return res.status(200).json({
      data: vatProductPostingGroupDeleted,
      message: "Vat Product Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Vat Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Vat Product Posting Group: ${error.message}`,
    });
  }
};
