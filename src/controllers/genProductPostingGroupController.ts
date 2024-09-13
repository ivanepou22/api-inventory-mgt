import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createGeneralProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, defVatProductPostingGroupId, autoInsertDefault } = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();

    // Generate a unique code for the genProductPostingGroup
    const genProductPostingGroupCount =
      await db.generalProductPostingGroup.count();
    const code = await generateCode({
      format: "GPP",
      valueCount: genProductPostingGroupCount,
    });

    //get the vatProductPostingGroup
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id: defVatProductPostingGroupId },
    });
    if (!vatProductPostingGroup) {
      return res.status(404).json({
        error: "Vat Product Posting Group not found",
      });
    }

    const vatProductPostingGroupCode = vatProductPostingGroup.code;
    const vatProductPostingGroupName = vatProductPostingGroup.name;

    const genProductPostingGroup = await db.generalProductPostingGroup.create({
      data: {
        code,
        name: nameUppercase,
        autoInsertDefault,
        defVatProductPostingGroupId,
        vatProductPostingGroupCode,
        vatProductPostingGroupName,
      },
    });

    return res.status(201).json({
      data: genProductPostingGroup,
      message: "General Product Posting Group created successfully",
    });
  } catch (error: any) {
    console.error("Error creating General Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getGenProductPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const genProductPostingGroups =
      await db.generalProductPostingGroup.findMany();
    return res.status(200).json({
      data: genProductPostingGroups,
      message: "General Product Posting Groups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching General Product Posting Groups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching General Product Posting Groups.",
    });
  }
};

export const getGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const genProductPostingGroup =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
      });

    if (!genProductPostingGroup) {
      return res.status(404).json({
        error: "General Product Posting Group not found",
      });
    }

    return res.status(200).json({
      data: genProductPostingGroup,
      message: "General Product Posting Group fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching General Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the General Product Posting Group: ${error.message}`,
    });
  }
};

export const updateGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, defVatProductPostingGroupId, autoInsertDefault }: any =
      req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    // Check if the genProductPostingGroup exists
    const genProductPostingGroupExists =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
        select: {
          id: true,
          code: true,
          name: true,
          defVatProductPostingGroupId: true,
          autoInsertDefault: true,
          vatProductPostingGroupCode: true,
          vatProductPostingGroupName: true,
        },
      });
    if (!genProductPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "General Product Posting Group not found." });
    }

    // check if defVatProductPostingGroupId is not the same as the current defVatProductPostingGroupId
    let vatProductPostingGroupCode =
      genProductPostingGroupExists.vatProductPostingGroupCode;
    let vatProductPostingGroupName =
      genProductPostingGroupExists.vatProductPostingGroupName;
    if (
      defVatProductPostingGroupId &&
      defVatProductPostingGroupId !==
        genProductPostingGroupExists.defVatProductPostingGroupId
    ) {
      const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique(
        {
          where: { id: defVatProductPostingGroupId },
        }
      );
      if (!vatProductPostingGroup) {
        return res.status(404).json({
          error: "Vat Product Posting Group not found",
        });
      }
      vatProductPostingGroupCode = vatProductPostingGroup.code;
      vatProductPostingGroupName = vatProductPostingGroup.name;
    }

    // Perform the update
    const genProductPostingGroup = await db.generalProductPostingGroup.update({
      where: { id },
      data: {
        name: nameUppercase,
        defVatProductPostingGroupId,
        autoInsertDefault,
        vatProductPostingGroupCode,
        vatProductPostingGroupName,
      },
    });
    return res.status(200).json({
      data: genProductPostingGroup,
      message: "General Product Posting Group updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating General Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the General Product Posting Group: ${error.message}`,
    });
  }
};

export const deleteGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const genProductPostingGroup =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
      });
    if (!genProductPostingGroup) {
      return res
        .status(404)
        .json({ error: "General Product Posting Group not found." });
    }

    const genProductPostingGroupDeleted =
      await db.generalProductPostingGroup.delete({
        where: { id },
      });
    return res.status(200).json({
      data: genProductPostingGroupDeleted,
      message: "General Product Posting Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting General Product Posting Group:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the General Product Posting Group: ${error.message}`,
    });
  }
};
