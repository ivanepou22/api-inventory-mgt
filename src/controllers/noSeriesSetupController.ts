import { Request, Response } from "express";
import { noSeriesSetupService } from "@/services/noSeriesSetupService";

// Create a new noSeriesSetup
export const createNoSeriesSetup = async (req: Request, res: Response) => {
  try {
    const noSeriesSetupServiceInstance = noSeriesSetupService();
    const noSeriesSetup =
      await noSeriesSetupServiceInstance.createNoSeriesSetup(req.body);
    return res.status(201).json(noSeriesSetup);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create noSeriesSetup: ${error.message}` });
  }
};

// Get all noSeriesSetups
export const getNoSeriesSetups = async (_req: Request, res: Response) => {
  try {
    const noSeriesSetupServiceInstance = noSeriesSetupService();
    const noSeriesSetups =
      await noSeriesSetupServiceInstance.getNoSeriesSetups();
    return res.status(200).json(noSeriesSetups);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get noSeriesSetups: ${error.message}` });
  }
};

// Get a single noSeriesSetup by ID
export const getNoSeriesSetup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const noSeriesSetupServiceInstance = noSeriesSetupService();
    const noSeriesSetup = await noSeriesSetupServiceInstance.getNoSeriesSetup(
      id
    );
    return res.status(200).json(noSeriesSetup);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get noSeriesSetup: ${error.message}` });
  }
};

// Update a noSeriesSetup by ID
export const updateNoSeriesSetup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const noSeriesSetupServiceInstance = noSeriesSetupService();
    const noSeriesSetup =
      await noSeriesSetupServiceInstance.updateNoSeriesSetup(id, req.body);
    return res.status(200).json(noSeriesSetup);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update noSeriesSetup: ${error.message}` });
  }
};

// Delete a noSeriesSetup by ID
export const deleteNoSeriesSetup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const noSeriesSetupServiceInstance = noSeriesSetupService();
    const noSeriesSetup =
      await noSeriesSetupServiceInstance.deleteNoSeriesSetup(id);
    return res.status(200).json(noSeriesSetup);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete noSeriesSetup: ${error.message}` });
  }
};
