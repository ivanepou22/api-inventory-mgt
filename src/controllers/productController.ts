import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Request, Response } from "express";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    const slug = await slugify(name);

    const productBySlug = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (productBySlug) {
      return res.status(409).json({
        error: `Product with slug: ${slug} already exists`,
      });
    }

    const productBySku = await db.product.findUnique({
      where: {
        sku,
      },
    });
    if (productBySku) {
      return res.status(409).json({
        error: `Product with SKU: ${sku} already exists`,
      });
    }

    if (barCode) {
      const productByBarcode = await db.product.findUnique({
        where: {
          barCode,
        },
      });
      if (productByBarcode) {
        return res.status(409).json({
          error: `Product with BarCode: ${barCode} already exists`,
        });
      }
    }

    const productByCode = await db.product.findUnique({
      where: {
        productCode,
      },
    });
    if (productByCode) {
      return res.status(409).json({
        error: `Product with Product Code: ${productCode} already exists`,
      });
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        sku,
        productCode,
        slug,
        expiryDate: new Date(expiryDate),
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
    res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Get all products
export const getProducts = async (_req: Request, res: Response) => {
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
    res.status(200).json({ data: products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};

// Get a single product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    } = req.body;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (slug && slug !== product.slug) {
      const productBySlug = await db.product.findUnique({
        where: {
          slug,
        },
      });
      if (productBySlug) {
        return res.status(409).json({
          error: `Product with slug: ${slug} already exists`,
        });
      }
    }

    if (sku && sku !== product.sku) {
      const productBySku = await db.product.findUnique({
        where: {
          sku,
        },
      });
      if (productBySku) {
        return res.status(409).json({
          error: `Product with SKU: ${sku} already exists`,
        });
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
          return res.status(409).json({
            error: `Product with BarCode: ${barCode} already exists`,
          });
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
        return res.status(409).json({
          error: `Product with Product Code: ${productCode} already exists`,
        });
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

    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    console.error("Error updating Unit:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the Product exists
    const product = await db.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    // Delete the Product
    const deletedProduct = await db.unit.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedProduct,
      message: `Product deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Product:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Get products by brand
export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
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
    res.status(200).json({ data: products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products by brand" });
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
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
    res.status(200).json({ data: featuredProducts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching featured products" });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
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
    res.status(200).json({ data: products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for products" });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
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
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching products by category",
    });
  }
};

//positive adjustment of stock quantity
export const updateStockQty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
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
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await db.product.update({
      where: { id },
      data: { stockQty: product.stockQty + stockQty },
    });
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the stock quantity" });
  }
};

//negative adjustment of stock quantity
export const negativeStockQty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockQty } = req.body;
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
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        stockQty: product.stockQty !== null ? product.stockQty - stockQty : 0,
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
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the stock quantity" });
  }
};
