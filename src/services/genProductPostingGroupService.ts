import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createGenProductPostingGroup = async (
  genProductPostingGroup: Prisma.GeneralProductPostingGroupUncheckedCreateInput
) => {
  const { code, name, defVatProductPostingGroupId, autoInsertDefault } =
    genProductPostingGroup;

  try {
    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    //check if the code is unique
    const genProductPostingGroupCodeExists =
      await db.generalProductPostingGroup.findUnique({
        where: { code: codeUppercase },
      });
    if (genProductPostingGroupCodeExists) {
      throw new Error(
        `General Product Posting Group code: ${codeUppercase} already exists`
      );
    }

    const genProductPostingGroup = await db.generalProductPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        autoInsertDefault,
        defVatProductPostingGroupId,
      },
      include: {
        vatProductPostingGroup: true,
      },
    });

    return {
      data: genProductPostingGroup,
      message: "General Product Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating General Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getGenProductPostingGroups = async () => {
  try {
    const genProductPostingGroups =
      await db.generalProductPostingGroup.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          vatProductPostingGroup: true,
        },
      });
    return {
      data: genProductPostingGroups,
      message: "General Product Posting Groups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching General Product Posting Groups:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching General Product Posting Groups.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getGenProductPostingGroup = async (id: string) => {
  try {
    const genProductPostingGroup =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
        include: {
          vatProductPostingGroup: true,
        },
      });

    if (!genProductPostingGroup) {
      throw new Error("General Product Posting Group not found");
    }

    return {
      data: genProductPostingGroup,
      message: "General Product Posting Group fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching General Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while fetching the General Product Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateGenProductPostingGroup = async (
  id: string,
  genProductPostingGroup: Prisma.GeneralProductPostingGroupUncheckedCreateInput
) => {
  const { code, name, defVatProductPostingGroupId, autoInsertDefault } =
    genProductPostingGroup;

  try {
    // Check if the genProductPostingGroup exists
    const genProductPostingGroupExists =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
        select: {
          id: true,
          code: true,
          name: true,
          defVatProductPostingGroupId: true,
          autoInsertDefault: true,
        },
      });
    if (!genProductPostingGroupExists) {
      throw new Error("General Product Posting Group not found");
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : genProductPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : genProductPostingGroupExists.code;

    // Perform the update
    const updatedGenProductPostingGroup =
      await db.generalProductPostingGroup.update({
        where: { id },
        data: {
          code: codeUppercase,
          name: nameUppercase,
          defVatProductPostingGroupId,
          autoInsertDefault,
        },
        include: {
          vatProductPostingGroup: true,
        },
      });
    return {
      data: updatedGenProductPostingGroup,
      message: "General Product Posting Group updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating General Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while updating the General Product Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteGenProductPostingGroup = async (id: string) => {
  try {
    const genProductPostingGroup =
      await db.generalProductPostingGroup.findUnique({
        where: { id },
      });
    if (!genProductPostingGroup) {
      throw new Error("General Product Posting Group not found.");
    }

    const genProductPostingGroupDeleted =
      await db.generalProductPostingGroup.delete({
        where: { id },
      });
    return {
      data: genProductPostingGroupDeleted,
      message: "General Product Posting Group deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting General Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `An unexpected error occurred while deleting the General Product Posting Group: ${error.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const genProductPostingGroupService = {
  createGenProductPostingGroup,
  getGenProductPostingGroups,
  getGenProductPostingGroup,
  updateGenProductPostingGroup,
  deleteGenProductPostingGroup,
};
