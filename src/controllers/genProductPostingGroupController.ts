import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode, slugify } from "@/utils/functions";

export const createGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const { code, name, defVatProductPostingGroupId, autoInsertDefault } =
      req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    //check if the code is unique
    const genProductPostingGroupCodeExists =
      await db.generalProductPostingGroup.findUnique({
        where: { code: codeUppercase },
      });
    if (genProductPostingGroupCodeExists) {
      return res.status(400).json({
        error: `General Product Posting Group code: ${codeUppercase} already exists`,
      });
    }

    const genProductPostingGroup = await db.generalProductPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        autoInsertDefault,
        defVatProductPostingGroupId,
      },
      include: {
        vatProductPostingGroup: true,
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
      await db.generalProductPostingGroup.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          vatProductPostingGroup: true,
        },
      });
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
        include: {
          vatProductPostingGroup: true,
        },
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
    const { code, name, defVatProductPostingGroupId, autoInsertDefault }: any =
      req.body;

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
        },
      });
    if (!genProductPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "General Product Posting Group not found." });
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : genProductPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : genProductPostingGroupExists.code;

    // Perform the update
    const genProductPostingGroup = await db.generalProductPostingGroup.update({
      where: { id },
      data: {
        code: codeUppercase,
        name: nameUppercase,
        defVatProductPostingGroupId,
        autoInsertDefault,
      },
      include: {
        vatProductPostingGroup: true,
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
