import { Request, Response } from "express";
import { db } from "@/db/db";
import { brandService } from "@/services/brandService";

export const createBrand = async (req: Request, res: Response) => {
  //call the createBrand service
  try {
    const brand = await brandService.createBrand(req.body);
    return res.status(201).json(brand);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create brand ${error.message}` });
  }
};

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await brandService.getBrands();
    return res.status(200).json(brands);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get brands ${error.message}` });
  }
};

export const getBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const brand = await brandService.getBrand(id);
    return res.status(200).json(brand);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get brand ${error.message}` });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const brand = await brandService.updateBrand(id, req.body);
    return res.status(200).json(brand);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update brand ${error.message}` });
  }
};

//delete
export const deleteBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const brand = await brandService.deleteBrand(id);
    return res.status(200).json(brand);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete brand ${error.message}` });
  }
};
