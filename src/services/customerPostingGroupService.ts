import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

//create a service to create a customerPostingGroup
export const createCustomerPostingGroup = async (
  customerPostingGroup: Prisma.CustomerPostingGroupCreateInput
) => {
  const { code, name, receivableAccount } = customerPostingGroup;
  try {
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    const customerPostingGroupExists = await db.customerPostingGroup.findUnique(
      {
        where: {
          code: codeUppercase,
        },
      }
    );
    if (customerPostingGroupExists) {
      throw new Error(
        `Customer Posting Group with code: ${code} already exists`
      );
    }
    const newCustomerPostingGroup = await db.customerPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        receivableAccount,
      },
    });
    return {
      data: newCustomerPostingGroup,
      message: "Customer Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Customer Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`An unexpected error occurred. Please try again later.`);
    } else {
      throw new Error(error.message);
    }
  }
};

//Get all customerPostingGroups
export const getCustomerPostingGroups = async () => {
  try {
    const customerPostingGroups = await db.customerPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: customerPostingGroups,
      message: "Customer Posting Groups fetched successfully",
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

//Get a customerPostingGroup by id
export const getCustomerPostingGroup = async (id: string) => {
  try {
    const customerPostingGroup = await db.customerPostingGroup.findUnique({
      where: {
        id,
      },
    });
    if (!customerPostingGroup) {
      throw new Error("Customer Posting Group not found.");
    }
    return {
      data: customerPostingGroup,
      message: "Customer Posting Group fetched successfully",
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

//Update a customerPostingGroup
export const updateCustomerPostingGroup = async (
  id: string,
  customerPostingGroup: Prisma.CustomerPostingGroupCreateInput
) => {
  const { code, name, receivableAccount } = customerPostingGroup;
  try {
    const customerPostingGroupExists = await db.customerPostingGroup.findUnique(
      {
        where: { id },
        select: { id: true, code: true, name: true, receivableAccount: true },
      }
    );
    if (!customerPostingGroupExists) {
      throw new Error("Customer Posting Group not found.");
    }

    const nameUppercase = name
      ? name.toUpperCase()
      : customerPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : customerPostingGroupExists.code;

    // Check if the code already exists
    if (codeUppercase && codeUppercase !== customerPostingGroupExists.code) {
      const customerPostingGroupCodeExists =
        await db.customerPostingGroup.findUnique({
          where: {
            code: codeUppercase,
          },
        });
      if (customerPostingGroupCodeExists) {
        throw new Error(
          `Customer Posting Group with code: ${codeUppercase} already exists`
        );
      }
    }
    // Perform the update
    const updatedCustomerPostingGroup = await db.customerPostingGroup.update({
      where: { id },
      data: { code: codeUppercase, name: nameUppercase, receivableAccount },
    });
    return {
      data: updatedCustomerPostingGroup,
      message: "Customer Posting Group updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Customer Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

//create a service to delete a customerPostingGroup
export const deleteCustomerPostingGroup = async (id: string) => {
  try {
    // Check if the customerPostingGroup exists
    const customerPostingGroup = await db.customerPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!customerPostingGroup) {
      throw new Error("Customer Posting Group not found.");
    }
    // Delete the customerPostingGroup
    const deletedCustomerPostingGroup = await db.customerPostingGroup.delete({
      where: { id },
    });
    return {
      data: deletedCustomerPostingGroup,
      message: `Customer Posting Group deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Customer Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const customerPostingGroupService = {
  createCustomerPostingGroup,
  getCustomerPostingGroups,
  getCustomerPostingGroup,
  updateCustomerPostingGroup,
  deleteCustomerPostingGroup,
};
