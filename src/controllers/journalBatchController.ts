import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";

export const createJournalBatch = async (req: Request, res: Response) => {
  const { name, description, journalTemplateId, noSeriesId } = req.body;

  //make name uppercase
  let nameUppercase = await slugify(name);
  nameUppercase = nameUppercase.toUpperCase();

  const journalBatchExists = await db.journalBatch.findUnique({
    where: {
      name_journalTemplateId: {
        name: nameUppercase,
        journalTemplateId: journalTemplateId,
      },
    },
    include: {
      journalTemplate: true,
    },
  });

  if (journalBatchExists) {
    return res.status(409).json({
      error: `Journal Batch with name: ${nameUppercase} and template ID: ${journalBatchExists.journalTemplate.name} already exists`,
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
  //check if the noSeries exists
  if (noSeriesId) {
    const noSeries = await db.noSeries.findUnique({
      where: {
        id: noSeriesId,
      },
    });

    if (!noSeries) {
      return res.status(404).json({
        error: "No Series not found.",
      });
    }
  }

  try {
    const newJournalBatch = await db.journalBatch.create({
      data: {
        name: nameUppercase,
        description,
        journalTemplateId,
        noSeriesId,
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
      include: {
        journalTemplate: true,
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
      include: {
        journalTemplate: true,
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

  try {
    const journalBatchExists = await db.journalBatch.findUnique({
      where: { id },
      include: {
        journalTemplate: true,
      },
    });
    if (!journalBatchExists) {
      return res.status(404).json({ error: "Journal Batch not found." });
    }

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
    }

    //make name uppercase
    let nameUppercase = await slugify(name);
    nameUppercase = name.toUpperCase();
    //check if the name already exists
    if (nameUppercase && nameUppercase !== journalBatchExists.name) {
      const journalBatchNameExists = await db.journalBatch.findUnique({
        where: {
          name_journalTemplateId: {
            name: nameUppercase,
            journalTemplateId:
              journalTemplateId || journalBatchExists.journalTemplateId,
          },
        },
      });
      if (journalBatchNameExists) {
        return res.status(409).json({
          error: `Journal Batch with code: ${journalBatchNameExists} already exists`,
        });
      }
    }
    // Perform the update
    const updatedJournalBatch = await db.journalBatch.update({
      where: { id },
      data: {
        name: nameUppercase,
        description,
        journalTemplateId,
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
      include: {
        journalTemplate: true,
      },
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
