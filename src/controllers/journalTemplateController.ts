import { Request, Response } from "express";
import { journalTemplateService } from "@/services/journalTemplateService";

export const createJournalTemplate = async (req: Request, res: Response) => {
  try {
    const newJournalTemplate =
      await journalTemplateService.createJournalTemplate(req.body);
    return res.status(201).json(newJournalTemplate);
  } catch (error: any) {
    console.error("Error creating Journal Template:", error);
    return res.status(500).json({
      error: `Failed to create journal template: ${error.message}`,
    });
  }
};

export const getJournalTemplates = async (_req: Request, res: Response) => {
  try {
    const journalTemplates = await journalTemplateService.getJournalTemplates();
    return res.status(200).json(journalTemplates);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: `Failed to get journal templates: ${error.message}`,
    });
  }
};

export const getJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const journalTemplate = await journalTemplateService.getJournalTemplate(id);
    return res.status(200).json(journalTemplate);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `Failed to get journal template: ${error.message}`,
    });
  }
};

export const updateJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updateJournalTemplate =
      await journalTemplateService.updateJournalTemplate(id, req.body);
    return res.status(200).json(updateJournalTemplate);
  } catch (error: any) {
    console.error("Error updating Journal Template:", error);
    return res.status(500).json({
      error: `Failed to update journal template: ${error.message}`,
    });
  }
};

//delete
export const deleteJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedJournalTemplate =
      await journalTemplateService.deleteJournalTemplate(id);
    return res.status(200).json(deletedJournalTemplate);
  } catch (error: any) {
    console.error("Error deleting Journal Template:", error);
    return res.status(500).json({
      error: `Failed to delete journal template: ${error.message}`,
    });
  }
};
