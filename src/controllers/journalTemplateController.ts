import { Request, Response } from "express";
import { db } from "@/db/db";
import { JournalTemplateInput } from "@/utils/types";
import { slugify } from "@/utils/functions";

export const createJournalTemplate = async (req: Request, res: Response) => {
  const {
    name,
    description,
    type,
    recurring,
    sourceCode,
    reasonCode,
  }: JournalTemplateInput = req.body;

  //make name uppercase
  let nameUppercase = await slugify(name);
  nameUppercase = nameUppercase.toUpperCase();

  const journalTemplateExists = await db.journalTemplate.findUnique({
    where: {
      name: nameUppercase,
    },
  });
  if (journalTemplateExists) {
    return res.status(409).json({
      error: `Journal Template with name: ${nameUppercase} already exists`,
    });
  }

  try {
    const newJournalTemplate = await db.journalTemplate.create({
      data: {
        name: nameUppercase,
        description,
        type,
        recurring,
        sourceCode,
        reasonCode,
      },
    });
    return res.status(201).json({
      data: newJournalTemplate,
      message: "Journal Template created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Journal Template:", error);
    return res.status(500).json({
      error: `Error creating Journal Template: ${error.message}`,
    });
  }
};

export const getJournalTemplates = async (_req: Request, res: Response) => {
  try {
    const journalTemplates = await db.journalTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        JournalBatch: true,
      },
    });
    return res.status(200).json({
      data: journalTemplates,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later. ${err.message}`,
    });
  }
};

export const getJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const journalTemplate = await db.journalTemplate.findUnique({
      where: {
        id,
      },
      include: {
        JournalBatch: true,
      },
    });
    if (!journalTemplate) {
      return res.status(410).json({
        error: `Journal Template not found.`,
      });
    }
    return res.status(200).json({
      data: journalTemplate,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later. ${error.message}`,
    });
  }
};

export const updateJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, type, description, recurring, sourceCode, reasonCode } =
    req.body;

  try {
    const journalTemplateExists = await db.journalTemplate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        recurring: true,
      },
    });
    if (!journalTemplateExists) {
      return res.status(410).json({ error: "Journal Template not found." });
    }
    //make name uppercase
    const nameUppercase = name
      ? await slugify(name)
      : journalTemplateExists.name;
    //check if the name already exists
    if (name && nameUppercase !== journalTemplateExists.name) {
      const journalTemplateNameExists = await db.journalTemplate.findUnique({
        where: {
          name: nameUppercase,
        },
      });
      if (journalTemplateNameExists) {
        return res.status(409).json({
          error: `Journal Template with name: ${nameUppercase} already exists`,
        });
      }
    }

    // Perform the update
    const updatedJournalTemplate = await db.journalTemplate.update({
      where: { id },
      data: {
        name: nameUppercase,
        description,
        type,
        recurring,
        sourceCode,
        reasonCode,
      },
    });
    return res.status(200).json({
      data: updatedJournalTemplate,
      message: "Journal Template updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Journal Template:", error);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later. ${error.message}`,
    });
  }
};

//delete
export const deleteJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the journalTemplate exists
    const journalTemplate = await db.journalTemplate.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!journalTemplate) {
      return res.status(410).json({ error: "Journal Template not found." });
    }
    // Delete the journalTemplate
    const deletedJournalTemplate = await db.journalTemplate.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedJournalTemplate,
      message: `Journal Template deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Journal Template:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
