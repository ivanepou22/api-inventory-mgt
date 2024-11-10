import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { slugify } from "@/utils/functions";

class BrandService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  //create a service to create a brand
  createBrand = async (brand: Prisma.BrandCreateInput) => {
    const { name, code, image } = brand;
    if (!name || !code) {
      throw new Error("Name and code are required.");
    }
    const codeSlug = await slugify(code);

    const brandExists = await this.findUnique(
      (args) => this.db.brand.findUnique(args),
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
    if (brandExists) {
      throw new Error(`Brand with slug: ${code} already exists`);
    }
    try {
      const newBrand = await this.create((args) => this.db.brand.create(args), {
        data: {
          name,
          code: codeSlug,
          image,
        },
      });
      return {
        data: newBrand,
        error: null,
        message: "Brand created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Brand:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //Get all brands
  getBrands = async () => {
    try {
      const brands = await this.findMany(
        (args) => this.db.brand.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
        }
      );
      return {
        data: brands,
      };
    } catch (error: any) {
      console.log(error.message);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      } else {
        throw new Error(
          `An unexpected error occurred. Please try again later.`
        );
      }
    }
  };

  //Get a brand by id
  getBrand = async (id: string) => {
    try {
      const brand = await this.findUnique(
        (args) => this.db.brand.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
      if (!brand) {
        throw new Error("Brand not found.");
      }

      return {
        data: brand,
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

  //Update a brand
  updateBrand = async (id: string, brand: Prisma.BrandCreateInput) => {
    const { name, code, image } = brand;
    try {
      const brandExists = await this.findUnique(
        (args) => this.db.brand.findUnique(args),
        {
          where: { id },
          select: { id: true, code: true, name: true, image: true },
        }
      );
      if (!brandExists) {
        throw new Error("Brand not found.");
      }

      const codeSlug = code ? await slugify(code) : null;

      if (codeSlug && codeSlug !== brandExists.code) {
        const brandBySlug = await this.findUnique(
          (args) => this.db.brand.findUnique(args),
          {
            where: {
              tenantId_companyId_code: {
                tenantId: brandExists.tenantId,
                companyId: brandExists.companyId,
                code: codeSlug,
              },
            },
          }
        );
        if (brandBySlug) {
          throw new Error(`Brand with slug: ${codeSlug} already exists`);
        }
      }
      // Perform the update
      const updatedBrand = await this.update(
        (args) => this.db.brand.update(args),
        { where: { id }, data: { name, code: codeSlug, image } }
      );
      return { data: updatedBrand, message: "Brand updated successfully" };
    } catch (error: any) {
      console.error("Error updating Brand:", error.message);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  //create a service to delete a brand
  deleteBrand = async (id: string) => {
    try {
      // Check if the brand exists
      const brand = await this.findUnique(
        (args) => this.db.brand.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!brand) {
        throw new Error("Brand not found.");
      }
      // Delete the brand
      const deletedBrand = await this.delete(
        (args) => this.db.brand.delete(args),
        {
          where: { id },
        }
      );
      return {
        data: deletedBrand,
        message: `Brand deleted successfully`,
      };
    } catch (error: any) {
      console.error("Error deleting Brand:", error.message);
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

export const brandService = (): BrandService => {
  return new BrandService(db);
};
