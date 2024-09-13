import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  const { name } = req.body;

  //name should be uppercase
  const nameUppercase = name.toUpperCase();

  // Generate a unique code for the inventoryPostingGroup
  const inventoryPostingGroupCount = await db.inventoryPostingGroup.count();
  const code = await generateCode({
    format: "IPG",
    valueCount: inventoryPostingGroupCount,
  });

  try {
    const inventoryPostingGroup = await db.inventoryPostingGroup.create({
      data: {
        code,
        name: nameUppercase,
      },
    });

    return res.status(201).json({
      data: inventoryPostingGroup,
      message: "Inventory Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Inventory Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getInventoryPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventoryPostingGroups = await db.inventoryPostingGroup.findMany();
    return res.status(200).json({
      data: inventoryPostingGroups,
      message: "Inventory Posting Groups fetched successfully",
    });
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
    const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
      where: { id },
    });

    if (!inventoryPostingGroup) {
      return res.status(404).json({
        error: "Inventory Posting Group not found",
      });
    }

    return res.status(200).json({
      data: inventoryPostingGroup,
      message: "Inventory Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Inventory Posting Group: ${error.message}`,
    });
  }
};

export const updateInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name }: any = req.body;
    //name should be uppercase
    const nameUppercase = name.toUpperCase();

    // Check if the inventoryPostingGroup exists
    const inventoryPostingGroupExists =
      await db.inventoryPostingGroup.findUnique({
        where: { id },
        select: { id: true, code: true, name: true },
      });
    if (!inventoryPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "Inventory Posting Group not found." });
    }
    // Perform the update
    const inventoryPostingGroup = await db.inventoryPostingGroup.update({
      where: { id },
      data: {
        name: nameUppercase,
      },
    });
    return res.status(200).json({
      data: inventoryPostingGroup,
      message: "Inventory Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Inventory Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Inventory Posting Group: ${error.message}`,
    });
  }
};

export const deleteInventoryPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
      where: { id },
    });
    if (!inventoryPostingGroup) {
      return res.status(404).json({
        error: "Inventory Posting Group not found",
      });
    }

    const inventoryPostingGroupDeleted = await db.inventoryPostingGroup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: inventoryPostingGroupDeleted,
      message: "Inventory Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Inventory Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Inventory Posting Group: ${error.message}`,
    });
  }
};
