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
  const { name, slug, image } = req.body;
  try {
    const brandExists = await db.brand.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, image: true },
    });
    if (!brandExists) {
      return res.status(404).json({ error: "Brand not found." });
    }
    if (slug && slug !== brandExists.slug) {
      const brandBySlug = await db.brand.findUnique({
        where: {
          slug,
        },
      });
      if (brandBySlug) {
        return res.status(409).json({
          error: `Brand with slug: ${slug} already exists`,
        });
      }
    }
    // Perform the update
    const updatedBrand = await db.brand.update({
      where: { id },
      data: { name, slug, image },
    });
    return res
      .status(200)
      .json({ data: updatedBrand, message: "Brand updated successfully" });
  } catch (error: any) {
    console.error("Error updating Brand:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the brand exists
    const brand = await db.brand.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found." });
    }
    // Delete the brand
    const deletedBrand = await db.brand.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedBrand,
      message: `Brand deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Brand:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
