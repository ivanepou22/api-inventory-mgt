import { db } from "@/db/db";
import { Prisma } from "@prisma/client";
//create a service to create a brand
export const createBrand = async (brand: Prisma.BrandCreateInput) => {
  const { name, slug, image } = brand;
  const brandExists = await db.brand.findUnique({
    where: {
      slug,
    },
  });
  if (brandExists) {
    throw new Error(`Brand with slug: ${slug} already exists`);
  }
  try {
    const newBrand = await db.brand.create({
      data: {
        name,
        slug,
        image,
      },
    });
    return {
      data: newBrand,
      error: null,
      message: "Brand created successfully",
    };
  } catch (error) {
    console.error("Error creating Brand:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    } else
      throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//Get all brands
export const getBrands = async () => {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: brands,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

//Get a brand by id
export const getBrand = async (id: string) => {
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    if (!brand) {
      throw new Error("Brand not found.");
    }

    return {
      data: brand,
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

//Update a brand
export const updateBrand = async (
  id: string,
  brand: Prisma.BrandCreateInput
) => {
  const { name, slug, image } = brand;
  try {
    const brandExists = await db.brand.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, image: true },
    });
    if (!brandExists) {
      throw new Error("Brand not found.");
    }
    if (slug && slug !== brandExists.slug) {
      const brandBySlug = await db.brand.findUnique({
        where: {
          slug,
        },
      });
      if (brandBySlug) {
        throw new Error(`Brand with slug: ${slug} already exists`);
      }
    }
    // Perform the update
    const updatedBrand = await db.brand.update({
      where: { id },
      data: { name, slug, image },
    });
    return { data: updatedBrand, message: "Brand updated successfully" };
  } catch (error: any) {
    console.error("Error updating Brand:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

//create a service to delete a brand
export const deleteBrand = async (id: string) => {
  try {
    // Check if the brand exists
    const brand = await db.brand.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!brand) {
      throw new Error("Brand not found.");
    }
    // Delete the brand
    const deletedBrand = await db.brand.delete({
      where: { id },
    });
    return {
      data: deletedBrand,
      message: `Brand deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Brand:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const brandService = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
