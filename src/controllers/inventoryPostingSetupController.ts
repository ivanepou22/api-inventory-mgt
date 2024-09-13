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

    const inventoryPostingGroupCode = inventoryPostingGroup.code;
    const inventoryPostingGroupName = inventoryPostingGroup.name;

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
        inventoryPostingGroupCode,
        inventoryPostingGroupName,
        blocked,
        shopId,
        shopCode: shop.slug,
        shopName: shop.name,
        shopSlug: shop.slug,
        inventoryAccount,
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
    const inventoryPostingSetups = await db.inventoryPostingSetup.findMany();
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

    let inventoryPostingGroupCode =
      inventoryPostingSetupExists.inventoryPostingGroupCode;
    let inventoryPostingGroupName =
      inventoryPostingSetupExists.inventoryPostingGroupName;

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
      inventoryPostingGroupCode = inventoryPostingGroup.code;
      inventoryPostingGroupName = inventoryPostingGroup.name;
    }

    let shopCode = inventoryPostingSetupExists.shopCode;
    let shopName = inventoryPostingSetupExists.shopName;
    let shopSlug = inventoryPostingSetupExists.shopSlug;

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
      shopCode = shop.slug;
      shopName = shop.name;
      shopSlug = shop.slug;
    }
    // Perform the update
    const inventoryPostingSetup = await db.inventoryPostingSetup.update({
      where: { id },
      data: {
        description,
        inventoryPostingGroupId,
        inventoryPostingGroupCode,
        inventoryPostingGroupName,
        blocked,
        inventoryAccount,
        shopId,
        shopCode,
        shopName,
        shopSlug,
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
