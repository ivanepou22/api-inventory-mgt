import { Request, Response } from "express";
import { db } from "@/db/db";
import { generateCode } from "@/utils/functions";

export const createJournalBatch = async (req: Request, res: Response) => {
  const { name, description, journalTemplateId, journalTemplateType } =
    req.body;

  //make name uppercase
  const nameUppercase = name.toUpperCase();
  // Generate a unique code for the journal batch
  const journalBatchCount = await db.journalBatch.count();
  const code = await generateCode({
    format: "JB",
    valueCount: journalBatchCount,
  });

  const journalBatchExists = await db.journalBatch.findUnique({
    where: {
      code,
    },
  });
  if (journalBatchExists) {
    return res.status(409).json({
      error: `Journal Batch with code: ${code} already exists`,
    });
  }

  if (!journalTemplateId) {
    return res.status(400).json({
      error: "Journal Template ID is required.",
    });
  }

  const journalTemplate = await db.journalTemplate.findUnique({
    where: {
      id: journalTemplateId,
    },
  });

  if (!journalTemplate) {
    return res.status(404).json({
      error: "Journal Template not found.",
    });
  }

  try {
    const newJournalBatch = await db.journalBatch.create({
      data: {
        code,
        name: nameUppercase,
        description,
        journalTemplateId,
        journalTemplateCode: journalTemplate.code,
        journalTemplateName: journalTemplate.name,
        journalTemplateSourceCode: journalTemplate.sourceCode,
        journalTemplateReasonCode: journalTemplate.reasonCode,
        journalTemplateType,
      },
    });
    return res.status(201).json({
      data: newJournalBatch,
      message: "Journal Batch created successfully",
    });
  } catch (error) {
    console.error("Error creating Journal Batch:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getJournalBatches = async (_req: Request, res: Response) => {
  try {
    const journalBatches = await db.journalBatch.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: journalBatches,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const journalBatch = await db.journalBatch.findUnique({
      where: {
        id,
      },
    });
    if (!journalBatch) {
      return res.status(404).json({
        error: `Journal Batch not found.`,
      });
    }
    return res.status(200).json({
      data: journalBatch,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, description, journalTemplateId } = req.body;
  //make name uppercase
  const nameUppercase = name.toUpperCase();
  try {
    const journalBatchExists = await db.journalBatch.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        journalTemplateId: true,
        journalTemplateCode: true,
        journalTemplateName: true,
        journalTemplateSourceCode: true,
        journalTemplateReasonCode: true,
        journalTemplateType: true,
      },
    });
    if (!journalBatchExists) {
      return res.status(404).json({ error: "Journal Batch not found." });
    }

    let journalTemplateCode = journalBatchExists.journalTemplateCode;
    let journalTemplateName = journalBatchExists.journalTemplateName;
    let journalTemplateSourceCode =
      journalBatchExists.journalTemplateSourceCode;
    let journalTemplateReasonCode =
      journalBatchExists.journalTemplateReasonCode;
    let journalTemplateType = journalBatchExists.journalTemplateType;

    if (
      journalTemplateId &&
      journalTemplateId !== journalBatchExists.journalTemplateId
    ) {
      let journalTemplate = await db.journalTemplate.findUnique({
        where: {
          id: journalTemplateId,
        },
      });
      if (!journalTemplate) {
        return res.status(404).json({
          error: "Journal Template not found.",
        });
      }
      journalTemplateCode = journalTemplate.code;
      journalTemplateName = journalTemplate.name;
      journalTemplateSourceCode = journalTemplate.sourceCode;
      journalTemplateReasonCode = journalTemplate.reasonCode;
      journalTemplateType = journalTemplate.type;
    }
    // Perform the update
    const updatedJournalBatch = await db.journalBatch.update({
      where: { id },
      data: {
        name: nameUppercase,
        description,
        journalTemplateId,
        journalTemplateCode,
        journalTemplateName,
        journalTemplateSourceCode,
        journalTemplateReasonCode,
        journalTemplateType,
      },
    });
    return res.status(200).json({
      data: updatedJournalBatch,
      message: "Journal Batch updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Journal Batch:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteJournalBatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the journalBatch exists
    const journalBatch = await db.journalBatch.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!journalBatch) {
      return res.status(404).json({ error: "Journal Batch not found." });
    }
    // Delete the journalBatch
    const deletedJournalBatch = await db.journalBatch.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedJournalBatch,
      message: `Journal Batch deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Journal Batch:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
