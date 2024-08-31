import { db } from "@/db/db";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug, image } = req.body;

  const categoryExists = await db.category.findUnique({
    where: {
      slug,
    },
  });

  if (categoryExists) {
    return res.status(409).json({
      error: `Category with slug: ${slug} already exists`,
    });
  }

  try {
    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        image,
      },
    });

    return res.status(201).json({
      data: newCategory,
      error: null,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating Category:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: categories,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      return res.status(404).json({
        data: null,
        error: `Category not found.`,
      });
    }
    return res.status(200).json({
      data: category,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, slug, image } = req.body;

  try {
    const categoryExists = await db.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, image: true },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: "category not found." });
    }

    if (slug && slug !== categoryExists.slug) {
      const categoryBySlug = await db.category.findUnique({
        where: {
          slug,
        },
      });
      if (categoryBySlug) {
        return res.status(409).json({
          error: `category with slug: ${slug} already exists`,
        });
      }
    }
    // Perform the update
    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, slug, image },
    });

    return res.status(200).json({
      data: updatedCategory,
      message: "category updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating category:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

//delete
export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the category exists
    const category = await db.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!category) {
      return res.status(404).json({ error: "category not found." });
    }
    // Delete the category
    const deletedCategory = await db.category.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedCategory,
      message: `category deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
