import { Request, Response } from "express";
import { genBusPostingGroupService } from "@/services/genBusPostingGroupService";

export const createGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const newGenBusPostingGroup =
      await genBusPostingGroupService.createGenBusPostingGroup(req.body);
    return res.status(201).json(newGenBusPostingGroup);
  } catch (error: any) {
    console.error("Error creating Gen Bus Posting Group:", error);
    return res.status(500).json({
      error: `Failed to create gen bus posting group: ${error.message}`,
    });
  }
};

export const getGenBusPostingGroups = async (req: Request, res: Response) => {
  try {
    const genBusPostingGroups =
      await genBusPostingGroupService.getGenBusPostingGroups();
    return res.status(200).json(genBusPostingGroups);
  } catch (error: any) {
    console.error("Error fetching Gen Bus Posting Groups:", error);
    return res.status(500).json({
      error: `Failed to get gen bus posting groups: ${error.message}`,
    });
  }
};

export const getGenBusPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const genBusPostingGroup =
      await genBusPostingGroupService.getGenBusPostingGroup(id);
    return res.status(200).json(genBusPostingGroup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to get gen bus posting group: ${error.message}`,
    });
  }
};

export const updateGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const genBusPostingGroup =
      await genBusPostingGroupService.updateGenBusPostingGroup(
        req.params.id,
        req.body
      );
    return res.status(200).json(genBusPostingGroup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update gen bus posting group: ${error.message}`,
    });
  }
};

export const deleteGenBusPostingGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genBusPostingGroup =
      await genBusPostingGroupService.deleteGenBusPostingGroup(id);
    return res.status(200).json(genBusPostingGroup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to delete gen bus posting group: ${error.message}`,
    });
  }
};
