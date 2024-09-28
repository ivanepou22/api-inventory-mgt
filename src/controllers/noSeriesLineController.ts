import { Request, Response } from "express";
import { noSeriesLineService } from "@/services/noSeriesLineService";

export const createNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const newNoSeriesLine = await noSeriesLineService.createNoSeriesLine(
      req.body
    );
    return res.status(201).json(newNoSeriesLine);
  } catch (error: any) {
    console.error("Error creating No Series Line:", error);
    return res
      .status(500)
      .json({ error: `Failed to create No Series Line: ${error.message}` });
  }
};

export const getNoSeriesLines = async (_req: Request, res: Response) => {
  try {
    const noSeriesLines = await noSeriesLineService.getNoSeriesLines();
    return res.status(200).json(noSeriesLines);
  } catch (error: any) {
    console.error("Error fetching No Series Lines:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch No Series Lines: ${error.message}` });
  }
};

export const getNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //get the id from the request params
    const noSeriesLine = await noSeriesLineService.getNoSeriesLine(id);
    return res.status(200).json(noSeriesLine);
  } catch (error: any) {
    console.error("Error fetching No Series Line:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch No Series Line: ${error.message}` });
  }
};

export const updateNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateNoSeriesLine = await noSeriesLineService.updateNoSeriesLine(
      id,
      req.body
    );
    return res.status(200).json(updateNoSeriesLine);
  } catch (error: any) {
    console.error("Error updating No Series Line:", error);
    return res
      .status(500)
      .json({ error: `Failed to update No Series Line: ${error.message}` });
  }
};

export const deleteNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedNoSeriesLine = await noSeriesLineService.deleteNoSeriesLine(
      id
    );
    return res.status(200).json(deletedNoSeriesLine);
  } catch (error: any) {
    console.error("Error deleting No Series Line:", error);
    return res
      .status(500)
      .json({ error: `Failed to delete No Series Line: ${error.message}` });
  }
};
