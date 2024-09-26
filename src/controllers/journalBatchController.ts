import { Request, Response } from "express";
import { journalBatchService } from "@/services/journalBatchService";

export const createJournalBatch = async (req: Request, res: Response) => {
  try {
    const newJournalBatch = await journalBatchService.createJournalBatch(
      req.body
    );
    return res.status(201).json(newJournalBatch);
  } catch (error: any) {
    console.error("Error creating Journal Batch:", error);
    return res.status(500).json({
      error: `Failed to create journal batch: ${error.message}`,
    });
  }
};

export const getJournalBatches = async (_req: Request, res: Response) => {
  try {
    const journalBatches = await journalBatchService.getJournalBatches();
    return res.status(200).json(journalBatches);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to delete inventory posting setup: ${error.message}`,
    });
  }
};

export const getJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const journalBatch = await journalBatchService.getJournalBatch(id);
    return res.status(200).json(journalBatch);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get journal batch: ${error.message}`,
    });
  }
};

export const updateJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updateJournalBatch = await journalBatchService.updateJournalBatch(
      id,
      req.body
    );
    return res.status(200).json(updateJournalBatch);
  } catch (error: any) {
    console.error("Error updating Journal Batch:", error);
    return res.status(500).json({
      error: `Failed to update journal batch: ${error.message}`,
    });
  }
};

//delete
export const deleteJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedJournalBatch = await journalBatchService.deleteJournalBatch(
      id
    );
    return res.status(200).json(deletedJournalBatch);
  } catch (error: any) {
    console.error("Error deleting Journal Batch:", error);
    return res.status(500).json({
      error: `Failed to delete journal batch: ${error.message}`,
    });
  }
};
