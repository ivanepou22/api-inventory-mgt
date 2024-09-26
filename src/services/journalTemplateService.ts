import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

export const createJournalTemplate = async (
  journalTemplate: Prisma.JournalTemplateUncheckedCreateInput
) => {
  const { name, description, type, recurring, sourceCode, reasonCode } =
    journalTemplate;

  try {
    //make name uppercase
    let nameUppercase = await slugify(name);
    nameUppercase = nameUppercase.toUpperCase();

    const journalTemplateExists = await db.journalTemplate.findUnique({
      where: {
        name: nameUppercase,
      },
    });
    if (journalTemplateExists) {
      throw new Error(
        `Journal Template with name: ${nameUppercase} already exists`
      );
    }

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
    return {
      data: newJournalTemplate,
      message: "Journal Template created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Journal Template:", error);
    throw new Error(error.message);
  }
};

export const getJournalTemplates = async () => {
  try {
    const journalTemplates = await db.journalTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        JournalBatch: true,
      },
    });
    return {
      data: journalTemplates,
      message: "Journal Templates retrieved successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const getJournalTemplate = async (id: string) => {
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
      throw new Error("Journal Template not found.");
    }
    return {
      data: journalTemplate,
      message: "Journal Template retrieved successfully",
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const updateJournalTemplate = async (
  id: string,
  journalTemplate: Prisma.JournalTemplateUncheckedCreateInput
) => {
  const { name, type, description, recurring, sourceCode, reasonCode } =
    journalTemplate;

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
      throw new Error("Journal Template not found.");
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
        throw new Error(
          `Journal Template with name: ${nameUppercase} already exists`
        );
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
    return {
      data: updatedJournalTemplate,
      message: "Journal Template updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Journal Template:", error);
    throw new Error(error.message);
  }
};

export const deleteJournalTemplate = async (id: string) => {
  try {
    // Check if the journalTemplate exists
    const journalTemplate = await db.journalTemplate.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!journalTemplate) {
      throw new Error("Journal Template not found.");
    }
    // Delete the journalTemplate
    const deletedJournalTemplate = await db.journalTemplate.delete({
      where: { id },
    });
    return {
      data: deletedJournalTemplate,
      message: `Journal Template deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Journal Template:", error);
    throw new Error(error.message);
  }
};

export const journalTemplateService = {
  createJournalTemplate,
  getJournalTemplates,
  getJournalTemplate,
  updateJournalTemplate,
  deleteJournalTemplate,
};
