import { db } from "@/db/db";
import { Request, Response } from "express";

export const createShop = async (req: Request, res: Response) => {
  const { name, slug, location, adminId, attendantIds } = req.body;

  const shopExists = await db.shop.findUnique({
    where: {
      slug,
    },
  });

  if (shopExists) {
    return res.status(409).json({
      error: `Shop with slug: ${slug} already exists`,
    });
  }

  try {
    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantIds,
      },
    });

    return res.status(201).json({
      data: newShop,
      error: null,
      message: "Shop created successfully",
    });
  } catch (error) {
    console.error("Error creating Shop:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getShops = async (_req: Request, res: Response) => {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: shops,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const shop = await db.shop.findUnique({
      where: {
        id,
      },
    });
    if (!shop) {
      return res.status(404).json({
        data: null,
        error: `Shop not found.`,
      });
    }
    return res.status(200).json({
      data: shop,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, slug, location, adminId, attendantIds } = req.body;

  try {
    // Find the shop first
    const shopExists = await db.shop.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!shopExists) {
      return res.status(404).json({ error: "Shop not found." });
    }

    // Perform the update
    const updatedShop = await db.shop.update({
      where: { id },
      data: { name, slug, location, adminId, attendantIds },
    });

    return res
      .status(200)
      .json({ data: updatedShop, message: "Shop updated successfully" });
  } catch (error: any) {
    console.error("Error updating Shop:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Delete Shop
export const deleteShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the shop exists
    const shop = await db.shop.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!shop) {
      return res.status(404).json({ error: "Shop not found." });
    }
    // Delete the Shop
    const deletedShop = await db.shop.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedShop,
      message: `Shop deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Shop:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getShopAttendants = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const shop = await db.shop.findUnique({
      where: {
        id,
      },
    });
    if (!shop) {
      return res.status(404).json({
        data: null,
        error: `Shop not found.`,
      });
    }

    const attendants = await db.user.findMany({
      where: {
        id: {
          in: shop.attendantIds,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({
      data: attendants,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};
