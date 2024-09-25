import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createGenBusPostingGroup = async (
  genBusPostingGroup: Prisma.GenBusPostingGroupUncheckedCreateInput
) => {
  try {
    const { code, name, defVatBusPostingGroupId, autoInsertDefault } =
      genBusPostingGroup;

    //name should be uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    //check if the code is unique
    const genBusPostingGroupCodeExists = await db.genBusPostingGroup.findUnique(
      {
        where: { code: codeUppercase },
      }
    );
    if (genBusPostingGroupCodeExists) {
      throw new Error(
        `Gen Bus Posting Group code: ${codeUppercase} already exists`
      );
    }

    const newGenBusPostingGroup = await db.genBusPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        defVatBusPostingGroupId,
        autoInsertDefault,
      },
      include: {
        vatBusPostingGroup: true,
      },
    });

    return {
      data: newGenBusPostingGroup,
      message: "Gen Bus Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Gen Bus Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

const getGenBusPostingGroups = async () => {
  try {
    const genBusPostingGroups = await db.genBusPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vatBusPostingGroup: true,
      },
    });
    return {
      data: genBusPostingGroups,
      message: "Gen Bus Posting Groups fetched successfully",
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

const getGenBusPostingGroup = async (id: string) => {
  try {
    const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
      where: {
        id,
      },
      include: {
        vatBusPostingGroup: true,
      },
    });
    if (!genBusPostingGroup) {
      throw new Error("Gen Bus Posting Group not found.");
    }
    return {
      data: genBusPostingGroup,
      message: "Gen Bus Posting Group fetched successfully",
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

const updateGenBusPostingGroup = async (
  id: string,
  genBusPostingGroup: Prisma.GenBusPostingGroupUncheckedCreateInput
) => {
  const { code, name, defVatBusPostingGroupId, autoInsertDefault } =
    genBusPostingGroup;

  try {
    //check if the genBusPostingGroup exists
    const genBusPostingGroupExists = await db.genBusPostingGroup.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        defVatBusPostingGroupId: true,
        vatBusPostingGroup: true,
      },
    });

    if (!genBusPostingGroupExists) {
      throw new Error("Gen Bus Posting Group not found");
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : genBusPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : genBusPostingGroupExists.code;

    //check for duplicate code
    if (codeUppercase && codeUppercase !== genBusPostingGroupExists.code) {
      const genBusPostingGroupCodeExists =
        await db.genBusPostingGroup.findUnique({
          where: { code: codeUppercase },
        });

      if (genBusPostingGroupCodeExists) {
        throw new Error("Gen Bus Posting Group code already exists");
      }
    }

    // Perform the update
    const genBusPostingGroup = await db.genBusPostingGroup.update({
      where: { id },
      data: {
        code: codeUppercase,
        name: nameUppercase,
        defVatBusPostingGroupId,
        autoInsertDefault,
      },
    });
    return {
      data: genBusPostingGroup,
      message: "Gen Bus Posting Group updated successfully",
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

const deleteGenBusPostingGroup = async (id: string) => {
  try {
    // Check if the genBusPostingGroup exists
    const genBusPostingGroup = await db.genBusPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!genBusPostingGroup) {
      throw new Error("Gen Bus Posting Group not found.");
    }
    // Delete the genBusPostingGroup
    const deletedGenBusPostingGroup = await db.genBusPostingGroup.delete({
      where: { id },
    });
    return {
      data: deletedGenBusPostingGroup,
      message: `Gen Bus Posting Group deleted successfully`,
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

export const genBusPostingGroupService = {
  createGenBusPostingGroup,
  getGenBusPostingGroups,
  getGenBusPostingGroup,
  updateGenBusPostingGroup,
  deleteGenBusPostingGroup,
};
