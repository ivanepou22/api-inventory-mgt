import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

const createSupplier = async (
  supplier: Prisma.SupplierUncheckedCreateInput
) => {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    country,
    location,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    note,
  } = supplier;

  try {
    const supplierByPhone = await db.supplier.findUnique({
      where: {
        phone,
      },
    });
    if (supplierByPhone) {
      throw new Error(
        `Phone Number: ${phone} is Already in use by another Supplier`
      );
    }

    if (email) {
      const supplierByEmail = await db.supplier.findUnique({
        where: {
          email,
        },
      });
      if (supplierByEmail) {
        throw new Error(
          `Email: ${email} is Already in use by another Supplier`
        );
      }
    }

    if (regNumber) {
      const supplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber,
        },
      });
      if (supplierByRegNumber) {
        throw new Error(
          `Registration Number: ${regNumber} is Already in use by another Supplier`
        );
      }
    }

    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        country,
        location,
        website,
        taxPin,
        regNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        note,
      },
      include: {
        products: true,
        PurchaseHeaders: true,
        SupplierLedgerEntries: true,
        PurchaseReceiptHeaders: true,
        PurchaseLines: true,
        PurchaseReceiptLines: true,
        vendorPostingGroup: true,
        genBusPostingGroup: true,
        vatBusPostingGroup: true,
      },
    });

    return {
      data: newSupplier,
      message: "Supplier created Successfully.",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const getSuppliers = async () => {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: suppliers,
      message: "Suppliers fetched successfully",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const getSupplier = async (id: string) => {
  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id,
      },
    });
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return {
      data: supplier,
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

const updateSupplier = async (
  id: string,
  supplier: Prisma.SupplierUncheckedCreateInput
) => {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    country,
    location,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    note,
  } = supplier;
  try {
    const existingSupplier = await db.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      throw new Error("Supplier not found.");
    }

    if (phone && phone !== existingSupplier.phone) {
      const supplierByPhone = await db.supplier.findUnique({
        where: {
          phone,
        },
      });
      if (supplierByPhone) {
        throw new Error(
          `Phone Number: ${phone} is Already in use by another Supplier`
        );
      }
    }

    if (email && email !== existingSupplier.email) {
      const supplierByEmail = await db.supplier.findUnique({
        where: {
          email,
        },
      });
      if (supplierByEmail) {
        throw new Error(
          `Email: ${email} is Already in use by another Supplier`
        );
      }
    }

    if (regNumber && regNumber !== existingSupplier.regNumber) {
      const supplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber,
        },
      });
      if (supplierByRegNumber) {
        throw new Error(
          `Registration Number: ${regNumber} is Already in use by another Supplier`
        );
      }
    }
    const updatedSupplier = await db.supplier.update({
      where: { id },
      data: {
        supplierType: supplierType || existingSupplier.supplierType,
        name: name || existingSupplier.name,
        contactPerson: contactPerson || existingSupplier.contactPerson,
        phone: phone || existingSupplier.phone,
        email: email || existingSupplier.email,
        country: country || existingSupplier.country,
        location: location || existingSupplier.location,
        website: website || existingSupplier.website,
        taxPin: taxPin || existingSupplier.taxPin,
        regNumber: regNumber || existingSupplier.regNumber,
        bankAccountNumber:
          bankAccountNumber || existingSupplier.bankAccountNumber,
        bankName: bankName || existingSupplier.bankName,
        paymentTerms: paymentTerms || existingSupplier.paymentTerms,
        logo: logo || existingSupplier.logo,
        rating: rating || existingSupplier.rating,
        note: note || existingSupplier.note,
      },
    });

    return {
      data: updatedSupplier,
      message: `Supplier updated successfully`,
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

const deleteSupplier = async (id: string) => {
  try {
    const existingSupplier = await db.supplier.findUnique({
      where: { id },
    });

    if (!existingSupplier) {
      throw new Error("Supplier not found");
    }

    await db.supplier.delete({
      where: { id },
    });

    return {
      message: `Supplier deleted successfully`,
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

export const supplierService = {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
