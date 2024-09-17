import { Request, Response } from "express";
import { db } from "@/db/db";

export const createGenPostingSetup = async (req: Request, res: Response) => {
  try {
    const {
      genBusPostingGroupId,
      genProductPostingGroupId,
      description,
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
    if (genBusPostingGroupId) {
      const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
        where: { id: genBusPostingGroupId },
      });
      if (!genBusPostingGroup) {
        return res.status(404).json({
          error: "Gen Bus Posting Group not found",
        });
      }
    }

    //get the genProductPostingGroup
    if (genProductPostingGroupId) {
      const genProductPostingGroup =
        await db.generalProductPostingGroup.findUnique({
          where: { id: genProductPostingGroupId },
        });
      if (!genProductPostingGroup) {
        return res.status(404).json({
          error: "Gen Product Posting Group not found",
        });
      }
    }

    //with both the genBusPostingGroupId and genProductPostingGroupId check whether the genPosting Setup exists
    if (genBusPostingGroupId && genProductPostingGroupId) {
      const genPostingSetupExists = await db.genPostingSetup.findUnique({
        where: {
          genBusPostingGroupId_genProductPostingGroupId: {
            genBusPostingGroupId: genBusPostingGroupId,
            genProductPostingGroupId: genProductPostingGroupId,
          },
        },
        include: {
          genBusPostingGroup: true,
          genProductPostingGroup: true,
        },
      });
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
    }

    if (genBusPostingGroupId && !genProductPostingGroupId) {
      const genPostingSetupExists = await db.genPostingSetup.findFirst({
        where: {
          genBusPostingGroupId: genBusPostingGroupId,
          genProductPostingGroup: null,
        },
        include: {
          genBusPostingGroup: true,
          genProductPostingGroup: true,
        },
      });
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
    }

    if (!genBusPostingGroupId && genProductPostingGroupId) {
      //use find first
      const genPostingSetupExists = await db.genPostingSetup.findFirst({
        where: {
          genBusPostingGroup: null,
          genProductPostingGroupId: genProductPostingGroupId,
        },
        include: {
          genBusPostingGroup: true,
          genProductPostingGroup: true,
        },
      });
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
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
      },
      include: {
        genProductPostingGroup: true,
        genBusPostingGroup: true,
      },
    });

    return res.status(201).json({
      data: genPostingSetup,
      message: "Gen Posting Setup created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred.`,
    });
  }
};

export const getGenPostingSetups = async (_req: Request, res: Response) => {
  try {
    const genPostingSetups = await db.genPostingSetup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        genProductPostingGroup: true,
        genBusPostingGroup: true,
      },
    });
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
      include: {
        genProductPostingGroup: true,
        genBusPostingGroup: true,
      },
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
      error: `An unexpected error occurred while fetching the Gen Posting Setup.`,
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
    }

    if (genBusPostingGroupId && genProductPostingGroupId) {
      const genPostingSetupExists = await db.genPostingSetup.findUnique({
        where: {
          genBusPostingGroupId_genProductPostingGroupId: {
            genBusPostingGroupId: genBusPostingGroupId,
            genProductPostingGroupId: genProductPostingGroupId,
          },
        },
        include: {
          genBusPostingGroup: true,
          genProductPostingGroup: true,
        },
      });
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
    }

    let newGenProductPostingGroupId =
      genPostingSetupExists.genProductPostingGroupId
        ? genPostingSetupExists.genProductPostingGroupId
        : null;
    if (genBusPostingGroupId && !genProductPostingGroupId) {
      //use find first
      let genPostingSetupExists;
      if (newGenProductPostingGroupId) {
        genPostingSetupExists = await db.genPostingSetup.findUnique({
          where: {
            genBusPostingGroupId_genProductPostingGroupId: {
              genBusPostingGroupId: genBusPostingGroupId,
              genProductPostingGroupId: newGenProductPostingGroupId,
            },
          },
          include: {
            genBusPostingGroup: true,
            genProductPostingGroup: true,
          },
        });
      } else {
        genPostingSetupExists = await db.genPostingSetup.findFirst({
          where: {
            genBusPostingGroupId: genBusPostingGroupId,
            genProductPostingGroup: null,
          },
          include: {
            genBusPostingGroup: true,
            genProductPostingGroup: true,
          },
        });
      }
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
    }

    let newGenBusPostingGroupId = genPostingSetupExists.genBusPostingGroupId
      ? genPostingSetupExists.genBusPostingGroupId
      : null;
    if (!genBusPostingGroupId && genProductPostingGroupId) {
      //use find first
      let genPostingSetupExists;
      if (newGenBusPostingGroupId) {
        genPostingSetupExists = await db.genPostingSetup.findUnique({
          where: {
            genBusPostingGroupId_genProductPostingGroupId: {
              genBusPostingGroupId: newGenBusPostingGroupId,
              genProductPostingGroupId: genProductPostingGroupId,
            },
          },
          include: {
            genBusPostingGroup: true,
            genProductPostingGroup: true,
          },
        });
      } else {
        genPostingSetupExists = await db.genPostingSetup.findFirst({
          where: {
            genBusPostingGroup: null,
            genProductPostingGroupId: genProductPostingGroupId,
          },
          include: {
            genBusPostingGroup: true,
            genProductPostingGroup: true,
          },
        });
      }
      if (genPostingSetupExists) {
        return res.status(500).json({
          error: `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`,
        });
      }
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
      },
    });
    return res.status(200).json({
      data: genPostingSetup,
      message: "Gen Posting Setup updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Gen Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Gen Posting Setup.`,
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
      error: `An unexpected error occurred while deleting the Gen Posting Setup.`,
    });
  }
};
