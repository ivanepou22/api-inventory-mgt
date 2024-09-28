import { db } from "@/db/db";
import { Prisma } from "@prisma/client";
import slugify from "slugify";

const createProduct = async (product: Prisma.ProductUncheckedCreateInput) => {
  const {
    name,
    description,
    sku,
    productCode,
    expiryDate,
    alertQty,
    unitPrice,
    wholeSalePrice,
    unitCost,
    batchNo,
    featured,
    productContent,
    taxMethod,
    productTax,
    barCode,
    unitId,
    brandId,
    categoryId,
    supplierId,
    shopId,
    status,
    images,
  } = product;
  try {
    const slug = await slugify(name);

    const productBySlug = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (productBySlug) {
      throw new Error(`Product with slug: ${slug} already exists`);
    }

    const productBySku = await db.product.findUnique({
      where: {
        sku,
      },
    });
    if (productBySku) {
      throw new Error(`Product with sku: ${sku} already exists`);
    }

    if (barCode) {
      const productByBarcode = await db.product.findUnique({
        where: {
          barCode,
        },
      });
      if (productByBarcode) {
        throw new Error(`Product with BarCode: ${barCode} already exists`);
      }
    }

    const productByCode = await db.product.findUnique({
      where: {
        productCode,
      },
    });
    if (productByCode) {
      throw new Error(
        `Product with Product Code: ${productCode} already exists`
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        sku,
        productCode,
        slug,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        alertQty,
        unitPrice,
        wholeSalePrice,
        unitCost,
        batchNo,
        featured,
        productContent,
        taxMethod,
        productTax,
        barCode,
        status,
        Unit: unitId ? { connect: { id: unitId } } : undefined,
        Brand: brandId ? { connect: { id: brandId } } : undefined,
        Category: categoryId ? { connect: { id: categoryId } } : undefined,
        Supplier: supplierId ? { connect: { id: supplierId } } : undefined,
        Shop: shopId ? { connect: { id: shopId } } : undefined,
        images,
      },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        versions: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return {
      data: product,
      message: "Product created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Product:", error);
    throw new Error(error.message);
  }
};

const getProducts = async () => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        versions: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return { data: products, message: "Products fetched successfully" };
  } catch (error: any) {
    console.error("Error fetching Products:", error);
    throw new Error(error.message);
  }
};

const getProduct = async (id: string) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return { data: product, message: "Product fetched successfully" };
  } catch (error: any) {
    console.error("Error fetching Product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateProduct = async (
  id: string,
  product: Prisma.ProductUncheckedCreateInput
) => {
  const {
    name,
    description,
    sku,
    productCode,
    slug,
    expiryDate,
    alertQty,
    unitPrice,
    wholeSalePrice,
    unitCost,
    batchNo,
    featured,
    productContent,
    taxMethod,
    productTax,
    barCode,
    unitId,
    brandId,
    categoryId,
    supplierId,
    shopId,
    status,
    images,
  } = product;
  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    if (slug && slug !== product.slug) {
      const productBySlug = await db.product.findUnique({
        where: {
          slug,
        },
      });
      if (productBySlug) {
        throw new Error(`Product with slug: ${slug} already exists`);
      }
    }

    if (sku && sku !== product.sku) {
      const productBySku = await db.product.findUnique({
        where: {
          sku,
        },
      });
      if (productBySku) {
        throw new Error(`Product with sku: ${sku} already exists`);
      }
    }

    if (barCode && barCode !== product.barCode) {
      if (barCode) {
        const productByBarcode = await db.product.findUnique({
          where: {
            barCode,
          },
        });
        if (productByBarcode) {
          throw new Error(`Product with BarCode: ${barCode} already exists`);
        }
      }
    }

    if (productCode && productCode !== product.productCode) {
      const productByCode = await db.product.findUnique({
        where: {
          productCode,
        },
      });
      if (productByCode) {
        throw new Error(
          `Product with Product Code: ${productCode} already exists`
        );
      }
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        sku,
        productCode,
        slug,
        expiryDate,
        alertQty,
        unitPrice,
        wholeSalePrice,
        unitCost,
        batchNo,
        featured,
        productContent,
        taxMethod,
        productTax,
        barCode,
        unitId,
        brandId,
        categoryId,
        supplierId,
        shopId,
        status,
        images,
      },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        versions: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });

    return { data: updatedProduct, message: "Product updated successfully" };
  } catch (error: any) {
    console.error("Error updating Product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteProduct = async (id: string) => {
  try {
    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    // Delete the product
    const deletedProduct = await db.product.delete({
      where: { id },
    });
    return {
      data: deletedProduct,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getProductsByBrand = async (brandId: string) => {
  try {
    const products = await db.product.findMany({
      where: { brandId },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return { data: products, message: "Products fetched successfully" };
  } catch (error: any) {
    console.error("Error fetching Products:", error);
    throw new Error(error.message);
  }
};

const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await db.product.findMany({
      where: { featured: true },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return {
      data: featuredProducts,
      message: "Featured Products fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Featured Products:", error);
    throw new Error(error.message);
  }
};

const searchProducts = async (query: any) => {
  try {
    const products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
          { sku: { contains: query as string, mode: "insensitive" } },
          { productCode: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });
    return { data: products, message: "Products fetched successfully" };
  } catch (error: any) {
    console.error("Error fetching Products:", error);
    throw new Error(error.message);
  }
};

const getProductsByCategory = async (categoryId: string) => {
  try {
    const products = await db.product.findMany({
      where: { categoryId },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return { data: products, message: "Products fetched successfully" };
  } catch (error: any) {
    console.error("Error fetching Products:", error);
    throw new Error(error.message);
  }
};

const updateStockQty = async (id: string, stockQty: number) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    const currentQty = product.stockQty ?? 0;
    const updatedProduct = await db.product.update({
      where: { id },
      data: { stockQty: currentQty + stockQty },
    });
    return { data: updatedProduct, message: "Product updated successfully" };
  } catch (error: any) {
    console.error("Error updating Stock Quantity:", error);
    throw new Error(error.message);
  }
};

const negativeStockQty = async (id: string, stockQty: number) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    const currentQty = product.stockQty ?? 0;
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        stockQty: currentQty - stockQty,
      },
      include: {
        seoMeta: true,
        productVariants: true,
        stockHistories: true,
        productRelations: true,
        discounts: true,
        tags: true,
        InventoryPostingGroup: true,
        GeneralProductPostingGroup: true,
        VatProductPostingGroup: true,
        Unit: true,
        Shop: true,
        Brand: true,
        Category: true,
        Supplier: true,
      },
    });
    return { data: updatedProduct, message: "Product deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting Product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const productService = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  updateStockQty,
  negativeStockQty,
};
