import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";

export const createNoSeries = async (req: Request, res: Response) => {
  try {
    const { code, description, defaultSeries, manualSeries }: any = req.body;

    const codeUpperCase = await slugify(code);
    //check if the noSeries already exists
    const noSeriesExists = await db.noSeries.findUnique({
      where: { code: codeUpperCase },
    });
    if (noSeriesExists) {
      return res.status(409).json({
        error: `No Series with code: ${code} already exists`,
      });
    }

    const noSeries = await db.noSeries.create({
      data: {
        code: codeUpperCase,
        description,
        defaultSeries,
        manualSeries,
      },
    });

    return res.status(201).json({
      data: noSeries,
      message: "No Series created successfully",
    });
  } catch (error: any) {
    console.error("Error creating No Series:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while creating the No Series.`,
    });
  }
};

export const getNoSeries = async (_req: Request, res: Response) => {
  try {
    const noSeries = await db.noSeries.findMany();
    return res.status(200).json({
      data: noSeries,
      message: "No Series fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching No Series.",
    });
  }
};

export const getNoSeriesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const noSeries = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeries) {
      return res.status(404).json({
        error: "No Series not found",
      });
    }
    return res.status(200).json({
      data: noSeries,
      message: "No Series fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the No Series.`,
    });
  }
};

export const updateNoSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, description, defaultSeries, manualSeries }: any = req.body;

    //check if the noSeries exists
    const noSeriesExists = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeriesExists) {
      return res.status(404).json({
        error: "No Series not found",
      });
    }

    const codeUpperCase = code ? await slugify(code) : noSeriesExists.code;
    if (code && codeUpperCase !== noSeriesExists.code) {
      const noSeriesExists = await db.noSeries.findUnique({
        where: { code: codeUpperCase },
      });
      if (noSeriesExists) {
        return res.status(409).json({
          error: `No Series with code: ${code} already exists`,
        });
      }
    }

    const noSeries = await db.noSeries.update({
      where: { id },
      data: {
        code: codeUpperCase,
        description,
        defaultSeries,
        manualSeries,
      },
    });
    return res.status(200).json({
      data: noSeries,
      message: "No Series updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating No Series:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the No Series.`,
    });
  }
};

export const deleteNoSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const noSeries = await db.noSeries.findUnique({
      where: { id },
    });
    if (!noSeries) {
      return res.status(404).json({ error: "No Series not found." });
    }

    const noSeriesDeleted = await db.noSeries.delete({
      where: { id },
    });
    return res.status(200).json({
      data: noSeriesDeleted,
      message: "No Series deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting No Series:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the No Series.`,
    });
  }
};
