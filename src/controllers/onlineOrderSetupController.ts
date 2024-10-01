import { Request, Response } from "express";
import { onlineOrderSetupService } from "@/services/onlineOrderSetupService";

export const createOnlineOrderSetup = async (req: Request, res: Response) => {
  try {
    const newOnlineOrderSetup =
      await onlineOrderSetupService.createOnlineOrderSetup(req.body);
    return res.status(201).json(newOnlineOrderSetup);
  } catch (error: any) {
    console.error("Error creating Online Order Setup:", error);
    return res.status(500).json({
      error: `Failed to create online order setup: ${error.message}`,
    });
  }
};

export const getOnlineOrderSetups = async (_req: Request, res: Response) => {
  try {
    const onlineOrderSetups =
      await onlineOrderSetupService.getOnlineOrderSetups();
    return res.status(200).json(onlineOrderSetups);
  } catch (error: any) {
    console.error("Error fetching Online Order Setups:", error);
    return res.status(500).json({
      error: `Failed to fetch online order setups: ${error.message}`,
    });
  }
};

export const getOnlineOrderSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const onlineOrderSetup = await onlineOrderSetupService.getOnlineOrderSetup(
      id
    );
    return res.status(200).json(onlineOrderSetup);
  } catch (error: any) {
    console.error("Error fetching Online Order Setup:", error);
    return res.status(500).json({
      error: `Failed to fetch online order setup: ${error.message}`,
    });
  }
};

export const updateOnlineOrderSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateOnlineOrderSetup =
      await onlineOrderSetupService.updateOnlineOrderSetup(id, req.body);
    return res.status(200).json(updateOnlineOrderSetup);
  } catch (error: any) {
    console.error("Error updating Online Order Setup:", error);
    return res.status(500).json({
      error: `Failed to update online order setup: ${error.message}`,
    });
  }
};

export const deleteOnlineOrderSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOnlineOrderSetup =
      await onlineOrderSetupService.deleteOnlineOrderSetup(id);
    return res.status(200).json(deletedOnlineOrderSetup);
  } catch (error: any) {
    console.error("Error deleting Online Order Setup:", error);
    return res.status(500).json({
      error: `Failed to delete online order setup: ${error.message}`,
    });
  }
};
