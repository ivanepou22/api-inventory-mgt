import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createGenPostingSetup = async (
  genPostingSetup: Prisma.GenPostingSetupUncheckedCreateInput
) => {
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
  } = genPostingSetup;

  try {
    //get the genBusPostingGroup
    if (genBusPostingGroupId) {
      const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
        where: { id: genBusPostingGroupId },
      });
      if (!genBusPostingGroup) {
        throw new Error("Gen Bus Posting Group not found");
      }
    }

    //get the genProductPostingGroup
    if (genProductPostingGroupId) {
      const genProductPostingGroup =
        await db.generalProductPostingGroup.findUnique({
          where: { id: genProductPostingGroupId },
        });
      if (!genProductPostingGroup) {
        throw new Error("General Product Posting Group not found");
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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

    return {
      data: genPostingSetup,
      message: "Gen Posting Setup created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Gen Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getGenPostingSetups = async () => {
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
    return {
      data: genPostingSetups,
      message: "Gen Posting Setups fetched successfully",
    };
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }
};

const getGenPostingSetup = async (id: string) => {
  try {
    const genPostingSetup = await db.genPostingSetup.findUnique({
      where: {
        id,
      },
      include: {
        genProductPostingGroup: true,
        genBusPostingGroup: true,
      },
    });
    if (!genPostingSetup) {
      throw new Error("Gen Posting Setup not found.");
    }
    return {
      data: genPostingSetup,
      message: "Gen Posting Setup fetched successfully",
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateGenPostingSetup = async (
  id: string,
  genPostingSetup: Prisma.GenPostingSetupUncheckedCreateInput
) => {
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
  } = genPostingSetup;

  try {
    //check if the genPostingSetup exists
    const genPostingSetupExists = await db.genPostingSetup.findUnique({
      where: { id },
    });
    if (!genPostingSetupExists) {
      throw new Error("Gen Posting Setup not found");
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
        throw new Error("Gen Bus Posting Group not found.");
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
        throw new Error("General Product Posting Group not found.");
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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
        throw new Error(
          `Gen Posting Setup with Bus Posting Group: ${genPostingSetupExists.genBusPostingGroup?.code} and General Product Posting Group: ${genPostingSetupExists.genProductPostingGroup?.code} already exists`
        );
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
    return {
      data: genPostingSetup,
      message: "Gen Posting Setup updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteGenPostingSetup = async (id: string) => {
  try {
    // Check if the genPostingSetup exists
    const genPostingSetup = await db.genPostingSetup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genPostingSetup) {
      throw new Error("Gen Posting Setup not found.");
    }
    // Delete the genPostingSetup
    const deletedGenPostingSetup = await db.genPostingSetup.delete({
      where: { id },
    });
    return {
      data: deletedGenPostingSetup,
      message: `Gen Posting Setup deleted successfully`,
    };
  } catch (error: any) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const genPostingSetupService = {
  createGenPostingSetup,
  getGenPostingSetups,
  getGenPostingSetup,
  updateGenPostingSetup,
  deleteGenPostingSetup,
};
