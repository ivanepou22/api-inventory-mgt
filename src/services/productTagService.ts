import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

export const createProductTag = async (
  productTag: Prisma.ProductTagUncheckedCreateInput
) => {
  const { productId, tagId } = productTag;
  try {
    const productTagExists = await db.productTag.findUnique({
      where: {
        productId_tagId: {
          productId,
          tagId,
        },
      },
    });
    if (productTagExists) {
      throw new Error("Product tag already exists");
    }
    const newProductTag = await db.productTag.create({
      data: {
        productId,
        tagId,
      },
    });
    return {
      data: newProductTag,
      message: "Product tag created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Product Tag:", error);
    throw new Error(error.message);
  }
};

export const getProductTags = async () => {
  try {
    const productTags = await db.productTag.findMany({
      include: { product: true, tag: true },
    });
    return {
      data: productTags,
      message: "Product tags fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Product Tags:", error);
    throw new Error(error.message);
  }
};

export const getProductTag = async (id: string) => {
  try {
    const productTag = await db.productTag.findUnique({
      where: { id },
      include: { product: true, tag: true },
    });
    if (!productTag) {
      throw new Error("Product tag not found");
    }
    return {
      data: productTag,
      message: "Product tag fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Product Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const updateProductTag = async (
  id: string,
  productTag: Prisma.ProductTagUncheckedCreateInput
) => {
  const { productId, tagId } = productTag;
  try {
    const productTagMainExists = await db.productTag.findUnique({
      where: {
        id,
      },
      select: { id: true, productId: true, tagId: true },
    });
    if (!productTagMainExists) {
      throw new Error("Product tag not found");
    }
    if (productId && productId !== productTagMainExists.productId) {
      const productExists = await db.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });
      if (!productExists) {
        throw new Error("Product not found");
      }
    }

    //check if the tag exists
    if (tagId && tagId !== productTagMainExists.tagId) {
      const tagExists = await db.tag.findUnique({
        where: { id: tagId },
        select: { id: true },
      });
      if (!tagExists) {
        throw new Error("Tag not found");
      }
    }

    if (productId && tagId) {
      const productTagExists = await db.productTag.findUnique({
        where: {
          productId_tagId: {
            productId,
            tagId,
          },
        },
      });
      if (productTagExists) {
        throw new Error("Product tag already exists");
      }
    }

    if (tagId && !productId) {
      const productTagExists = await db.productTag.findUnique({
        where: {
          productId_tagId: {
            productId: productTagMainExists.productId,
            tagId,
          },
        },
      });
      if (productTagExists) {
        throw new Error("Product tag already exists");
      }
    }

    if (!tagId && productId) {
      const productTagExists = await db.productTag.findUnique({
        where: {
          productId_tagId: {
            productId,
            tagId: productTagMainExists.tagId,
          },
        },
      });
      if (productTagExists) {
        throw new Error("Product tag already exists");
      }
    }

    // Perform the update
    const updatedProductTag = await db.productTag.update({
      where: { id },
      data: {
        productId,
        tagId,
      },
      include: { product: true, tag: true },
    });
    return {
      data: updatedProductTag,
      message: "Product tag updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Product Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const deleteProductTag = async (id: string) => {
  try {
    // Check if the product tag exists
    const productTag = await db.productTag.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!productTag) {
      throw new Error("Product tag not found");
    }
    // Delete the product tag
    const deletedProductTag = await db.productTag.delete({
      where: { id },
    });
    return {
      data: deletedProductTag,
      message: "Product tag deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Product Tag:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const productTagService = {
  createProductTag,
  getProductTags,
  getProductTag,
  updateProductTag,
  deleteProductTag,
};
