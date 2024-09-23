import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

//create a service to create a category
export const createCategory = async (category: Prisma.CategoryCreateInput) => {
  const { name, slug, image } = category;
  const categoryExists = await db.category.findUnique({
    where: {
      slug,
    },
  });
  if (categoryExists) {
    throw new Error(`Category with slug: ${slug} already exists`);
  }
  try {
    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        image,
      },
    });
    return {
      data: newCategory,
      message: "Category created successfully",
    };
  } catch (error) {
    console.error("Error creating Category:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//Get all categories
export const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: categories,
    };
  } catch (err: any) {
    console.log(err.message);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//Get a category by id
export const getCategory = async (id: string) => {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new Error("Category not found.");
    }

    return {
      data: category,
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

//Update a category
export const updateCategory = async (
  id: string,
  category: Prisma.CategoryCreateInput
) => {
  const { name, slug, image } = category;
  try {
    const categoryExists = await db.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, image: true },
    });
    if (!categoryExists) {
      throw new Error("Category not found.");
    }
    if (slug && slug !== categoryExists.slug) {
      const categoryBySlug = await db.category.findUnique({
        where: {
          slug,
        },
      });
      if (categoryBySlug) {
        throw new Error(`Category with slug: ${slug} already exists`);
      }
    }
    // Perform the update
    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, slug, image },
    });
    return { data: updatedCategory, message: "Category updated successfully" };
  } catch (error: any) {
    console.error("Error updating Category:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//create a service to delete a category
export const deleteCategory = async (id: string) => {
  try {
    // Check if the category exists
    const category = await db.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!category) {
      throw new Error("Category not found.");
    }
    // Delete the category
    const deletedCategory = await db.category.delete({
      where: { id },
    });
    return {
      data: deletedCategory,
      message: `Category deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Category:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const categoryService = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
