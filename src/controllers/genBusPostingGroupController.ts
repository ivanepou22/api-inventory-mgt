import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { name, defVatBusPostingGroupId, autoInsertDefault } = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();

    // Generate a unique code for the genBusPostingGroup
    const genBusPostingGroupCount = await db.genBusPostingGroup.count();
    const code = await generateCode({
      format: "GBP",
      valueCount: genBusPostingGroupCount,
    });

    //get the vatBusPostingGroup
    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id: defVatBusPostingGroupId },
    });
    if (!vatBusPostingGroup) {
      return res.status(404).json({
        error: "Vat Bus Posting Group not found",
      });
    }

    //get the vatBusPostingGroup
    const vatBusPostingGroupCode = vatBusPostingGroup.code;
    const vatBusPostingGroupName = vatBusPostingGroup.name;

    const genBusPostingGroup = await db.genBusPostingGroup.create({
      data: {
        code,
        name: nameUppercase,
        defVatBusPostingGroupId,
        autoInsertDefault,
        vatBusPostingGroupCode,
        vatBusPostingGroupName,
      },
    });

    return res.status(201).json({
      data: genBusPostingGroup,
      message: "Gen Bus Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Gen Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getGenBusPostingGroups = async (req: Request, res: Response) => {
  try {
    const genBusPostingGroups = await db.genBusPostingGroup.findMany();
    return res.status(200).json({
      data: genBusPostingGroups,
      message: "Gen Bus Posting Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Gen Bus Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Gen Bus Posting Groups.",
    });
  }
};

export const getGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
      where: { id },
    });

    if (!genBusPostingGroup) {
      return res.status(404).json({
        error: "Gen Bus Posting Group not found",
      });
    }

    return res.status(200).json({
      data: genBusPostingGroup,
      message: "Gen Bus Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Gen Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Gen Bus Posting Group: ${error.message}`,
    });
  }
};

export const updateGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, defVatBusPostingGroupId, autoInsertDefault }: any = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    // Check if the genBusPostingGroup exists
    const genBusPostingGroupExists = await db.genBusPostingGroup.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        defVatBusPostingGroupId: true,
      },
    });
    if (!genBusPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "Gen Bus Posting Group not found." });
    }

    // check if defVatBusPostingGroupId is not the same as the current defVatBusPostingGroupId
    let vatBusPostingGroupCode;
    let vatBusPostingGroupName;
    if (
      defVatBusPostingGroupId &&
      defVatBusPostingGroupId !==
        genBusPostingGroupExists.defVatBusPostingGroupId
    ) {
      const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
        where: { id: defVatBusPostingGroupId },
      });
      if (!vatBusPostingGroup) {
        return res.status(404).json({
          error: "Vat Bus Posting Group not found",
        });
      }
      vatBusPostingGroupCode = vatBusPostingGroup.code;
      vatBusPostingGroupName = vatBusPostingGroup.name;
    }

    // Perform the update
    const genBusPostingGroup = await db.genBusPostingGroup.update({
      where: { id },
      data: {
        name: nameUppercase,
        defVatBusPostingGroupId,
        autoInsertDefault,
      },
    });
    return res.status(200).json({
      data: genBusPostingGroup,
      message: "Gen Bus Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Gen Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Gen Bus Posting Group: ${error.message}`,
    });
  }
};

export const deleteGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
      where: { id },
    });
    if (!genBusPostingGroup) {
      return res
        .status(404)
        .json({ error: "Gen Bus Posting Group not found." });
    }

    const genBusPostingGroupDeleted = await db.genBusPostingGroup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: genBusPostingGroupDeleted,
      message: "Gen Bus Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Gen Bus Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Gen Bus Posting Group: ${error.message}`,
    });
  }
};
