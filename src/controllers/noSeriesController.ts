import { Request, Response } from "express";
import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { noSeriesService } from "@/services/noSeriesService";

export const createNoSeries = async (req: Request, res: Response) => {
  try {
    const newNoSeries = await noSeriesService.createNoSeries(req.body);
    return res.status(201).json(newNoSeries);
  } catch (error: any) {
    console.error("Error creating No Series:", error);
    return res.status(500).json({
      error: `Failed to create No Series: ${error.message}`,
    });
  }
};

export const getNoSeries = async (_req: Request, res: Response) => {
  try {
    const noSeries = await noSeriesService.getNoSeries();
    return res.status(200).json(noSeries);
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    return res.status(500).json({
      error: `Failed to fetch No Series: ${error.message}`,
    });
  }
};

export const getNoSeriesById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const noSeries = await noSeriesService.getNoSeriesById(id);
    return res.status(200).json(noSeries);
  } catch (error: any) {
    console.error("Error fetching No Series:", error);
    return res.status(500).json({
      error: `Failed to fetch No Series: ${error.message}`,
    });
  }
};

export const updateNoSeries = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updateNoSeries = await noSeriesService.updateNoSeries(id, req.body);
    return res.status(200).json(updateNoSeries);
  } catch (error: any) {
    console.error("Error updating No Series:", error);
    return res.status(500).json({
      error: `Failed to update No Series: ${error.message}`,
    });
  }
};

export const deleteNoSeries = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedNoSeries = await noSeriesService.deleteNoSeries(id);
    return res.status(200).json(deletedNoSeries);
  } catch (error: any) {
    console.error("Error deleting No Series:", error);
    return res.status(500).json({
      error: `Failed to delete No Series: ${error.message}`,
    });
  }
};
