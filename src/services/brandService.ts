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

// //create a service to update a brand
// export const updateBrand = async (id: string, brand: any) => {
//   try {
//     const updatedBrand = await db.collection("brands").doc(id).update(brand);
//     return updatedBrand;
//   } catch (error) {
//     console.log(error);
//   }
// };

// //create a service to delete a brand
// export const deleteBrand = async (id: string) => {
//   try {
//     const deletedBrand = await db.collection("brands").doc(id).delete();
//     return deletedBrand;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const brandService = {
  createBrand,
  getBrands,
  getBrand,
  // updateBrand,
  // deleteBrand,
};
