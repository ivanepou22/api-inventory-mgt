import { Request, Response } from "express";
import { db } from "@/db/db";

export const createInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      description,
      inventoryPostingGroupId,
      blocked,
      shopId,
      inventoryAccount,
    }: any = req.body;

    //get the inventoryPostingGroup
    const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
      where: { id: inventoryPostingGroupId },
    });
    if (!inventoryPostingGroup) {
      return res.status(404).json({
        error: "Inventory Posting Group not found",
      });
    }

    //get the shop
    const shop = await db.shop.findUnique({
      where: { id: shopId },
    });
    if (!shop) {
      return res.status(404).json({
        error: "Shop not found",
      });
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

    return res.status(201).json({
      data: inventoryPostingSetup,
      message: "Inventory Posting Setup created successfully",
    });
  } catch (error: any) {
    console.error("Error creating Inventory Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred: ${error.message}`,
    });
  }
};

export const getInventoryPostingSetups = async (
  _req: Request,
  res: Response
) => {
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
    return res.status(200).json({
      data: inventoryPostingSetups,
      message: "Inventory Posting Setups fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Setups:", error);
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching Inventory Posting Setups.",
    });
  }
};

export const getInventoryPostingSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inventoryPostingSetup = await db.inventoryPostingSetup.findUnique({
      where: { id },
      include: {
        inventoryPostingGroup: true,
        shop: true,
      },
    });

    if (!inventoryPostingSetup) {
      return res.status(404).json({
        error: "Inventory Posting Setup not found",
      });
    }

    return res.status(200).json({
      data: inventoryPostingSetup,
      message: "Inventory Posting Setup fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while fetching the Inventory Posting Setup: ${error.message}`,
    });
  }
};

export const updateInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      description,
      inventoryPostingGroupId,
      blocked,
      shopId,
      inventoryAccount,
    }: any = req.body;

    //check if the inventoryPostingSetup exists
    const inventoryPostingSetupExists =
      await db.inventoryPostingSetup.findUnique({
        where: { id },
      });
    if (!inventoryPostingSetupExists) {
      return res.status(404).json({
        error: "Inventory Posting Setup not found",
      });
    }

    //check if the  inventoryPostingGroup exists only if the inventoryPostingGroupId is not null and not the same as the current inventoryPostingGroupId
    if (
      inventoryPostingGroupId &&
      inventoryPostingGroupId !==
        inventoryPostingSetupExists.inventoryPostingGroupId
    ) {
      const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
        where: { id: inventoryPostingGroupId },
      });
      if (!inventoryPostingGroup) {
        return res.status(404).json({
          error: "Inventory Posting Group not found",
        });
      }
    }

    //get the shop
    if (shopId && shopId !== inventoryPostingSetupExists.shopId) {
      const shop = await db.shop.findUnique({
        where: { id: shopId },
      });
      if (!shop) {
        return res.status(404).json({
          error: "Shop not found",
        });
      }
    }
    // Perform the update
    const inventoryPostingSetup = await db.inventoryPostingSetup.update({
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
    return res.status(200).json({
      data: inventoryPostingSetup,
      message: "Inventory Posting Setup updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating Inventory Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while updating the Inventory Posting Setup: ${error.message}`,
    });
  }
};

export const deleteInventoryPostingSetup = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const inventoryPostingSetup = await db.inventoryPostingSetup.findUnique({
      where: { id },
    });
    if (!inventoryPostingSetup) {
      return res
        .status(404)
        .json({ error: "Inventory Posting Setup not found." });
    }

    const inventoryPostingSetupDeleted = await db.inventoryPostingSetup.delete({
      where: { id },
    });
    return res.status(200).json({
      data: inventoryPostingSetupDeleted,
      message: "Inventory Posting Setup deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting Inventory Posting Setup:", error);
    return res.status(500).json({
      error: `An unexpected error occurred while deleting the Inventory Posting Setup: ${error.message}`,
    });
  }
};
