import { Request, Response } from "express";
import { db } from "@/db/db";

export const createGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const {
      description,
      genBusPostingGroupId,
      genProductPostingGroupId,
      salesAccount,
      purchaseAccount,
      salesCreditMemoAccount,
      purchaseCreditMemoAccount,
      salesDiscountAccount,
      purchaseDiscountAccount,
      costOfGoodsSoldAccount,
      inventoryAdjustmentAccount,
      blocked,
    }: any = req.body;

    //get the genBusPostingGroup
    const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
      where: { id: genBusPostingGroupId },
    });
    if (!genBusPostingGroup) {
      return res.status(404).json({
        error: "Gen Bus Posting Group not found",
      });
    }

    //get the genProductPostingGroup
    const genProductPostingGroup =
      await db.generalProductPostingGroup.findUnique({
        where: { id: genProductPostingGroupId },
      });
    if (!genProductPostingGroup) {
      return res.status(404).json({
        error: "Gen Product Posting Group not found",
      });
    }

    const genPostingSetup = await db.genPostingSetup.create({
      data: {
        description,
        genBusPostingGroupId,
        genProductPostingGroupId,
        salesAccount,
        purchaseAccount,
        salesCreditMemoAccount,
        purchaseCreditMemoAccount,
        salesDiscountAccount,
        purchaseDiscountAccount,
        costOfGoodsSoldAccount,
        inventoryAdjustmentAccount,
        blocked,
        genBusPostingGroupCode: genBusPostingGroup.code,
        genBusPostingGroupName: genBusPostingGroup.name,
        genProductPostingGroupCode: genProductPostingGroup.code,
        genProductPostingGroupName: genProductPostingGroup.name,
      },
    });

    return res.status(201).json({
      data: genPostingSetup,
      message: "Gen Posting Setup created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getGenPostingSetups = async (req: Request, res: Response) => {
  try {
    const genPostingSetups = await db.genPostingSetup.findMany();
    return res.status(200).json({
      data: genPostingSetups,
      message: "Gen Posting Setups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Gen Posting Setups:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching Gen Posting Setups.",
    });
  }
};

export const getGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genPostingSetup = await db.genPostingSetup.findUnique({
      where: { id },
    });

    if (!genPostingSetup) {
      return res.status(404).json({
        error: "Gen Posting Setup not found",
      });
    }

    return res.status(200).json({
      data: genPostingSetup,
      message: "Gen Posting Setup fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Gen Posting Setup: ${error.message}`,
    });
  }
};

export const updateGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      description,
      genBusPostingGroupId,
      genProductPostingGroupId,
      salesAccount,
      purchaseAccount,
      salesCreditMemoAccount,
      purchaseCreditMemoAccount,
      salesDiscountAccount,
      purchaseDiscountAccount,
      costOfGoodsSoldAccount,
      inventoryAdjustmentAccount,
      blocked,
    }: any = req.body;

    //check if the genPostingSetup exists
    const genPostingSetupExists = await db.genPostingSetup.findUnique({
      where: { id },
    });
    if (!genPostingSetupExists) {
      return res.status(404).json({
        error: "Gen Posting Setup not found",
      });
    }

    let genBusPostingGroupCode = genPostingSetupExists.genBusPostingGroupCode;
    let genBusPostingGroupName = genPostingSetupExists.genBusPostingGroupName;
    let genProductPostingGroupCode =
      genPostingSetupExists.genProductPostingGroupCode;
    let genProductPostingGroupName =
      genPostingSetupExists.genProductPostingGroupName;

    //check if the  genBusPostingGroup exists only if the genBusPostingGroupId is not null and not the same as the current genBusPostingGroupId
    if (
      genBusPostingGroupId &&
      genBusPostingGroupId !== genPostingSetupExists.genBusPostingGroupId
    ) {
      const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
        where: { id: genBusPostingGroupId },
      });
      if (!genBusPostingGroup) {
        return res.status(404).json({
          error: "Gen Bus Posting Group not found",
        });
      }
      genBusPostingGroupCode = genBusPostingGroup.code;
      genBusPostingGroupName = genBusPostingGroup.name;
    }

    //check if the  genProductPostingGroup exists only if the genProductPostingGroupId is not null and not the same as the current genProductPostingGroupId
    if (
      genProductPostingGroupId &&
      genProductPostingGroupId !==
        genPostingSetupExists.genProductPostingGroupId
    ) {
      const genProductPostingGroup =
        await db.generalProductPostingGroup.findUnique({
          where: { id: genProductPostingGroupId },
        });
      if (!genProductPostingGroup) {
        return res.status(404).json({
          error: "General Product Posting Group not found",
        });
      }
      genProductPostingGroupCode = genProductPostingGroup.code;
      genProductPostingGroupName = genProductPostingGroup.name;
    }

    // Perform the update
    const genPostingSetup = await db.genPostingSetup.update({
      where: { id },
      data: {
        description,
        genBusPostingGroupId,
        genProductPostingGroupId,
        salesAccount,
        purchaseAccount,
        salesCreditMemoAccount,
        purchaseCreditMemoAccount,
        salesDiscountAccount,
        purchaseDiscountAccount,
        costOfGoodsSoldAccount,
        inventoryAdjustmentAccount,
        blocked,
        genBusPostingGroupCode,
        genBusPostingGroupName,
        genProductPostingGroupCode,
        genProductPostingGroupName,
      },
    });
    return res.status(200).json({
      data: genPostingSetup,
      message: "Gen Posting Setup updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Gen Posting Setup: ${error.message}`,
    });
  }
};

export const deleteGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const genPostingSetup = await db.genPostingSetup.findUnique({
      where: { id },
    });
    if (!genPostingSetup) {
      return res.status(404).json({ error: "Gen Posting Setup not found." });
    }

    const genPostingSetupDeleted = await db.genPostingSetup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: genPostingSetupDeleted,
      message: "Gen Posting Setup deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Gen Posting Setup: ${error.message}`,
    });
  }
};
