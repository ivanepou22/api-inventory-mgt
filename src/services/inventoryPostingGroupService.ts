import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createInventoryPostingGroup = async (
  inventoryPostingGroup: Prisma.InventoryPostingGroupUncheckedCreateInput
) => {
  const { name } = inventoryPostingGroup;

  try {
    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const code = await slugify(nameUppercase);

    const newInventoryPostingGroup = await db.inventoryPostingGroup.create({
      data: {
        code,
        name: nameUppercase,
      },
    });
    return {
      data: newInventoryPostingGroup,
      message: "Inventory Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Inventory Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getInventoryPostingGroups = async () => {
  try {
    const inventoryPostingGroups = await db.inventoryPostingGroup.findMany();
    return {
      data: inventoryPostingGroups,
      message: "Inventory Posting Groups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Groups:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching Inventory Posting Groups.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getInventoryPostingGroup = async (id: string) => {
  try {
    const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
      where: { id },
    });

    if (!inventoryPostingGroup) {
      throw new Error("Inventory Posting Group not found");
    }

    return {
      data: inventoryPostingGroup,
      message: "Inventory Posting Group fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Inventory Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching the Inventory Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateInventoryPostingGroup = async (
  id: string,
  inventoryPostingGroup: Prisma.InventoryPostingGroupUncheckedCreateInput
) => {
  const { code, name } = inventoryPostingGroup;

  try {
    // Check if the inventoryPostingGroup exists
    const inventoryPostingGroupExists =
      await db.inventoryPostingGroup.findUnique({
        where: { id },
        select: { id: true, code: true, name: true },
      });
    if (!inventoryPostingGroupExists) {
      throw new Error("Inventory Posting Group not found");
    }

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = code
      ? await slugify(code)
      : inventoryPostingGroupExists.code;

    // Perform the update
    const updatedInventoryPostingGroup = await db.inventoryPostingGroup.update({
      where: { id },
      data: {
        code: codeUppercase,
        name: nameUppercase,
      },
    });
    return {
      data: updatedInventoryPostingGroup,
      message: "Inventory Posting Group updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Inventory Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while updating the Inventory Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteInventoryPostingGroup = async (id: string) => {
  try {
    // Check if the inventoryPostingGroup exists
    const inventoryPostingGroup = await db.inventoryPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!inventoryPostingGroup) {
      throw new Error("Inventory Posting Group not found.");
    }

    const inventoryPostingGroupDeleted = await db.inventoryPostingGroup.delete({
      where: { id },
    });
    return {
      data: inventoryPostingGroupDeleted,
      message: `Inventory Posting Group deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Inventory Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while deleting the Inventory Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const inventoryPostingGroupService = {
  createInventoryPostingGroup,
  getInventoryPostingGroups,
  getInventoryPostingGroup,
  updateInventoryPostingGroup,
  deleteInventoryPostingGroup,
};
