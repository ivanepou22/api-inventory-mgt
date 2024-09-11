import { Request, Response } from "express";
import { db } from "@/db/db";
import {
  generatePurchaseLineNo,
  generatePurchaseNumber,
  generateStockHistoryEntryNo,
} from "@/utils/functions";
import {} from "@/utils/types";
import {
  Prisma,
  PurchaseHeader,
  StockEntryType,
  StockHistoryDocumentType,
} from "@prisma/client";

export const createPurchase = async (req: Request, res: Response) => {
  const {
    supplierId,
    documentType,
    documentDate,
    dueDate,
    postingDate,
    note,
    discountPercent,
    discountAmount,
    taxPercent,
    locationCode,
    purchaseLines,
  } = req.body;

  //get the supplier details
  const supplier = await db.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    return res.status(404).json({
      error: "Supplier not found",
    });
  }

  const documentNo = await generatePurchaseNumber();
  let purchaseLineNo = await generatePurchaseLineNo();
  let stockHistoryEntryNumber = await generateStockHistoryEntryNo();
  try {
    const purchase = await db.$transaction(
      async (prisma: Prisma.TransactionClient): Promise<PurchaseHeader> => {
        const createdPurchase = await prisma.purchaseHeader.create({
          data: {
            supplierId,
            supplierName: supplier.name,
            supplierPhone: supplier.phone,
            supplierEmail: supplier.email,
            documentNo,
            documentType,
            documentDate: documentDate || new Date(),
            dueDate: dueDate || new Date(),
            postingDate: postingDate || new Date(),
            note,
            discountPercent,
            discountAmount,
            taxPercent,
            locationCode,
          },
        });

        if (!createdPurchase) {
          throw new Error("Failed to create purchase");
        }

        // Check if products, units, and shops exist
        for (const line of purchaseLines) {
          purchaseLineNo++;
          stockHistoryEntryNumber++;
          const product = await prisma.product.findUnique({
            where: { id: line.productId },
          });
          if (!product) {
            throw new Error(`Product with id ${line.productId} not found`);
          }

          const unit = await prisma.unit.findUnique({
            where: { id: line.unitId },
          });
          if (!unit) {
            throw new Error(`Unit with id ${line.unitId} not found`);
          }

          const shop = await prisma.shop.findUnique({
            where: { id: line.shopId },
          });
          if (!shop) {
            throw new Error(`Shop with id ${line.shopId} not found`);
          }

          // check if the product has a valid unit
          if (!product.unitId) {
            throw new Error(
              `Product with id ${line.productId} has no valid unit`
            );
          }

          // check if the line does not have zero quantity
          if (line.quantity === 0) {
            throw new Error(
              `Quantity for product with id ${line.productId} cannot be zero`
            );
          }

          // check if the product has enough stock
          if (product.stockQty && product.stockQty < line.quantity) {
            throw new Error(
              `Product with id ${line.productId} has insufficient stock`
            );
          }

          //calculate the line discount amount
          let lineTaxAmount = 0;
          let lineDiscountAmount = 0;
          if (line.lineDiscountPercent) {
            lineDiscountAmount =
              line.price * line.quantity * (line.lineDiscountPercent / 100);
          } else if (line.lineDiscountAmount !== 0) {
            lineDiscountAmount = line.lineDiscountAmount;
          } else {
            lineDiscountAmount = 0;
          }

          //calculate the line tax amount
          if (line.lineTaxPercent) {
            lineTaxAmount =
              line.price * line.quantity * (line.lineTaxPercent / 100);
          }
          //calculate the line amount
          const lineAmount =
            line.price * line.quantity - lineDiscountAmount + lineTaxAmount;

          //createdPurchaseLine
          await prisma.purchaseLine.create({
            data: {
              purchaseHeaderId: createdPurchase.id,
              documentType: createdPurchase.documentType,
              documentNo: createdPurchase.documentNo,
              type: line.type,
              no_: line.no_,
              description: line.description,
              code: line.code || product.productCode,
              quantity: line.quantity,
              unitCost: line.unitCost,
              unitId: line.unitId,
              unitName: unit.name,
              unitAbbreviation: unit.abbreviation,
              lineAmount,
              lineDiscountPercent: line.lineDiscountPercent,
              lineDiscountAmount,
              lineTaxPercent: line.lineTaxPercent,
              lineTaxAmount,
              Amount: lineAmount,
              quantityToReceive: line.quantity,
              quantityReceived: 0,
              quantityToInvoice: line.quantity,
              quantityInvoiced: 0,
              lineNo: purchaseLineNo,
              locationCode: shop.slug,
              supplierId: createdPurchase.supplierId,
              supplierName: supplier.name,
              supplierPhone: supplier.phone,
              supplierEmail: supplier.email,
            },
          });

          const updatedProduct = await prisma.product.update({
            where: { id: line.productId },
            data: {
              stockQty: {
                increment: line.quantity,
              },
            },
          });
          if (!updatedProduct) {
            throw new Error(
              `Failed to update product with id ${line.productId}`
            );
          }

          //create a stock history
          await prisma.stockHistory.create({
            data: {
              entryType: StockEntryType.PURCHASE,
              postingDate: createdPurchase.postingDate || new Date(),
              documentType: StockHistoryDocumentType.PURCHASE_RECEIPT,
              documentNo: createdPurchase.documentNo,
              productId: line.productId,
              productName: product.name,
              productCode: product.productCode,
              productSku: product.sku,
              description: `${line.description}`,
              locationCode: shop.slug,
              quantity: line.quantity,
              invoicedQty: line.quantity,
              remainingQty: updatedProduct.stockQty,
              unitId: line.unitId,
              unitName: unit.name,
              unitAbbreviation: unit.abbreviation,
              referenceNo: createdPurchase.id,
              unitAmount: product.unitPrice ?? 0,
              totalAmount: (product.unitPrice ?? 0) * line.quantity,
              unitCost: product.unitCost ?? 0,
              totalCost: (product.unitCost ?? 0) * line.quantity,
              costAmount: (product.unitCost ?? 0) * line.quantity,
              entryNo: stockHistoryEntryNumber,
              open: false,
              salesAmount: 0,
            },
          });
        }

        //calculate the total purchase line discount amount
        const totalLineDiscountAmount = purchaseLines.reduce(
          (
            total: number,
            line: {
              lineDiscountPercent: number;
              lineDiscountAmount: number;
              price: number;
              quantity: number;
            }
          ) =>
            total +
            (line.lineDiscountPercent
              ? line.price * line.quantity * (line.lineDiscountPercent / 100)
              : line.lineDiscountAmount),
          0
        );

        //calculate the total line tax amount
        const totalLineTaxAmount = purchaseLines.reduce(
          (
            total: number,
            line: {
              lineTaxPercent: number;
              lineTaxAmount: number;
              price: number;
              quantity: number;
            }
          ) =>
            total +
            (line.lineTaxPercent
              ? line.price * line.quantity * (line.lineTaxPercent / 100)
              : line.lineTaxAmount),
          0
        );

        //calculate the total line amount
        const totalLineAmount = purchaseLines.reduce(
          (total: number, line: { price: number; quantity: number }) =>
            total + line.price * line.quantity,
          0
        );

        //calculate the total purchase amount before purchase header discount.
        const totalAmount =
          totalLineAmount - totalLineDiscountAmount + totalLineTaxAmount;

        //calculate the purchase header discount amount
        const purchaseHeaderDiscountAmount =
          (totalAmount * discountPercent) / 100;

        //total discount amount
        const totalDiscountAmount =
          totalLineDiscountAmount + purchaseHeaderDiscountAmount;

        //calculate the purchase header amount
        const purchaseHeaderAmount = totalAmount - purchaseHeaderDiscountAmount;

        //update the purchase header amount
        const updatedPurchase = await prisma.purchaseHeader.update({
          where: { id: createdPurchase.id },
          data: {
            totalDiscount: totalDiscountAmount,
            totalAmount: purchaseHeaderAmount,
            taxAmount: totalLineTaxAmount,
            dueAmount: purchaseHeaderAmount,
            amount: purchaseHeaderAmount,
          },
          include: { purchaseLines: true },
        });

        return updatedPurchase;
      }
    );

    return res.status(201).json({
      data: purchase,
      message: "Purchase created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Purchase:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

//get all purchases
export const getPurchases = async (_req: Request, res: Response) => {
  try {
    const purchases = await db.purchaseHeader.findMany();
    return res.status(200).json({
      data: purchases,
      message: "Purchases fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Purchases:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching Purchases.",
    });
  }
};

//get Purchase by id
export const getPurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await db.purchaseHeader.findUnique({
      where: { id },
      include: { purchaseLines: true },
    });

    if (!purchase) {
      return res.status(404).json({
        error: "Purchase not found",
      });
    }

    return res.status(200).json({
      data: purchase,
      message: "Purchase fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching purchase:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the purchase: ${error.message}`,
    });
  }
};

//update purchase
export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paidAmount, status, paymentMethod, paymentStatus } = req.body;

    const purchase = await db.purchaseHeader.update({
      where: { id },
      data: { paidAmount, status, paymentMethod, paymentStatus },
    });
    if (!purchase) {
      return res.status(404).json({ error: `Purchase: ${id} is not found.` });
    }

    return res.status(200).json({
      data: purchase,
      message: "Purchase updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating purchase:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the purchase: ${error.message}`,
    });
  }
};

//delete Purchase
export const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await db.purchaseHeader.findUnique({
      where: { id },
      include: { purchaseLines: true },
    });
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found." });
    }

    //delete the purchase lines
    try {
      await db.purchaseLine.deleteMany({
        where: { purchaseHeaderId: id },
      });
    } catch (error: any) {
      console.error("Error deleting purchase lines:", error);
      return res.status(500).json({
        error: `Failed to delete purchase lines: ${error.message}`,
      });
    }

    const purchaseDeleted = await db.purchaseHeader.delete({
      where: { id },
    });
    return res.status(200).json({
      data: purchaseDeleted,
      message: "Purchase deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting purchase:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the purchase: ${error.message}`,
    });
  }
};

//update purchase line
export const updatePurchaseLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      quantityToReceive,
      quantityReceived,
      quantityToInvoice,
      quantityInvoiced,
    } = req.body;
    const purchaseLine = await db.purchaseLine.update({
      where: { id },
      data: {
        quantityToReceive,
        quantityReceived,
        quantityToInvoice,
        quantityInvoiced,
      },
    });
    if (!purchaseLine) {
      return res.status(404).json({ error: "Purchase line not found." });
    }
    return res.status(200).json({
      data: purchaseLine,
      message: "Purchase line updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating purchase line:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the purchase line: ${error.message}`,
    });
  }
};
