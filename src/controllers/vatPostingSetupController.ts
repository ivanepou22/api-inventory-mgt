import { Request, Response } from "express";
import { db } from "@/db/db";

export const createVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const {
      description,
      vatBusPostingGroupId,
      vatProductPostingGroupId,
      taxPercent,
      vatIdentifier,
      salesVatAccount,
      purchaseVatAccount,
      blocked,
    }: any = req.body;

    //get the vatBusPostingGroup
    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id: vatBusPostingGroupId },
    });
    if (!vatBusPostingGroup) {
      return res.status(404).json({
        error: "Vat Bus Posting Group not found",
      });
    }

    //get the vatProductPostingGroup
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id: vatProductPostingGroupId },
    });
    if (!vatProductPostingGroup) {
      return res.status(404).json({
        error: "Vat Product Posting Group not found",
      });
    }

    const vatPostingSetup = await db.vatPostingSetup.create({
      data: {
        description,
        vatBusPostingGroupId,
        vatBusPostingGroupCode: vatBusPostingGroup.code,
        vatBusPostingGroupName: vatBusPostingGroup.name,
        vatProductPostingGroupId,
        vatProductPostingGroupCode: vatProductPostingGroup.code,
        vatProductPostingGroupName: vatProductPostingGroup.name,
        taxPercent,
        vatIdentifier,
        salesVatAccount,
        purchaseVatAccount,
        blocked,
      },
    });

    return res.status(201).json({
      data: vatPostingSetup,
      message: "Vat Posting Setup created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Vat Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getVatPostingSetups = async (req: Request, res: Response) => {
  try {
    const vatPostingSetups = await db.vatPostingSetup.findMany();
    return res.status(200).json({
      data: vatPostingSetups,
      message: "Vat Posting Setups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setups:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching Vat Posting Setups.",
    });
  }
};

export const getVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vatPostingSetup = await db.vatPostingSetup.findUnique({
      where: { id },
    });

    if (!vatPostingSetup) {
      return res.status(404).json({
        error: "Vat Posting Setup not found",
      });
    }

    return res.status(200).json({
      data: vatPostingSetup,
      message: "Vat Posting Setup fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Vat Posting Setup: ${error.message}`,
    });
  }
};

export const updateVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      description,
      vatBusPostingGroupId,
      vatProductPostingGroupId,
      taxPercent,
      vatIdentifier,
      salesVatAccount,
      purchaseVatAccount,
      blocked,
    }: any = req.body;

    //check if the vatPostingSetup exists
    const vatPostingSetupExists = await db.vatPostingSetup.findUnique({
      where: { id },
    });
    if (!vatPostingSetupExists) {
      return res.status(404).json({
        error: "Vat Posting Setup not found",
      });
    }

    let vatBusPostingGroupCode;
    let vatBusPostingGroupName;
    let vatProductPostingGroupCode;
    let vatProductPostingGroupName;

    //check if the  vatBusPostingGroup exists only if the vatBusPostingGroupId is not null and not the same as the current vatBusPostingGroupId
    if (
      vatBusPostingGroupId &&
      vatBusPostingGroupId !== vatPostingSetupExists.vatBusPostingGroupId
    ) {
      const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
        where: { id: vatBusPostingGroupId },
      });
      if (!vatBusPostingGroup) {
        return res.status(404).json({
          error: "Vat Bus Posting Group not found",
        });
      }
      vatBusPostingGroupCode = vatBusPostingGroup.code;
      vatBusPostingGroupName = vatBusPostingGroup.name;
    }

    //check if the  vatProductPostingGroup exists only if the vatProductPostingGroupId is not null and not the same as the current vatProductPostingGroupId
    if (
      vatProductPostingGroupId &&
      vatProductPostingGroupId !==
        vatPostingSetupExists.vatProductPostingGroupId
    ) {
      const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique(
        {
          where: { id: vatProductPostingGroupId },
        }
      );
      if (!vatProductPostingGroup) {
        return res.status(404).json({
          error: "Vat Product Posting Group not found",
        });
      }
      vatProductPostingGroupCode = vatProductPostingGroup.code;
      vatProductPostingGroupName = vatProductPostingGroup.name;
    }

    const vatPostingSetup = await db.vatPostingSetup.update({
      where: { id },
      data: {
        description,
        vatBusPostingGroupId,
        vatProductPostingGroupId,
        taxPercent,
        vatIdentifier,
        salesVatAccount,
        purchaseVatAccount,
        blocked,
        vatBusPostingGroupCode,
        vatBusPostingGroupName,
        vatProductPostingGroupCode,
        vatProductPostingGroupName,
      },
    });
    return res.status(200).json({
      data: vatPostingSetup,
      message: "Vat Posting Setup updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vat Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Vat Posting Setup: ${error.message}`,
    });
  }
};

export const deleteVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vatPostingSetup = await db.vatPostingSetup.findUnique({
      where: { id },
    });
    if (!vatPostingSetup) {
      return res.status(404).json({ error: "Vat Posting Setup not found." });
    }

    const vatPostingSetupDeleted = await db.vatPostingSetup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: vatPostingSetupDeleted,
      message: "Vat Posting Setup deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Vat Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Vat Posting Setup: ${error.message}`,
    });
  }
};
