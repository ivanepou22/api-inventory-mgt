import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createVendorPostingGroup = async (
  vendorPostingGroup: Prisma.VendorPostingGroupCreateInput
) => {
  const { code, name, payableAccount } = vendorPostingGroup;

  try {
    //make name uppercase
    const nameUppercase = name.toUpperCase();
    const codeUppercase = await slugify(code);

    // Generate a unique code for the vendor posting group
    const vendorPostingGroupExists = await db.vendorPostingGroup.findUnique({
      where: {
        code: codeUppercase,
      },
    });
    if (vendorPostingGroupExists) {
      throw new Error(
        `Vendor Posting Group with code: ${codeUppercase} already exists`
      );
    }

    const newVendorPostingGroup = await db.vendorPostingGroup.create({
      data: {
        code: codeUppercase,
        name: nameUppercase,
        payableAccount,
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    return {
      data: newVendorPostingGroup,
      message: "Vendor Posting Group created successfully",
    };
  } catch (error: any) {
    console.error("Error creating Vendor Posting Group:", error);
    throw new Error(error.message);
  }
};

const getVendorPostingGroups = async () => {
  try {
    const vendorPostingGroups = await db.vendorPostingGroup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    return {
      data: vendorPostingGroups,
      message: "Vendor Posting Groups fetched successfully",
    };
  } catch (err: any) {
    console.log(err);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

const getVendorPostingGroup = async (id: string) => {
  try {
    const vendorPostingGroup = await db.vendorPostingGroup.findUnique({
      where: {
        id,
      },
      include: {
        supplierLedgerEntries: true,
        PurchaseReceiptHeader: true,
      },
    });
    if (!vendorPostingGroup) {
      throw new Error("Vendor Posting Group not found");
    }
    return {
      data: vendorPostingGroup,
      message: "Vendor Posting Group fetched successfully",
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

const updateVendorPostingGroup = async (
  id: string,
  vendorPostingGroup: Prisma.VendorPostingGroupUncheckedCreateInput
) => {
  const { code, name, payableAccount } = vendorPostingGroup;

  try {
    const vendorPostingGroupExists = await db.vendorPostingGroup.findUnique({
      where: { id },
    });
    if (!vendorPostingGroupExists) {
      throw new Error("Vendor Posting Group not found.");
    }

    //make name uppercase
    const nameUppercase = name
      ? name.toUpperCase()
      : vendorPostingGroupExists.name;
    const codeUppercase = code
      ? await slugify(code)
      : vendorPostingGroupExists.code;

    // Check if the code already exists
    if (codeUppercase && codeUppercase !== vendorPostingGroupExists.code) {
      const vendorPostingGroupCodeExists =
        await db.vendorPostingGroup.findUnique({
          where: {
            code: codeUppercase,
          },
        });
      if (vendorPostingGroupCodeExists) {
        throw new Error(
          `Vendor Posting Group with code: ${codeUppercase} already exists`
        );
      }
    }

    // Perform the update
    // Perform the update
    const updatedVendorPostingGroup = await db.vendorPostingGroup.update({
      where: { id },
      data: { code: codeUppercase, name: nameUppercase, payableAccount },
    });
    return {
      data: updatedVendorPostingGroup,
      message: "Vendor Posting Group updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating Vendor Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

//delete
const deleteVendorPostingGroup = async (id: string) => {
  try {
    // Check if the vendorPostingGroup exists
    const vendorPostingGroup = await db.vendorPostingGroup.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!vendorPostingGroup) {
      throw new Error("Vendor Posting Group not found.");
    }
    // Delete the vendorPostingGroup
    const deletedVendorPostingGroup = await db.vendorPostingGroup.delete({
      where: { id },
    });
    return {
      data: deletedVendorPostingGroup,
      message: `Vendor Posting Group deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Vendor Posting Group:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const vendorPostingGroupService = {
  createVendorPostingGroup,
  getVendorPostingGroups,
  getVendorPostingGroup,
  updateVendorPostingGroup,
  deleteVendorPostingGroup,
};
