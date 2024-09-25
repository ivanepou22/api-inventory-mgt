import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createInventoryPostingSetup = async (
  inventoryPostingSetup: Prisma.InventoryPostingSetupUncheckedCreateInput
) => {
  const {
    description,
    inventoryPostingGroupId,
    blocked,
    shopId,
    inventoryAccount,
  } = inventoryPostingSetup;

  try {
    //get the inventoryPostingGroup
    if (inventoryPostingGroupId) {
      const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
        where: { id: inventoryPostingGroupId },
      });
      if (!inventoryPostingGroup) {
        throw new Error("Inventory Posting Group not found.");
      }
    }

    //get the shop
    if (shopId) {
      const shop = await db.shop.findUnique({
        where: { id: shopId },
      });
      if (!shop) {
        throw new Error("Shop not found.");
      }
    }

    if (inventoryPostingGroupId && shopId) {
      const inventoryPostingSetupExists =
        await db.inventoryPostingSetup.findUnique({
          where: {
            shopId_inventoryPostingGroupId: {
              shopId: shopId,
              inventoryPostingGroupId: inventoryPostingGroupId,
            },
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }

    if (shopId && !inventoryPostingGroupId) {
      const inventoryPostingSetupExists =
        await db.inventoryPostingSetup.findFirst({
          where: {
            shopId: shopId,
            inventoryPostingGroup: null,
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }

    if (!shopId && inventoryPostingGroupId) {
      const inventoryPostingSetupExists =
        await db.inventoryPostingSetup.findFirst({
          where: {
            shopId: null,
            inventoryPostingGroupId: inventoryPostingGroupId,
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }

    const inventoryPostingSetup = await db.inventoryPostingSetup.create({
      data: {
        description,
        inventoryPostingGroupId,
        blocked,
        shopId,
        inventoryAccount,
      },
      include: {
        inventoryPostingGroup: true,
        shop: true,
      },
    });

    return {
      data: inventoryPostingSetup,
      message: "Inventory Posting Setup created successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Setups:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching Inventory Posting Setups.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getInventoryPostingSetups = async () => {
  try {
    const inventoryPostingSetups = await db.inventoryPostingSetup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        inventoryPostingGroup: true,
        shop: true,
      },
    });
    return {
      data: inventoryPostingSetups,
      message: "Inventory Posting Setups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Setups:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching Inventory Posting Setups.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getInventoryPostingSetup = async (id: string) => {
  try {
    const inventoryPostingSetup = await db.inventoryPostingSetup.findUnique({
      where: { id },
      include: {
        inventoryPostingGroup: true,
        shop: true,
      },
    });

    if (!inventoryPostingSetup) {
      throw new Error("Inventory Posting Setup not found");
    }

    return {
      data: inventoryPostingSetup,
      message: "Inventory Posting Setup fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching the Inventory Posting Setup: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateInventoryPostingSetup = async (
  id: string,
  inventoryPostingSetup: Prisma.InventoryPostingSetupUncheckedCreateInput
) => {
  const {
    description,
    inventoryPostingGroupId,
    blocked,
    shopId,
    inventoryAccount,
  } = inventoryPostingSetup;

  try {
    // Check if the inventoryPostingSetup exists
    const inventoryPostingSetupExists =
      await db.inventoryPostingSetup.findUnique({
        where: { id },
        select: {
          id: true,
          description: true,
          inventoryPostingGroupId: true,
          blocked: true,
          shopId: true,
          inventoryAccount: true,
        },
      });
    if (!inventoryPostingSetupExists) {
      throw new Error("Inventory Posting Setup not found");
    }

    //get the inventoryPostingGroup
    if (
      inventoryPostingGroupId &&
      inventoryPostingGroupId !==
        inventoryPostingSetupExists.inventoryPostingGroupId
    ) {
      const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
        where: { id: inventoryPostingGroupId },
      });
      if (!inventoryPostingGroup) {
        throw new Error("Inventory Posting Group not found");
      }
    }

    //get the shop
    if (shopId && shopId !== inventoryPostingSetupExists.shopId) {
      const shop = await db.shop.findUnique({
        where: { id: shopId },
      });
      if (!shop) {
        throw new Error("Shop not found");
      }
    }

    if (inventoryPostingGroupId && shopId) {
      const inventoryPostingSetupExists =
        await db.inventoryPostingSetup.findUnique({
          where: {
            shopId_inventoryPostingGroupId: {
              shopId: shopId,
              inventoryPostingGroupId: inventoryPostingGroupId,
            },
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }
    let newInventoryPostingGroupId =
      inventoryPostingSetupExists.inventoryPostingGroupId
        ? inventoryPostingSetupExists.inventoryPostingGroupId
        : null;

    if (shopId && !inventoryPostingGroupId) {
      let inventoryPostingSetupExists;
      if (newInventoryPostingGroupId) {
        inventoryPostingSetupExists = await db.inventoryPostingSetup.findUnique(
          {
            where: {
              shopId_inventoryPostingGroupId: {
                shopId: shopId,
                inventoryPostingGroupId: newInventoryPostingGroupId,
              },
            },
            include: {
              inventoryPostingGroup: true,
              shop: true,
            },
          }
        );
      } else {
        inventoryPostingSetupExists = await db.inventoryPostingSetup.findFirst({
          where: {
            shopId: shopId,
            inventoryPostingGroup: null,
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      }
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }

    if (!shopId && inventoryPostingGroupId) {
      let inventoryPostingSetupExists;
      if (newInventoryPostingGroupId) {
        inventoryPostingSetupExists = await db.inventoryPostingSetup.findUnique(
          {
            where: {
              shopId_inventoryPostingGroupId: {
                shopId: newInventoryPostingGroupId,
                inventoryPostingGroupId: inventoryPostingGroupId,
              },
            },
            include: {
              inventoryPostingGroup: true,
              shop: true,
            },
          }
        );
      } else {
        inventoryPostingSetupExists = await db.inventoryPostingSetup.findFirst({
          where: {
            shopId: null,
            inventoryPostingGroupId: inventoryPostingGroupId,
          },
          include: {
            inventoryPostingGroup: true,
            shop: true,
          },
        });
      }
      if (inventoryPostingSetupExists) {
        throw new Error(
          `Inventory Posting Setup with Shop: ${inventoryPostingSetupExists.shop?.name} and Inventory Posting Group: ${inventoryPostingSetupExists.inventoryPostingGroup?.code} already exists`
        );
      }
    }

    // Perform the update
    const updatedInventoryPostingSetup = await db.inventoryPostingSetup.update({
      where: { id },
      data: {
        description,
        inventoryPostingGroupId,
        blocked,
        inventoryAccount,
        shopId,
      },
      include: {
        inventoryPostingGroup: true,
        shop: true,
      },
    });
    return {
      data: updatedInventoryPostingSetup,
      message: "Inventory Posting Setup updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Inventory Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while updating the Inventory Posting Setup: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteInventoryPostingSetup = async (id: string) => {
  try {
    // Check if the inventoryPostingSetup exists
    const inventoryPostingSetup = await db.inventoryPostingSetup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!inventoryPostingSetup) {
      throw new Error("Inventory Posting Setup not found.");
    }

    const inventoryPostingSetupDeleted = await db.inventoryPostingSetup.delete({
      where: { id },
    });
    return {
      data: inventoryPostingSetupDeleted,
      message: `Inventory Posting Setup deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Inventory Posting Setup:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while deleting the Inventory Posting Setup: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const inventoryPostingSetupService = {
  createInventoryPostingSetup,
  getInventoryPostingSetups,
  getInventoryPostingSetup,
  updateInventoryPostingSetup,
  deleteInventoryPostingSetup,
};
