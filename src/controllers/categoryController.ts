import { categoryService } from "@/services/categoryService";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService().createCategory(req.body);
    return res.status(201).json(category);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to create category: ${error.message}` });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService().getCategories();
    return res.status(200).json(categories);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get categories: ${error.message}` });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const category = await categoryService().getCategory(id);
    return res.status(200).json(category);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to get category: ${error.message}` });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const category = await categoryService().updateCategory(id, req.body);
    return res.status(200).json(category);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to update category: ${error.message}` });
  }
};

//delete
export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const category = await categoryService().deleteCategory(id);
    return res.status(200).json(category);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: `Failed to delete category: ${error.message}` });
  }
};
