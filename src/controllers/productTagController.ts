import { Request, Response } from "express";
import { productTagService } from "@/services/productTagService";

// Create a new product tag
export const createProductTag = async (req: Request, res: Response) => {
  try {
    const newProductTag = await productTagService.createProductTag(req.body);
    return res.status(201).json(newProductTag);
  } catch (error: any) {
    console.error("Error creating Product Tag:", error);
    return res.status(500).json({
      error: `Failed to create Product Tag: ${error.message}`,
    });
  }
};

// Get all product tags
export const getProductTags = async (_req: Request, res: Response) => {
  try {
    const productTags = await productTagService.getProductTags();
    return res.status(200).json(productTags);
  } catch (error: any) {
    console.error("Error fetching Product Tags:", error);
    return res.status(500).json({
      error: `Failed to fetch Product Tags: ${error.message}`,
    });
  }
};

// Get a single product tag by ID
export const getProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productTag = await productTagService.getProductTag(id);
    return res.status(200).json(productTag);
  } catch (error: any) {
    console.error("Error fetching Product Tag:", error);
    return res.status(500).json({
      error: `Failed to fetch Product Tag: ${error.message}`,
    });
  }
};

// Update a product tag
export const updateProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedProductTag = await productTagService.updateProductTag(
      id,
      req.body
    );
    return res.status(200).json(updatedProductTag);
  } catch (error: any) {
    console.error("Error updating Product Tag:", error);
    return res.status(500).json({
      error: `Failed to update Product Tag: ${error.message}`,
    });
  }
};

// Delete a product tag
export const deleteProductTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedProductTag = await productTagService.deleteProductTag(id);
    return res.status(200).json(deletedProductTag);
  } catch (error: any) {
    console.error("Error deleting Product Tag:", error);
    return res.status(500).json({
      error: `Failed to delete Product Tag: ${error.message}`,
    });
  }
};
