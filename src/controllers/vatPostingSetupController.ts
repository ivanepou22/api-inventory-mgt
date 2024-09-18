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
    if (vatBusPostingGroupId) {
      const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
        where: { id: vatBusPostingGroupId },
      });
      if (!vatBusPostingGroup) {
        return res.status(404).json({
          error: "Vat Bus Posting Group not found",
        });
      }
    }

    //get the vatProductPostingGroup
    if (vatProductPostingGroupId) {
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
    }
    //check if the vatBusPostingGroup and vatProductPostingGroup are unique
    if (vatBusPostingGroupId && vatProductPostingGroupId) {
      const vatPostingSetupExists = await db.vatPostingSetup.findUnique({
        where: {
          vatBusPostingGroupId_vatProductPostingGroupId: {
            vatBusPostingGroupId: vatBusPostingGroupId,
            vatProductPostingGroupId: vatProductPostingGroupId,
          },
        },
        include: {
          vatBusPostingGroup: true,
          vatProductPostingGroup: true,
        },
      });
      if (vatPostingSetupExists) {
        return res.status(409).json({
          error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
        });
      }
    }
    if (vatBusPostingGroupId && !vatProductPostingGroupId) {
      //check if the vat posting setup exists with the same vatBusPostingGroupId and a null vatProductPostingGroupId
      const vatPostingSetupExists = await db.vatPostingSetup.findFirst({
        where: {
          vatBusPostingGroupId: vatBusPostingGroupId,
          vatProductPostingGroup: null,
        },
        include: {
          vatBusPostingGroup: true,
          vatProductPostingGroup: true,
        },
      });
      if (vatPostingSetupExists) {
        return res.status(409).json({
          error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
        });
      }
    }

    if (!vatBusPostingGroupId && vatProductPostingGroupId) {
      //check if the vat posting setup exists with the same vatBusPostingGroupId and a null vatProductPostingGroupId
      const vatPostingSetupExists = await db.vatPostingSetup.findFirst({
        where: {
          vatBusPostingGroup: null,
          vatProductPostingGroupId,
        },
        include: {
          vatBusPostingGroup: true,
          vatProductPostingGroup: true,
        },
      });
      if (vatPostingSetupExists) {
        return res.status(409).json({
          error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
        });
      }
    }

    const vatPostingSetup = await db.vatPostingSetup.create({
      data: {
        description,
        vatBusPostingGroupId,
        vatProductPostingGroupId,
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
      error: `An unexpected error occurred while creating the Vat Posting Setup.`,
    });
  }
};

export const getVatPostingSetups = async (_req: Request, res: Response) => {
  try {
    const vatPostingSetups = await db.vatPostingSetup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vatBusPostingGroup: true,
        vatProductPostingGroup: true,
      },
    });
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
      include: {
        vatBusPostingGroup: true,
        vatProductPostingGroup: true,
      },
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
      error: `An unexpected error occurred while fetching the Vat Posting Setup.`,
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
      include: { vatBusPostingGroup: true, vatProductPostingGroup: true },
    });
    if (!vatPostingSetupExists) {
      return res.status(404).json({
        error: "Vat Posting Setup not found",
      });
    }

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

      if (
        vatProductPostingGroupId &&
        vatProductPostingGroupId !==
          vatPostingSetupExists.vatProductPostingGroupId
      ) {
        const vatProductPostingGroup =
          await db.vatProductPostingGroup.findUnique({
            where: { id: vatProductPostingGroupId },
          });
        if (!vatProductPostingGroup) {
          return res.status(404).json({
            error: "Vat Product Posting Group not found",
          });
        }

        if (vatBusPostingGroupId && vatProductPostingGroupId) {
          const vatPostingSetupExists = await db.vatPostingSetup.findUnique({
            where: {
              vatBusPostingGroupId_vatProductPostingGroupId: {
                vatBusPostingGroupId: vatBusPostingGroupId,
                vatProductPostingGroupId: vatProductPostingGroupId,
              },
            },
            include: {
              vatBusPostingGroup: true,
              vatProductPostingGroup: true,
            },
          });
          if (vatPostingSetupExists) {
            return res.status(409).json({
              error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
            });
          }
        }
      }

      let newVatProductPostingGroupId =
        vatPostingSetupExists.vatProductPostingGroupId
          ? vatPostingSetupExists.vatProductPostingGroupId
          : null;
      if (vatBusPostingGroupId && !vatProductPostingGroupId) {
        let vatPostingSetupExists;
        if (newVatProductPostingGroupId) {
          vatPostingSetupExists = await db.vatPostingSetup.findUnique({
            where: {
              vatBusPostingGroupId_vatProductPostingGroupId: {
                vatBusPostingGroupId: vatBusPostingGroupId,
                vatProductPostingGroupId: newVatProductPostingGroupId,
              },
            },
            include: {
              vatBusPostingGroup: true,
              vatProductPostingGroup: true,
            },
          });
        } else {
          vatPostingSetupExists = await db.vatPostingSetup.findFirst({
            where: {
              vatBusPostingGroupId: vatBusPostingGroupId,
              vatProductPostingGroup: null,
            },
            include: {
              vatBusPostingGroup: true,
              vatProductPostingGroup: true,
            },
          });
        }
        if (vatPostingSetupExists) {
          return res.status(409).json({
            error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
          });
        }
      }
    }

    let newVatBusPostingGroupId = vatPostingSetupExists.vatBusPostingGroupId
      ? vatPostingSetupExists.vatBusPostingGroupId
      : null;
    if (!vatBusPostingGroupId && vatProductPostingGroupId) {
      let vatPostingSetupExists;
      if (newVatBusPostingGroupId) {
        vatPostingSetupExists = await db.vatPostingSetup.findUnique({
          where: {
            vatBusPostingGroupId_vatProductPostingGroupId: {
              vatBusPostingGroupId: newVatBusPostingGroupId,
              vatProductPostingGroupId: vatProductPostingGroupId,
            },
          },
          include: {
            vatBusPostingGroup: true,
            vatProductPostingGroup: true,
          },
        });
      } else {
        vatPostingSetupExists = await db.vatPostingSetup.findFirst({
          where: {
            vatBusPostingGroup: null,
            vatProductPostingGroupId,
          },
          include: {
            vatBusPostingGroup: true,
            vatProductPostingGroup: true,
          },
        });
      }
      if (vatPostingSetupExists) {
        return res.status(409).json({
          error: `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`,
        });
      }
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
      },
    });
    return res.status(200).json({
      data: vatPostingSetup,
      message: "Vat Posting Setup updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Vat Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Vat Posting Setup.`,
    });
  }
};

export const deleteVatPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vatPostingSetup = await db.vatPostingSetup.findUnique({
      where: { id },
      include: {
        vatBusPostingGroup: true,
        vatProductPostingGroup: true,
      },
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
      error: `An unexpected error occurred while deleting the Vat Posting Setup.`,
    });
  }
};
