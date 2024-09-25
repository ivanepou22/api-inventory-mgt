import { Request, Response } from "express";
import { genPostingSetupService } from "@/services/genPostingSetupService";

export const createGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const newGenPostingSetup =
      await genPostingSetupService.createGenPostingSetup(req.body);
    return res.status(201).json(newGenPostingSetup);
  } catch (error: any) {
    console.error("Error creating Gen Posting Setup:", error);
    return res.status(500).json({
      error: `Failed to create gen posting setup: ${error.message}`,
    });
  }
};

export const getGenPostingSetups = async (_req: Request, res: Response) => {
  try {
    const genPostingSetups = await genPostingSetupService.getGenPostingSetups();
    return res.status(200).json(genPostingSetups);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get gen posting setups: ${error.message}`,
    });
  }
};

export const getGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const genPostingSetup = await genPostingSetupService.getGenPostingSetup(
      req.params.id
    );
    return res.status(200).json(genPostingSetup);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get gen posting setup: ${error.message}`,
    });
  }
};

export const updateGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const genPostingSetup = await genPostingSetupService.updateGenPostingSetup(
      req.params.id,
      req.body
    );
    return res.status(200).json(genPostingSetup);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update gen posting setup: ${error.message}`,
    });
  }
};

export const deleteGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const genPostingSetup = await genPostingSetupService.deleteGenPostingSetup(
      req.params.id
    );
    return res.status(200).json(genPostingSetup);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      error: `Failed to delete gen posting setup: ${error.message}`,
    });
  }
};
