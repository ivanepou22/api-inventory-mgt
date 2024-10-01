import { Request, Response } from "express";
import { vatPostingSetupService } from "@/services/vatPostingSetupService";

export const createVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const vatPostingSetup = await vatPostingSetupService.createVatPostingSetup(
      req.body
    );
    res.status(201).json(vatPostingSetup);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: `Failed to create vat posting setup: ${error.message}` });
  }
};

export const getVatPostingSetups = async (_req: Request, res: Response) => {
  try {
    const vatPostingSetups = await vatPostingSetupService.getVatPostingSetups();
    return res.status(200).json(vatPostingSetups);
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setups:", error.message);
    res
      .status(500)
      .json({ error: `Failed to fetch vat posting setups: ${error.message}` });
  }
};

export const getVatPostingSetup = async (req: Request, res: Response) => {
  const { id } = req.params; // get the id from the request params
  try {
    const vatPostingSetup = await vatPostingSetupService.getVatPostingSetup(id);
    return res.status(200).json(vatPostingSetup);
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setup:", error.message);
    res
      .status(500)
      .json({ error: `Failed to fetch vat posting setup: ${error.message}` });
  }
};

export const updateVatPostingSetup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vatPostingSetup = await vatPostingSetupService.updateVatPostingSetup(
      id,
      req.body
    );
    return res.status(200).json(vatPostingSetup);
  } catch (error: any) {
    console.error("Error updating Vat Posting Setup:", error.message);
    res
      .status(500)
      .json({ error: `Failed to update vat posting setup: ${error.message}` });
  }
};

export const deleteVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedVatPostingSetup =
      await vatPostingSetupService.deleteVatPostingSetup(id);
    return res.status(200).json(deletedVatPostingSetup);
  } catch (error: any) {
    console.error("Error deleting Vat Posting Setup:", error.message);
    res
      .status(500)
      .json({ error: `Failed to delete vat posting setup: ${error.message}` });
  }
};
