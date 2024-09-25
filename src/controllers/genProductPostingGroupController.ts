import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode, slugify } from "@/utils/functions";
import { genProductPostingGroupService } from "@/services/genProductPostingGroupService";

export const createGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const newGenProductPostingGroup =
      await genProductPostingGroupService.createGenProductPostingGroup(
        req.body
      );
    return res.status(201).json(newGenProductPostingGroup);
  } catch (error: any) {
    console.error("Error creating General Product Posting Group:", error);
    return res.status(500).json({
      error: `Failed to create general product posting group: ${error.message}`,
    });
  }
};

export const getGenProductPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const genProductPostingGroups =
      await genProductPostingGroupService.getGenProductPostingGroups();
    return res.status(200).json(genProductPostingGroups);
  } catch (error: any) {
    console.error("Error fetching General Product Posting Groups:", error);
    return res.status(500).json({
      error: "Failed to fetch general product posting groups: ${error.message}",
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
        select: {
          id: true,
          code: true,
          name: true,
          defVatProductPostingGroupId: true,
          autoInsertDefault: true,
        },
      });
    if (!genProductPostingGroup) {
      throw new Error("General product posting group not found.");
    }
    return res.status(200).json({
      data: genProductPostingGroup,
      message: "General product posting group fetched successfully",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch general product posting group: ${error.message}",
    });
  }
};

export const updateGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const updateGenProductPostingGroup =
      await genProductPostingGroupService.updateGenProductPostingGroup(
        req.params.id,
        req.body
      );
    return res.status(200).json(updateGenProductPostingGroup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update general product posting group: ${error.message}`,
    });
  }
};

export const deleteGenProductPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const deletedGenProductPostingGroup =
      await genProductPostingGroupService.deleteGenProductPostingGroup(
        req.params.id
      );
    return res.status(200).json(deletedGenProductPostingGroup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to delete general product posting group: ${error.message}`,
    });
  }
};
