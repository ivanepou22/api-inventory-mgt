import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

//create a service to create a bank account posting group
export const createBankAccountPostingGroup = async (
  bankAccountPostingGroup: Prisma.BankAccountPostingGroupUncheckedCreateInput
) => {
  const { code, description, GLAccount, companyId, tenantId } =
    bankAccountPostingGroup;

    const bankAccountPostingGroupExists = await db.bankAccountPostingGroup.findUnique({
      where: {
        code,
      },
    });
    if (bankAccountPostingGroupExists) {
      throw new Error(`Bank account posting group with code: ${code} already exists`);
    }
    try {
      const newBankAccountPostingGroup = await db.bankAccountPostingGroup.create({
        data: {
          code,
          description,
          GLAccount,
          companyId,
          tenantId,
        },
      });
      return {
        data: newBankAccountPostingGroup,
        error: null,
        message: "Bank account posting group created successfully",
      };
    } catch (error: any) {
      console.error("Error creating BankAccountPostingGroup:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`An unexpected error occurred. Please try again later.`);
      } else {
        throw new Error(error.message);
      }
    }
  };

//Get all bank account posting groups
export const getBankAccountPostingGroups = async () => {
  try {
    const bankAccountPostingGroups = await db.bankAccountPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: bankAccountPostingGroups,
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

//Get a bank account posting group by id
export const getBankAccountPostingGroup = async (id: string) => {
  try {
    const bankAccountPostingGroup = await db.bankAccountPostingGroup.findUnique({
      where: {
        id,
      },
    });
    if (!bankAccountPostingGroup) {
      throw new Error("Bank account posting group not found.");
    }

    return {
      data: bankAccountPostingGroup,
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

//Update a bank account posting group
export const updateBankAccountPostingGroup = async (
  id: string,
  bankAccountPostingGroup: Prisma.BankAccountPostingGroupUncheckedCreateInput
) => {
  const { code, description, GLAccount, companyId, tenantId } =
    bankAccountPostingGroup;
  try {
    const bankAccountPostingGroupExists = await db.bankAccountPostingGroup.findUnique({
      where: { id },
      select: { id: true, code: true, description: true, GLAccount: true },
    });
    if (!bankAccountPostingGroupExists) {
      throw new Error("Bank account posting group not found.");
    }
    if (code && code !== bankAccountPostingGroupExists.code) {
      const bankAccountPostingGroupByCode = await db.bankAccountPostingGroup.findUnique({
        where: {
          code,
        },
      });
      if (bankAccountPostingGroupByCode) {
        throw new Error(`Bank account posting group with code: ${code} already exists`);
      }
    }
    // Perform the update    
    const updatedBankAccountPostingGroup = await db.bankAccountPostingGroup.update({
      where: { id },
      data: { code, description, GLAccount, companyId, tenantId },
    });
    return { data: updatedBankAccountPostingGroup, message: "Bank account posting group updated successfully" };
  } catch (error: any) {
    console.error("Error updating BankAccountPostingGroup:", error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};
