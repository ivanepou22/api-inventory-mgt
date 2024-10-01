import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createVatPostingSetup = async (
  vatPostingSetup: Prisma.VatPostingSetupUncheckedCreateInput
) => {
  const {
    description,
    vatBusPostingGroupId,
    vatProductPostingGroupId,
    taxPercent,
    vatIdentifier,
    salesVatAccount,
    purchaseVatAccount,
    blocked,
  } = vatPostingSetup;
  try {
    //get the vatBusPostingGroup
    if (vatBusPostingGroupId) {
      const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
        where: { id: vatBusPostingGroupId },
      });
      if (!vatBusPostingGroup) {
        throw new Error("vatBusPostingGroup not found");
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
        throw new Error("vatProductPostingGroup not found");
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
        throw new Error(
          `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
        );
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

    return {
      data: vatPostingSetup,
      message: "Vat Posting Setup created successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating vat posting setup");
  }
};

const getVatPostingSetups = async () => {
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
    return {
      data: vatPostingSetups,
      message: "Vat Posting Setups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setups:", error);
    throw new Error(error.message);
  }
};

const getVatPostingSetup = async (id: string) => {
  try {
    const vatPostingSetup = await db.vatPostingSetup.findUnique({
      where: { id },
      include: {
        vatBusPostingGroup: true,
        vatProductPostingGroup: true,
      },
    });

    if (!vatPostingSetup) {
      throw new Error("Vat Posting Setup not found");
    }

    return {
      data: vatPostingSetup,
      message: "Vat Posting Setup fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateVatPostingSetup = async (
  id: string,
  vatPostingSetup: Prisma.VatPostingSetupUncheckedCreateInput
) => {
  const {
    description,
    vatBusPostingGroupId,
    vatProductPostingGroupId,
    taxPercent,
    vatIdentifier,
    salesVatAccount,
    purchaseVatAccount,
    blocked,
  } = vatPostingSetup;
  try {
    //check if the vatPostingSetup exists
    const vatPostingSetupExists = await db.vatPostingSetup.findUnique({
      where: { id },
      include: { vatBusPostingGroup: true, vatProductPostingGroup: true },
    });
    if (!vatPostingSetupExists) {
      throw new Error("Vat Posting Setup not found.");
    }

    if (
      vatBusPostingGroupId &&
      vatBusPostingGroupId !== vatPostingSetupExists.vatBusPostingGroupId
    ) {
      const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
        where: { id: vatBusPostingGroupId },
      });
      if (!vatBusPostingGroup) {
        throw new Error("Vat Bus Posting Group not found");
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
          throw new Error("Vat Product Posting Group not found");
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
            throw new Error(
              `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
            );
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
          throw new Error(
            `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
          );
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
        throw new Error(
          `Vat Posting Setup with vat Bus. Posting Group Code: ${vatPostingSetupExists.vatBusPostingGroup?.code} and vat Product Posting Group Code: ${vatPostingSetupExists.vatProductPostingGroup?.code} already exists`
        );
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
    return {
      data: vatPostingSetup,
      message: "Vat Posting Setup updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Vat Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteVatPostingSetup = async (id: string) => {
  try {
    // Check if the brand exists
    const vatPostingSetup = await db.vatPostingSetup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vatPostingSetup) {
      throw new Error("Vat Posting Setup not found.");
    }
    // Delete the Vat Posting Setup
    const deletedVatPostingSetup = await db.vatPostingSetup.delete({
      where: { id },
    });
    return {
      data: deletedVatPostingSetup,
      message: `Vat Posting Setup deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Vat Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const vatPostingSetupService = {
  createVatPostingSetup,
  getVatPostingSetups,
  getVatPostingSetup,
  updateVatPostingSetup,
  deleteVatPostingSetup,
};
