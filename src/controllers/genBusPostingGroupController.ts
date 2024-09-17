import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";

export const createGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { code, name, defVatBusPostingGroupId, autoInsertDefault } = req.body;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    //check if the code is unique
    const genBusPostingGroupCodeExists = await db.genBusPostingGroup.findUnique(
      {
        where: { code: codeUppercase },
      }
    );
    if (genBusPostingGroupCodeExists) {
      return res.status(400).json({
        error: `Gen Bus Posting Group code: ${codeUppercase} already exists`,
      });
    }

    const genBusPostingGroup = await db.genBusPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        defVatBusPostingGroupId,
        autoInsertDefault,
      },
      include: {
        vatBusPostingGroup: true,
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
    const genBusPostingGroups = await db.genBusPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vatBusPostingGroup: true,
      },
    });
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
      include: {
        vatBusPostingGroup: true,
      },
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
    const { code, name, defVatBusPostingGroupId, autoInsertDefault }: any =
      req.body;

    //check if the genBusPostingGroup exists
    const genBusPostingGroupExists = await db.genBusPostingGroup.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        defVatBusPostingGroupId: true,
        vatBusPostingGroup: true,
      },
    });

    if (!genBusPostingGroupExists) {
      return res
        .status(404)
        .json({ error: "Gen Bus Posting Group not found." });
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : genBusPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : genBusPostingGroupExists.code;

    //check for duplicate code
    if (codeUppercase && codeUppercase !== genBusPostingGroupExists.code) {
      const genBusPostingGroupCodeExists =
        await db.genBusPostingGroup.findUnique({
          where: { code: codeUppercase },
        });

      if (genBusPostingGroupCodeExists) {
        return res.status(400).json({
          error: "Gen Bus Posting Group code already exists",
        });
      }
    }

    // Perform the update
    const genBusPostingGroup = await db.genBusPostingGroup.update({
      where: { id },
      data: {
        code: codeUppercase,
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
