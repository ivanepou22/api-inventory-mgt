import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";

export const createNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const {
      noSeriesId,
      startingDate,
      endingDate,
      startingNo,
      endingNo,
      lastDateUsed,
      lastNoUsed,
      lastDigitUsed,
      increment,
    }: any = req.body;

    //get the noSeries
    const noSeries = await db.noSeries.findUnique({
      where: { id: noSeriesId },
    });
    if (!noSeries) {
      return res.status(404).json({
        error: "No Series not found",
      });
    }
    const noSeriesCode = noSeries.code;

    //the start date should always be less than the ending date and the ending date should be greater than the starting date
    if (startingDate > endingDate) {
      return res.status(400).json({
        error: "The starting date should be less than the ending date.",
      });
    }
    if (endingDate < startingDate) {
      return res.status(400).json({
        error: "The ending date should be greater than the starting date.",
      });
    }

    const noSeriesLine = await db.noSeriesLine.create({
      data: {
        noSeriesId,
        noSeriesCode,
        startingDate,
        endingDate,
        startingNo,
        endingNo,
        lastDateUsed,
        lastNoUsed,
        lastDigitUsed,
        increment,
      },
    });

    return res.status(201).json({
      data: noSeriesLine,
      message: "No Series Line created successfully",
    });
  } catch (error: any) {
    console.error("Error creating No Series Line:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while creating the No Series Line.`,
    });
  }
};

export const getNoSeriesLines = async (_req: Request, res: Response) => {
  try {
    const noSeriesLines = await db.noSeriesLine.findMany();
    return res.status(200).json({
      data: noSeriesLines,
      message: "No Series Lines fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching No Series Lines:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching No Series Lines.",
    });
  }
};

export const getNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const noSeriesLine = await db.noSeriesLine.findUnique({
      where: { id },
    });

    if (!noSeriesLine) {
      return res.status(404).json({
        error: "No Series Line not found",
      });
    }

    return res.status(200).json({
      data: noSeriesLine,
      message: "No Series Line fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching No Series Line:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the No Series Line.`,
    });
  }
};

export const updateNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      startingDate,
      endingDate,
      startingNo,
      endingNo,
      lastDateUsed,
      lastNoUsed,
      lastDigitUsed,
      increment,
    }: any = req.body;

    //check if the noSeriesLine exists
    const noSeriesLineExists = await db.noSeriesLine.findUnique({
      where: { id },
    });
    if (!noSeriesLineExists) {
      return res.status(404).json({
        error: "No Series Line not found",
      });
    }

    if (startingDate || endingDate) {
      if (startingDate > endingDate) {
        return res.status(400).json({
          error: "The starting date should be less than the ending date.",
        });
      }
      if (endingDate < startingDate) {
        return res.status(400).json({
          error: "The ending date should be greater than the starting date.",
        });
      }
    }

    const noSeriesLine = await db.noSeriesLine.update({
      where: { id },
      data: {
        startingDate,
        endingDate,
        startingNo,
        endingNo,
        lastDateUsed,
        lastNoUsed,
        lastDigitUsed,
        increment,
      },
    });
    return res.status(200).json({
      data: noSeriesLine,
      message: "No Series Line updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating No Series Line:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the No Series Line.`,
    });
  }
};

export const deleteNoSeriesLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const noSeriesLine = await db.noSeriesLine.findUnique({
      where: { id },
    });
    if (!noSeriesLine) {
      return res.status(404).json({ error: "No Series Line not found." });
    }

    const noSeriesLineDeleted = await db.noSeriesLine.delete({
      where: { id },
    });
    return res.status(200).json({
      data: noSeriesLineDeleted,
      message: "No Series Line deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting No Series Line:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the No Series Line.`,
    });
  }
};
