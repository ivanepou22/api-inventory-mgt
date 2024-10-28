import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { setNoSeries, updateNoSeries } from "@/utils/noSeriesManagement";

class SupplierService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }
  createSupplier = async (supplier: Prisma.SupplierUncheckedCreateInput) => {
    const {
      supplierType,
      name,
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
      address,
      address_2,
      rating,
      note,
      vendorPostingGroupId,
      genBusPostingGroupId,
      vatBusPostingGroupId,
      userId,
    } = supplier;

    try {
      const supplierNo = await setNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "vendorNos"
      );
      const supplierEx = await this.findUnique(
        (args) => this.db.supplier.findUnique(args),
        {
          where: {
            tenantId_companyId_No: {
              No: supplierNo,
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
            },
          },
        }
      );
      if (supplierEx) {
        throw new Error(
          `No: ${supplierNo} is Already in use by another Supplier`
        );
      }

      const newSupplier = await this.create(
        (args) => this.db.supplier.create(args),
        {
          data: {
            supplierType,
            name,
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
            address,
            address_2,
            rating,
            note,
            vendorPostingGroupId,
            genBusPostingGroupId,
            vatBusPostingGroupId,
            userId,
            companyId: this.getCompanyId,
            tenantId: this.getTenantId,
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
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        }
      );

      await updateNoSeries(
        this.getTenantId(),
        this.getCompanyId(),
        "vendorNos"
      );

      return {
        data: newSupplier,
        message: "Supplier created Successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  getSuppliers = async () => {
    try {
      const suppliers = await this.findMany(
        (args) => this.db.supplier.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
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
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        }
      );
      return {
        data: suppliers,
        message: "Suppliers fetched successfully",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  getSupplier = async (id: string) => {
    try {
      const supplier = await this.findUnique(
        (args) => this.db.supplier.findUnique(args),
        {
          where: {
            id,
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
            company: {
              select: {
                code: true,
                name: true,
              },
            },
            tenant: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        }
      );
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

  updateSupplier = async (
    id: string,
    supplier: Prisma.SupplierUncheckedCreateInput
  ) => {
    const {
      supplierType,
      name,
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
      address,
      address_2,
      rating,
      note,
      vendorPostingGroupId,
      genBusPostingGroupId,
      vatBusPostingGroupId,
    } = supplier;
    try {
      const existingSupplier = await this.findUnique(
        (args) => this.db.supplier.findUnique(args),
        {
          where: { id },
        }
      );
      if (!existingSupplier) {
        throw new Error("Supplier not found.");
      }

      const updatedSupplier = await this.update(
        (args) => this.db.supplier.update(args),
        {
          where: { id },
          data: {
            supplierType,
            name,
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
            address,
            address_2,
            rating,
            note,
            vendorPostingGroupId,
            genBusPostingGroupId,
            vatBusPostingGroupId,
          },
        }
      );

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

  deleteSupplier = async (id: string) => {
    try {
      const existingSupplier = await this.findUnique(
        (args) => this.db.supplier.findUnique(args),
        {
          where: { id },
        }
      );

      if (!existingSupplier) {
        throw new Error("Supplier not found");
      }

      await this.delete((args) => this.db.supplier.delete(args), {
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
}

// Export the service
export const supplierService = (): SupplierService => {
  return new SupplierService(db);
};
