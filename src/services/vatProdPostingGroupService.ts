import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createVatProductPostingGroup = async (
  vatProductPostingGroup: Prisma.VatProductPostingGroupCreateInput
) => {
  const { code, name } = vatProductPostingGroup;
  //name should be uppercase
  const nameUppercase = name.toUpperCase();
  const codeUppercase = await slugify(code);
  // Check if the code already exists
  const vatProductPostingGroupCodeExists =
    await db.vatProductPostingGroup.findUnique({
      where: {
        code: codeUppercase,
      },
    });
  if (vatProductPostingGroupCodeExists) {
    throw new Error(
      `Vat Product Posting Group with code: ${codeUppercase} already exists`
    );
  }

  try {
    const newVatProductPostingGroup = await db.vatProductPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
      },
    });

    return {
      data: newVatProductPostingGroup,
      message: "Vat Product Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Vat Product Posting Group:", error);
    throw new Error(error.message);
  }
};

const getVatProductPostingGroups = async () => {
  try {
    const vatProductPostingGroups = await db.vatProductPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: vatProductPostingGroups,
      message: "Vat Product Posting Groups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Groups:", error);
    throw new Error(error.message);
  }
};

const getVatProductPostingGroup = async (id: string) => {
  try {
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
    });
    if (!vatProductPostingGroup) {
      throw new Error("Vat Product Posting Group not found");
    }
    return {
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const getVatProductPostingGroupByCode = async (code: string) => {
  try {
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: {
        code,
      },
    });
    if (!vatProductPostingGroup) {
      throw new Error("Vat Product Posting Group not found");
    }
    return {
      data: vatProductPostingGroup,
      message: "Vat Product Posting Group fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${code}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateVatProductPostingGroup = async (
  id: string,
  vatProductPostingGroup: Prisma.VatProductPostingGroupUncheckedCreateInput
) => {
  const { code, name } = vatProductPostingGroup;
  try {
    //check if the vatProductPostingGroup exists
    const vatProductPostingGroupExists =
      await db.vatProductPostingGroup.findUnique({
        where: { id },
      });
    if (!vatProductPostingGroupExists) {
      throw new Error("Vat Product Posting Group not found.");
    }

    //name should be uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : vatProductPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : vatProductPostingGroupExists.code;

    // Check if the code already exists
    if (codeUppercase && codeUppercase !== vatProductPostingGroupExists.code) {
      const vatProdPostingGroupCodeExists =
        await db.vatProductPostingGroup.findUnique({
          where: {
            code: codeUppercase,
          },
        });
      if (vatProdPostingGroupCodeExists) {
        throw new Error(
          `Vat Product Posting Group with code: ${codeUppercase} already exists`
        );
      }
    }

    // Perform the update
    const vatProductPostingGroupUpdated =
      await db.vatProductPostingGroup.update({
        where: { id },
        data: { name: nameUppercase, code: codeUppercase },
      });
    return {
      data: vatProductPostingGroupUpdated,
      message: "Vat Product Posting Group updated successfully",
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${code}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteVatProductPostingGroup = async (id: string) => {
  try {
    // Check if the brand exists
    const vatProductPostingGroup = await db.vatProductPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vatProductPostingGroup) {
      throw new Error("Vat Product Posting Group not found.");
    }
    // Delete the Vat Product Posting Group
    const deletedVatProductPostingGroup =
      await db.vatProductPostingGroup.delete({
        where: { id },
      });
    return {
      data: deletedVatProductPostingGroup,
      message: `Vat Product Posting Group deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Vat Product Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const vatProductPostingGroupService = {
  createVatProductPostingGroup,
  getVatProductPostingGroups,
  getVatProductPostingGroup,
  getVatProductPostingGroupByCode,
  updateVatProductPostingGroup,
  deleteVatProductPostingGroup,
};
