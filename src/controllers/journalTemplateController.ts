import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode, incrementCode } from "@/utils/functions";
import { JournalTemplateInput } from "@/utils/types";

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
  const nameUppercase = name.toUpperCase();
  // Generate a unique code for the journal template
  const journalTemplateCount = await db.journalTemplate.count();

  //find the last journal template code
  const lastJournalTemplateCode = await db.journalTemplate.findFirst({
    orderBy: {
      code: "desc",
    },
    select: {
      code: true,
    },
  });

  //if there is no last journal template code, generate a new code
  let code;
  if (!lastJournalTemplateCode) {
    code = await generateCode({
      format: "JT",
      valueCount: journalTemplateCount,
    });
  } else {
    //if there is a last journal template code, increment it by 1
    code = await incrementCode(lastJournalTemplateCode.code);
  }

  const journalTemplateExists = await db.journalTemplate.findUnique({
    where: {
      code,
    },
  });
  if (journalTemplateExists) {
    return res.status(409).json({
      error: `Journal Template with code: ${code} already exists`,
    });
  }

  try {
    const newJournalTemplate = await db.journalTemplate.create({
      data: {
        code,
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
  } catch (error) {
    console.error("Error creating Journal Template:", error);
    return res.status(500).json({
      error: `Error creating Journal Template: ${error}`,
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
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
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
      return res.status(404).json({
        error: `Journal Template not found.`,
      });
    }
    return res.status(200).json({
      data: journalTemplate,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateJournalTemplate = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { type, description, recurring, sourceCode, reasonCode } = req.body;

  try {
    const journalTemplateExists = await db.journalTemplate.findUnique({
      where: { id },
      select: { id: true, code: true, name: true, type: true, recurring: true },
    });
    if (!journalTemplateExists) {
      return res.status(404).json({ error: "Journal Template not found." });
    }
    // Perform the update
    const updatedJournalTemplate = await db.journalTemplate.update({
      where: { id },
      data: {
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
      error: "An unexpected error occurred. Please try again later.",
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
      return res.status(404).json({ error: "Journal Template not found." });
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
