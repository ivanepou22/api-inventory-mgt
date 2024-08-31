import { Request, Response } from "express";
import { db } from "@/db/db";

// Create a new product tag
export const createProductTag = async (req: Request, res: Response) => {
  const { productId, tagName } = req.body;
  try {
    const productTag = await db.productTag.create({
      data: { productId, tagName },
      include: { product: true },
    });
    res.status(201).json(productTag);
  } catch (error) {
    console.error("Error creating product tag:", error);
    res.status(400).json({ error: "Invalid input or product not found" });
  }
};

// Get all product tags
export const getProductTags = async (_req: Request, res: Response) => {
  try {
    const productTags = await db.productTag.findMany({
      include: { product: true },
    });
    res.json(productTags);
  } catch (error) {
    console.error("Error fetching product tags:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching product tags" });
  }
};

// Get a single product tag by ID
export const getProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productTag = await db.productTag.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!productTag) {
      return res.status(404).json({ error: "Product tag not found" });
    }
    res.json(productTag);
  } catch (error) {
    console.error("Error fetching product tag:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product tag" });
  }
};

// Update a product tag
export const updateProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tagName } = req.body;
  try {
    const updatedProductTag = await db.productTag.update({
      where: { id },
      data: { tagName },
      include: { product: true },
    });
    res.json(updatedProductTag);
  } catch (error) {
    console.error("Error updating product tag:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ error: "Product tag not found" });
    }
    res.status(400).json({ error: "Invalid input" });
  }
};

// Delete a product tag
export const deleteProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.productTag.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product tag:", error);
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ error: "Product tag not found" });
    }
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product tag" });
  }
};
