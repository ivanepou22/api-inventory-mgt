import { Request, Response } from "express";
import { db } from "@/db/db";
import {
  generateAdjustmentNumber,
  generateAdjustmentEntryNo,
  generateStockHistoryEntryNo,
} from "@/utils/functions";
import { AdjustmentInput, AdjustmentLine } from "@/utils/types";
import {
  Adjustment,
  AdjustmentItemEntryType,
  NotificationType,
  Prisma,
  StockEntryType,
  StockHistoryDocumentType,
} from "@prisma/client";

export const createAdjustment = async (req: Request, res: Response) => {
  const { date, description, activity, AdjustmentLines }: AdjustmentInput =
    req.body;

  const referenceNo = await generateAdjustmentNumber();
  let adjustmentEntryNumber = await generateAdjustmentEntryNo();
  let stockHistoryEntryNumber = await generateStockHistoryEntryNo();
  try {
    const adjustment = await db.$transaction(
      async (prisma: Prisma.TransactionClient): Promise<Adjustment> => {
        const createdAdjustment = await prisma.adjustment.create({
          data: {
            referenceNo,
            date,
            description,
            activity,
          },
        });

        // Check if products, units, and shops exist
        for (const line of AdjustmentLines) {
          adjustmentEntryNumber++;
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

          // check if the line does not have zero quantity
          if (line.quantity === 0) {
            throw new Error(
              `Quantity for product with id ${line.productId} cannot be zero`
            );
          }

          // check if the product has enough stock
          if (
            line.entryType === AdjustmentItemEntryType.NEGATIVE_ADJUST ||
            line.entryType === AdjustmentItemEntryType.SALE
          ) {
            if (product.stockQty && product.stockQty < line.quantity) {
              throw new Error(
                `Product with id ${line.productId} has insufficient stock`
              );
            }
          }

          //createdAdjustmentLine
          await prisma.adjustmentLine.create({
            data: {
              postingDate: line.postingDate || new Date(),
              entryType: line.entryType,
              documentNo: line.documentNo,
              adjustmentId: createdAdjustment.id,
              productId: line.productId,
              productName: product.name,
              productCode: product.productCode,
              productSku: product.sku,
              shopId: line.shopId,
              quantity: line.quantity,
              unitId: line.unitId,
              reason: line.reason,
              unitAmount: product.unitPrice ?? 0,
              totalAmount: (product.unitPrice ?? 0) * line.quantity,
              unitCost: product.unitCost ?? 0,
              totalCost: (product.unitCost ?? 0) * line.quantity,
              entryNo: adjustmentEntryNumber,
            } as AdjustmentLine,
          });

          //if the entry type is POSITIVE_ADJUST increment the stock and if the entry type is NEGATIVE_ADJUST decrement the stock
          if (line.entryType === AdjustmentItemEntryType.POSITIVE_ADJUST) {
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
                entryType: StockEntryType.POSITIVE_ADJUST,
                postingDate: line.postingDate || new Date(),
                documentType: StockHistoryDocumentType.ADJUSTMENT,
                documentNo: line.documentNo,
                productId: line.productId,
                productName: product.name,
                productCode: product.productCode,
                productSku: product.sku,
                description: `${product.name} ${line.reason}`,
                locationCode: shop.slug,
                quantity: line.quantity,
                invoicedQty: line.quantity,
                remainingQty: updatedProduct.stockQty,
                unitId: line.unitId,
                unitName: unit.name,
                unitAbbreviation: unit.abbreviation,
                referenceNo,
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
          } else if (
            line.entryType === AdjustmentItemEntryType.NEGATIVE_ADJUST
          ) {
            const updatedProduct = await prisma.product.update({
              where: { id: line.productId },
              data: {
                stockQty: {
                  decrement: line.quantity,
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
                entryType: StockEntryType.NEGATIVE_ADJUST,
                postingDate: line.postingDate || new Date(),
                documentType: StockHistoryDocumentType.ADJUSTMENT,
                documentNo: line.documentNo,
                productId: line.productId,
                productName: product.name,
                productCode: product.productCode,
                productSku: product.sku,
                description: `${product.name} ${line.reason}`,
                locationCode: shop.id,
                quantity: -line.quantity,
                invoicedQty: -line.quantity,
                remainingQty: updatedProduct.stockQty,
                unitId: line.unitId,
                unitName: unit.name,
                unitAbbreviation: unit.abbreviation,
                referenceNo,
                unitAmount: product.unitPrice ?? 0,
                totalAmount: (product.unitPrice ?? 0) * -line.quantity,
                unitCost: product.unitCost ?? 0,
                totalCost: (product.unitCost ?? 0) * -line.quantity,
                costAmount: (product.unitCost ?? 0) * -line.quantity,
                entryNo: stockHistoryEntryNumber,
                open: false,
                salesAmount: 0,
              },
            });

            //check if the product stock is less than the alertQty level and if it is, send a notification
            if (
              updatedProduct.alertQty &&
              updatedProduct.stockQty &&
              updatedProduct.stockQty < updatedProduct.alertQty
            ) {
              const message =
                updatedProduct.stockQty === 0
                  ? `Product with Code: ${updatedProduct.productCode}: ${updatedProduct.name} is out of stock, current stock is ${updatedProduct.stockQty}`
                  : `The stock of ${updatedProduct.productCode}-${updatedProduct.name} has gone below the alert stock: ${updatedProduct.alertQty}, current stock is ${updatedProduct.stockQty}`;

              const type =
                updatedProduct.stockQty === 0
                  ? NotificationType.ERROR
                  : NotificationType.WARNING;

              const title = "Low Stock Alert";

              await prisma.notification.create({
                data: {
                  title,
                  message,
                  type,
                },
              });
            }
          }
        }

        const updatedAdjustment = await prisma.adjustment.findUnique({
          where: { id: createdAdjustment.id },
          include: { adjustmentLines: true },
        });
        if (!updatedAdjustment) {
          throw new Error(
            `Failed to find adjustment with id ${createdAdjustment.id}`
          );
        }

        return updatedAdjustment;
      },
      {
        timeout: 100000, // Increase timeout to 10 seconds
        maxWait: 105000,
      }
    );

    return res.status(201).json({
      data: adjustment,
      message: "Adjustment created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Adjustment:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

//get all adjustments
export const getAdjustments = async (req: Request, res: Response) => {
  try {
    const adjustments = await db.adjustment.findMany();
    return res.status(200).json({
      data: adjustments,
      message: "Adjustments fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching adjustments:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching adjustments.",
    });
  }
};

//get adjustment by id
export const getAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adjustment = await db.adjustment.findUnique({
      where: { id },
      include: { adjustmentLines: true },
    });

    if (!adjustment) {
      return res.status(404).json({
        error: "Adjustment not found",
      });
    }

    return res.status(200).json({
      data: adjustment,
      message: "Adjustment fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching adjustment:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the adjustment: ${error.message}`,
    });
  }
};

//update adjustment
export const updateAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, description, activity, AdjustmentLines }: AdjustmentInput =
      req.body;

    const adjustment = await db.adjustment.update({
      where: { id },
      data: {
        date,
        description,
        activity,
        adjustmentLines: {
          deleteMany: {},
          create: AdjustmentLines,
        },
      },
    });
    return res.status(200).json({
      data: adjustment,
      message: "Adjustment updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating adjustment:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the adjustment: ${error.message}`,
    });
  }
};

//delete adjustment
export const deleteAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const adjustment = await db.adjustment.findUnique({
      where: { id },
      include: { adjustmentLines: true },
    });
    if (!adjustment) {
      return res.status(404).json({ error: "Adjustment not found." });
    }

    //delete the adjustment lines
    try {
      await db.adjustmentLine.deleteMany({
        where: { adjustmentId: id },
      });
    } catch (error: any) {
      console.error("Error deleting adjustment lines:", error);
      throw new Error(`Failed to delete adjustment lines: ${error.message}`);
    }

    const adjustmentDeleted = await db.adjustment.delete({
      where: { id },
    });
    return res.status(200).json({
      data: adjustmentDeleted,
      message: "Adjustment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting adjustment:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the adjustment: ${error.message}`,
    });
  }
};
