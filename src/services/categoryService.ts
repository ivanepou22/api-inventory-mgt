import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { slugify } from "@/utils/functions";

class CategoryService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  //create a service to create a category
  createCategory = async (category: Prisma.CategoryCreateInput) => {
    const { code, name, image } = category;
    if (!code || !name) {
      throw new Error("Category code and name are required.");
    }

    const codeSlug = await slugify(code);

    const categoryExists = await this.findUnique(
      (args) => this.db.category.findUnique(args),
      {
        where: {
          tenantId_companyId_code: {
            tenantId: this.tenantId,
            companyId: this.companyId,
            code: codeSlug,
          },
        },
      }
    );
    if (categoryExists) {
      throw new Error(`Category with slug: ${code} already exists`);
    }
    try {
      const newCategory = await this.create(
        (args) => this.db.category.create(args),
        {
          data: {
            name,
            code: codeSlug,
            image,
          },
        }
      );
      return {
        data: newCategory,
        message: "Category created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Category:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //Get all categories
  getCategories = async () => {
    try {
      const categories = await this.findMany(
        (args) => this.db.category.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
        }
      );
      return {
        data: categories,
      };
    } catch (err: any) {
      console.log(err.message);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  };

  //Get a category by id
  getCategory = async (id: string) => {
    try {
      const category = await this.findUnique(
        (args) => this.db.category.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
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
        throw new Error(error.message);
      }
    }
  };

  //Update a category
  updateCategory = async (id: string, category: Prisma.CategoryCreateInput) => {
    const { code, name, image } = category;
    try {
      const categoryExists = await this.findUnique(
        (args) => this.db.category.findUnique(args),
        {
          where: { id },
          select: { id: true, code: true, name: true, image: true },
        }
      );
      if (!categoryExists) {
        throw new Error("Category not found.");
      }

      const codeSlug = code ? await slugify(code) : null;

      if (codeSlug && codeSlug !== categoryExists.code) {
        const categoryBySlug = await this.findUnique(
          (args) => this.db.category.findUnique(args),
          {
            where: {
              tenantId_companyId_code: {
                tenantId: this.tenantId,
                companyId: this.companyId,
                code: codeSlug,
              },
            },
          }
        );
        if (categoryBySlug) {
          throw new Error(`Category with slug: ${codeSlug} already exists`);
        }
      }
      // Perform the update
      const updatedCategory = await this.update(
        (args) => this.db.category.update(args),
        {
          where: { id },
          data: { name, code: codeSlug, image },
        }
      );
      return {
        data: updatedCategory,
        message: "Category updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating Category:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //create a service to delete a category
  deleteCategory = async (id: string) => {
    try {
      // Check if the category exists
      const category = await this.findUnique(
        (args) => this.db.category.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!category) {
        throw new Error("Category not found.");
      }
      // Delete the category
      const deletedCategory = await this.delete(
        (args) => this.db.category.delete(args),
        {
          where: { id },
        }
      );
      return {
        data: deletedCategory,
        message: `Category deleted successfully`,
      };
    } catch (error: any) {
      console.error("Error deleting Category:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };
}
export const categoryService = (): CategoryService => {
  return new CategoryService(db);
};
