import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

export const createNoSeries = async (
  noSeries: Prisma.NoSeriesUncheckedCreateInput
) => {
  const { code, description, defaultSeries, manualSeries } = noSeries;
  try {
    const codeUpperCase = await slugify(code);
    //check if the noSeries already exists
    const noSeriesExists = await db.noSeries.findUnique({
      where: { code: codeUpperCase },
    });
    if (noSeriesExists) {
      throw new Error(`No Series with code: ${code} already exists`);
    }
    const newNoSeries = await db.noSeries.create({
      data: {
        code: codeUpperCase,
        description,
        defaultSeries,
        manualSeries,
      },
    });
    return {
      data: newNoSeries,
      message: "No Series created successfully",
    };
  } catch (error: any) {
    console.error("Error creating No Series:", error);
    throw new Error(error.message);
  }
};

export const getNoSeries = async () => {
  try {
    const noSeries = await db.noSeries.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: noSeries,
      message: "No Series fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    throw new Error(error.message);
  }
};

export const getNoSeriesById = async (id: string) => {
  try {
    const noSeries = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeries) {
      throw new Error("No Series not found");
    }
    return {
      data: noSeries,
      message: "No Series fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    throw new Error(error.message);
  }
};

export const updateNoSeries = async (
  id: string,
  noSeries: Prisma.NoSeriesUncheckedCreateInput
) => {
  const { code, description, defaultSeries, manualSeries } = noSeries;
  try {
    //check if the noSeries exists
    const noSeriesExists = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeriesExists) {
      throw new Error("No Series not found");
    }

    const codeUpperCase = code ? await slugify(code) : noSeriesExists.code;
    if (code && codeUpperCase !== noSeriesExists.code) {
      const noSeriesExists = await db.noSeries.findUnique({
        where: { code: codeUpperCase },
      });
      if (noSeriesExists) {
        throw new Error(`No Series with code: ${code} already exists`);
      }
    }

    // Perform the update
    const updatedNoSeries = await db.noSeries.update({
      where: { id },
      data: {
        code: codeUpperCase,
        description,
        defaultSeries,
        manualSeries,
      },
    });
    return {
      data: updatedNoSeries,
      message: "No Series updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating No Series:", error);
    throw new Error(error.message);
  }
};

export const deleteNoSeries = async (id: string) => {
  try {
    // Check if the noSeries exists
    const noSeries = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeries) {
      throw new Error("No Series not found");
    }
    // Delete the noSeries
    const deletedNoSeries = await db.noSeries.delete({
      where: { id },
    });
    return {
      data: deletedNoSeries,
      message: `No Series deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting No Series:", error);
    throw new Error(error.message);
  }
};

export const noSeriesService = {
  createNoSeries,
  getNoSeries,
  getNoSeriesById,
  updateNoSeries,
  deleteNoSeries,
};
