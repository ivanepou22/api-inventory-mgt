import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createVatBusPostingGroup = async (
  vatBusPostingGroup: Prisma.VatBusPostingGroupCreateInput
) => {
  const { code, name } = vatBusPostingGroup;
  //name should be uppercase
  const nameUppercase = name.toUpperCase();
  const codeUppercase = await slugify(code);
  // Check if the code already exists
  const vatBusPostingGroupCodeExists = await db.vatBusPostingGroup.findUnique({
    where: {
      code: codeUppercase,
    },
  });
  if (vatBusPostingGroupCodeExists) {
    throw new Error(
      `Vat Bus Posting Group with code: ${codeUppercase} already exists`
    );
  }

  try {
    const newVatBusPostingGroup = await db.vatBusPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
      },
    });

    return {
      data: newVatBusPostingGroup,
      message: "Vat Bus Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Vat Bus Posting Group:", error);
    throw new Error(error.message);
  }
};

const getVatBusPostingGroups = async () => {
  try {
    const vatBusPostingGroups = await db.vatBusPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        GenBusPostingGroup: true,
      },
    });
    return {
      data: vatBusPostingGroups,
      message: "Vat Bus Posting Groups fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Groups:", error);
    throw new Error(error.message);
  }
};

const getVatBusPostingGroup = async (id: string) => {
  try {
    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id },
    });
    if (!vatBusPostingGroup) {
      throw new Error("Vat Bus Posting Group not found");
    }
    return {
      data: vatBusPostingGroup,
      message: "Vat Bus Posting Group fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching Vat Bus Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateVatBusPostingGroup = async (
  id: string,
  vatBusPostingGroup: Prisma.VatBusPostingGroupUpdateInput
) => {
  const { code, name }: any = vatBusPostingGroup;

  //check if the vatBusPostingGroup exists
  const vatBusPostingGroupExists = await db.vatBusPostingGroup.findUnique({
    where: { id },
  });
  if (!vatBusPostingGroupExists) {
    throw new Error("Vat Bus Posting Group not found.");
  }

  //name should be uppercase
  const nameUppercase = name
    ? name.toUpperCase()
    : vatBusPostingGroupExists.name;
  const codeUppercase = code
    ? await slugify(code)
    : vatBusPostingGroupExists.code;

  // Check if the code already exists
  if (codeUppercase && codeUppercase !== vatBusPostingGroupExists.code) {
    const vatBusPostingGroupCodeExists = await db.vatBusPostingGroup.findUnique(
      {
        where: {
          code: codeUppercase,
        },
      }
    );
    if (vatBusPostingGroupCodeExists) {
      throw new Error(
        `Vat Bus Posting Group with code: ${codeUppercase} already exists`
      );
    }
  }

  // Perform the update
  const vatBusPostingGroupUpdated = await db.vatBusPostingGroup.update({
    where: { id },
    data: {
      name: nameUppercase,
      code: codeUppercase,
    },
  });
  return {
    data: vatBusPostingGroupUpdated,
    message: "Vat Bus Posting Group updated successfully",
  };
};

const deleteVatBusPostingGroup = async (id: string) => {
  try {
    // Check if the brand exists
    const vatBusPostingGroup = await db.vatBusPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vatBusPostingGroup) {
      throw new Error("Vat Bus Posting Group not found.");
    }
    // Delete the Vat Bus Posting Group
    const deletedVatBusPostingGroup = await db.vatBusPostingGroup.delete({
      where: { id },
    });
    return {
      data: deletedVatBusPostingGroup,
      message: `Vat Bus Posting Group deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Vat Bus Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const vatBusPostingGroupService = {
  createVatBusPostingGroup,
  getVatBusPostingGroups,
  getVatBusPostingGroup,
  updateVatBusPostingGroup,
  deleteVatBusPostingGroup,
};
