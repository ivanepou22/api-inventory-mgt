import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

export const createJournalBatch = async (
  journalBatch: Prisma.JournalBatchUncheckedCreateInput
) => {
  const { name, description, journalTemplateId, noSeriesId } = journalBatch;
  try {
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
      throw new Error(
        `Journal Batch with name: ${nameUppercase} and template ID: ${journalBatchExists.journalTemplate.name} already exists`
      );
    }

    const journalTemplate = await db.journalTemplate.findUnique({
      where: {
        id: journalTemplateId,
      },
    });

    if (!journalTemplate) {
      throw new Error("Journal Template not found.");
    }
    //check if the noSeries exists
    if (noSeriesId) {
      const noSeries = await db.noSeries.findUnique({
        where: {
          id: noSeriesId,
        },
      });

      if (!noSeries) {
        throw new Error("No Series not found.");
      }
    }

    const newJournalBatch = await db.journalBatch.create({
      data: {
        name: nameUppercase,
        description,
        journalTemplateId,
        noSeriesId,
      },
    });
    return {
      data: newJournalBatch,
      message: "Journal Batch created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Journal Batch:", error);
    throw new Error(error.message);
  }
};

export const getJournalBatches = async () => {
  try {
    const journalBatches = await db.journalBatch.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        journalTemplate: true,
      },
    });
    return {
      data: journalBatches,
      message: "Journal Batches retrieved successfully",
    };
  } catch (error: any) {
    console.error("Error getting Journal Batches:", error);
    throw new Error(error.message);
  }
};

export const getJournalBatch = async (id: string) => {
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
      throw new Error("Journal Batch not found.");
    }
    return {
      data: journalBatch,
      message: "Journal Batch retrieved successfully",
    };
  } catch (error: any) {
    console.error("Error getting Journal Batch:", error);
    throw new Error(error.message);
  }
};

export const updateJournalBatch = async (
  id: string,
  journalBatch: Prisma.JournalBatchUncheckedCreateInput
) => {
  const { name, description, journalTemplateId, noSeriesId } = journalBatch;
  try {
    const journalBatchExists = await db.journalBatch.findUnique({
      where: { id },
      include: {
        journalTemplate: true,
      },
    });
    if (!journalBatchExists) {
      throw new Error("Journal Batch not found.");
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
        throw new Error("Journal Template not found.");
      }
    }

    if (
      noSeriesId &&
      noSeriesId !== journalBatchExists.noSeriesId &&
      journalBatchExists.noSeriesId
    ) {
      let noSeries = await db.noSeries.findUnique({
        where: {
          id: noSeriesId,
        },
      });
      if (!noSeries) {
        throw new Error("No Series not found.");
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
        throw new Error(
          `Journal Batch with code: ${journalBatchNameExists} already exists`
        );
      }
    }
    // Perform the update
    const updatedJournalBatch = await db.journalBatch.update({
      where: { id },
      data: {
        name: nameUppercase,
        description,
        journalTemplateId,
        noSeriesId,
      },
    });
    return {
      data: updatedJournalBatch,
      message: "Journal Batch updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Journal Batch:", error);
    throw new Error(error.message);
  }
};

export const deleteJournalBatch = async (id: string) => {
  try {
    // Check if the journalBatch exists
    const journalBatch = await db.journalBatch.findUnique({
      where: { id },
      include: {
        journalTemplate: true,
      },
    });
    if (!journalBatch) {
      throw new Error("Journal Batch not found.");
    }
    // Delete the journalBatch
    const deletedJournalBatch = await db.journalBatch.delete({
      where: { id },
    });
    return {
      data: deletedJournalBatch,
      message: `Journal Batch deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Journal Batch:", error);
    throw new Error(error.message);
  }
};

export const journalBatchService = {
  createJournalBatch,
  getJournalBatches,
  getJournalBatch,
  updateJournalBatch,
  deleteJournalBatch,
};
