import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createShop = async (shop: Prisma.ShopUncheckedCreateInput) => {
  const { name, location, adminId, attendantId } = shop;
  const slug = await slugify(name);
  const shopExists = await db.shop.findUnique({
    where: {
      slug,
    },
  });

  if (shopExists) {
    throw new Error(`Shop with slug: ${slug} already exists`);
  }

  try {
    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantId,
      },
      include: {
        admin: true,
        attendants: true,
      },
    });

    return {
      data: newShop,
      message: "Shop created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Shop:", error);
    throw new Error(error.message);
  }
};

const getShops = async () => {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: true,
        attendants: true,
      },
    });
    return {
      data: shops,
      message: "Shops fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Shops:", error);
    throw new Error(error.message);
  }
};

const getShop = async (id: string) => {
  try {
    const shop = await db.shop.findUnique({
      where: { id },
      include: {
        admin: true,
        attendants: true,
      },
    });
    if (!shop) {
      throw new Error("Shop not found");
    }
    return {
      data: shop,
      message: "Shop fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Shop:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateShop = async (
  id: string,
  shop: Prisma.ShopUncheckedCreateInput
) => {
  const { name, location, adminId, attendantId } = shop;
  try {
    // Find the shop first
    const shopExists = await db.shop.findUnique({
      where: { id },
      include: {
        admin: true,
        attendants: true,
      },
    });

    if (!shopExists) {
      throw new Error("Shop not found");
    }

    let slug = name ? await slugify(name) : shopExists.slug;
    if (name) {
      const shopBySlug = await db.shop.findUnique({
        where: {
          slug,
        },
      });
      if (shopBySlug) {
        throw new Error(`Shop with slug: ${slug} already exists`);
      }
    }
    // Perform the update
    const updatedShop = await db.shop.update({
      where: { id },
      data: { name, slug, location, adminId, attendantId },
      include: {
        attendants: true,
      },
    });
    return {
      data: updatedShop,
      message: "Shop updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Shop:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteShop = async (id: string) => {
  try {
    // Check if the shop exists
    const shop = await db.shop.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!shop) {
      throw new Error("Shop not found");
    }
    // Delete the shop
    const deletedShop = await db.shop.delete({
      where: { id },
    });
    return {
      data: deletedShop,
      message: "Shop deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting Shop:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getShopAttendants = async (id: string) => {
  try {
    const shop = await db.shop.findUnique({
      where: {
        id,
      },
    });
    if (!shop) {
      throw new Error("Shop not found");
    }

    const attendants = await db.user.findMany({
      where: {
        id: {
          in: shop.attendantId,
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
    return {
      data: attendants,
      message: "Attendants fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Shop Attendants:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const shopService = {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
  getShopAttendants,
};
