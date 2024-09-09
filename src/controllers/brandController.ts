import { Request, Response } from "express";
import { db } from "@/db/db";

export const createBrand = async (req: Request, res: Response) => {
  const { name, slug, image } = req.body;
  const brandExists = await db.brand.findUnique({
    where: {
      slug,
    },
  });
  if (brandExists) {
    return res.status(409).json({
      error: `Brand with slug: ${slug} already exists`,
    });
  }
  try {
    const newBrand = await db.brand.create({
      data: {
        name,
        slug,
        image,
      },
    });
    return res.status(201).json({
      data: newBrand,
      error: null,
      message: "Brand created successfully",
    });
  } catch (error) {
    console.error("Error creating Brand:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getBrands = async (_req: Request, res: Response) => {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: brands,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    if (!brand) {
      return res.status(404).json({
        data: null,
        error: `Brand not found.`,
      });
    }
    return res.status(200).json({
      data: brand,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
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
