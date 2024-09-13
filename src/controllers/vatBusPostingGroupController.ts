import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createVatBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { name }: any = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();

    // Generate a unique code for the vatBusPostingGroup
    const vatBusPostingGroupCount = await db.vatBusPostingGroup.count();
    const code = await generateCode({
      format: "VBG",
      valueCount: vatBusPostingGroupCount,
    });

    const vatBusPostingGroup = await db.vatBusPostingGroup.create({
      data: {
        name: nameUppercase,
        code,
      },
    });

    return res.status(201).json({
      data: vatBusPostingGroup,
      message: "Vat Bus Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVatBusPostingGroups = async (req: Request, res: Response) => {
  try {
    const vatBusPostingGroups = await db.vatBusPostingGroup.findMany();
    return res.status(200).json({
      data: vatBusPostingGroups,
      message: "Vat Bus Posting Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Vat Bus Posting Groups.",
    });
  }
};

export const getVatBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id },
    });

    if (!vatBusPostingGroup) {
      return res.status(404).json({
        error: "Vat Bus Posting Group not found",
      });
    }

    return res.status(200).json({
      data: vatBusPostingGroup,
      message: "Vat Bus Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Vat Bus Posting Group: ${error.message}`,
    });
  }
};

export const updateVatBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name }: any = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    // Perform the update
    const vatBusPostingGroup = await db.vatBusPostingGroup.update({
      where: { id },
      data: {
        name: nameUppercase,
      },
    });
    return res.status(200).json({
      data: vatBusPostingGroup,
      message: "Vat Bus Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Vat Bus Posting Group: ${error.message}`,
    });
  }
};

export const deleteVatBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id },
    });
    if (!vatBusPostingGroup) {
      return res
        .status(404)
        .json({ error: "Vat Bus Posting Group not found." });
    }

    const vatBusPostingGroupDeleted = await db.vatBusPostingGroup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: vatBusPostingGroupDeleted,
      message: "Vat Bus Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Vat Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Vat Bus Posting Group: ${error.message}`,
    });
  }
};
