import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createExpenseCategory = async (
  expenseCategory: Prisma.ExpenseCategoryCreateInput
) => {
  const { name } = expenseCategory;
  const slug = await slugify(name);
  try {
    const slugExists = await db.expenseCategory.findUnique({
      where: {
        slug,
      },
    });

    if (slugExists) {
      throw new Error(
        `Slug: ${slug} is Already in use by another ExpenseCategory`
      );
    }
    const newExpenseCategory = await db.expenseCategory.create({
      data: {
        name,
        slug,
      },
    });
    return {
      data: newExpenseCategory,
      message: "ExpenseCategory created successfully",
    };
  } catch (error: any) {
    console.error("Error creating ExpenseCategory:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getExpenseCategories = async () => {
  try {
    const expenseCategories = await db.expenseCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: expenseCategories,
      message: "ExpenseCategories fetched successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }
};

const getExpenseCategory = async (id: string) => {
  try {
    const expenseCategory = await db.expenseCategory.findUnique({
      where: {
        id,
      },
    });
    if (!expenseCategory) {
      throw new Error("ExpenseCategory not found.");
    }
    return {
      data: expenseCategory,
      message: "ExpenseCategory fetched successfully",
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateExpenseCategory = async (
  id: string,
  expenseCategory: Prisma.ExpenseCategoryCreateInput
) => {
  const { name, slug } = expenseCategory;

  try {
    const expenseCategoryExists = await db.expenseCategory.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    });
    if (!expenseCategoryExists) {
      throw new Error("ExpenseCategory not found.");
    }
    if (slug && slug !== expenseCategoryExists.slug) {
      const expenseCategoryBySlug = await db.expenseCategory.findUnique({
        where: {
          slug,
        },
      });
      if (expenseCategoryBySlug) {
        throw new Error(
          `Slug: ${slug} is Already in use by another ExpenseCategory`
        );
      }
    }

    // Perform the update
    const updatedExpenseCategory = await db.expenseCategory.update({
      where: { id },
      data: { name, slug },
    });

    return {
      data: updatedExpenseCategory,
      message: "ExpenseCategory created Successfully.",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteExpenseCategory = async (id: string) => {
  try {
    // Check if the expenseCategory exists
    const expenseCategory = await db.expenseCategory.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!expenseCategory) {
      throw new Error("ExpenseCategory not found.");
    }
    // Delete the expenseCategory
    const deletedExpenseCategory = await db.expenseCategory.delete({
      where: { id },
    });
    return {
      data: deletedExpenseCategory,
      message: `ExpenseCategory deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const expenseCategoryService = {
  createExpenseCategory,
  getExpenseCategories,
  getExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
};
