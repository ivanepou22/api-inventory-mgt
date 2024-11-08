import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

export class SupplierContactService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createSupplierContact(
    supplierContact: Prisma.SupplierContactUncheckedCreateInput
  ) {
    const { supplierId, contactId } = supplierContact;
    try {
      const supplierContactExists = await this.findUnique(
        (args) => this.db.supplierContact.findUnique(args),
        {
          where: {
            tenantId_companyId_supplierId_contactId: {
              supplierId,
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
              contactId,
            },
          },
        }
      );
      if (supplierContactExists) {
        throw new Error("Supplier Contact already exists.");
      }
      const newSupplierContact = await this.create(
        (args) => this.db.supplierContact.create(args),
        {
          data: {
            ...supplierContact,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
            supplier: {
              select: {
                id: true,
                supplierNo: true,
                name: true,
                phone: true,
                email: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                taxPin: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );
      return {
        data: newSupplierContact,
        message: "SupplierContact created successfully",
      };
    } catch (error: any) {
      console.error("Error creating SupplierContact:", error);
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Check if the error message contains the word "Argument"
        const argumentIndex = errorMessage.toLowerCase().indexOf("argument");
        if (argumentIndex !== -1) {
          // Extract the message after "Argument"
          const relevantError = errorMessage.slice(argumentIndex);
          throw new Error(relevantError);
        } else {
          // For other types of errors, you might want to log the full error
          // and throw a generic message to the user
          console.error("Full error:", error);
          throw new Error(error.message);
        }
      } else {
        // Handle case where error is not an Error object
        throw new Error("An unexpected error occurred.");
      }
    }
  }

  async getSupplierContacts() {
    try {
      const supplierContacts = await this.findMany(
        (args) => this.db.supplierContact.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            supplier: {
              select: {
                id: true,
                supplierNo: true,
                name: true,
                phone: true,
                email: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                taxPin: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );
      return {
        data: supplierContacts,
        message: "SupplierContacts fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getSupplierContact(id: string) {
    try {
      const supplierContact = await this.findUnique(
        (args) => this.db.supplierContact.findUnique(args),
        {
          where: { id },
          include: {
            supplier: {
              select: {
                id: true,
                supplierNo: true,
                name: true,
                phone: true,
                email: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                taxPin: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );

      if (!supplierContact) {
        throw new Error("SupplierContact not found.");
      }

      return {
        data: supplierContact,
        message: "SupplierContact fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateSupplierContact(
    id: string,
    supplierContact: Prisma.SupplierContactUncheckedCreateInput
  ) {
    const { supplierId, contactId } = supplierContact;
    try {
      const supplierContactExists = await this.findUnique(
        (args) => this.db.supplierContact.findUnique(args),
        {
          where: { id },
        }
      );
      if (!supplierContactExists) {
        throw new Error("SupplierContact not found.");
      }

      if (
        contactId &&
        contactId !== supplierContact.contactId &&
        supplierId &&
        supplierId !== supplierContact.supplierId
      ) {
        const supplierContact = await this.findUnique(
          (args) => this.db.supplierContact.findUnique(args),
          {
            where: {
              tenantId_companyId_supplierId_contactId: {
                supplierId,
                tenantId: this.getTenantId(),
                companyId: this.getCompanyId(),
                contactId,
              },
            },
          }
        );
        if (supplierContact) {
          throw new Error("Supplier Contact already exists.");
        }
      } else if (contactId && contactId !== supplierContactExists.contactId) {
        const supplierContact = await this.findUnique(
          (args) => this.db.supplierContact.findUnique(args),
          {
            where: {
              tenantId_companyId_supplierId_contactId: {
                supplierId: supplierContactExists.supplierId,
                tenantId: this.getTenantId(),
                companyId: this.getCompanyId(),
                contactId,
              },
            },
          }
        );
        if (supplierContact) {
          throw new Error("Supplier Contact already exists.");
        }
      } else if (
        supplierId &&
        supplierId !== supplierContactExists.supplierId
      ) {
        const supplierContact = await this.findUnique(
          (args) => this.db.supplierContact.findUnique(args),
          {
            where: {
              tenantId_companyId_supplierId_contactId: {
                supplierId,
                tenantId: this.getTenantId(),
                companyId: this.getCompanyId(),
                contactId: supplierContactExists.contactId,
              },
            },
          }
        );
        if (supplierContact) {
          throw new Error("Supplier Contact already exists.");
        }
      }
      const updatedSupplierContact = await this.update(
        (args) => this.db.supplierContact.update(args),
        {
          where: { id },
          data: supplierContact,
          include: {
            supplier: {
              select: {
                id: true,
                supplierNo: true,
                name: true,
                phone: true,
                email: true,
                country: true,
                address: true,
                address_2: true,
                website: true,
                taxPin: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            contact: {
              select: {
                id: true,
                code: true,
                name: true,
                phone: true,
                email: true,
                image: true,
                companyId: true,
                tenantId: true,
                userId: true,
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
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
              },
            },
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
          },
        }
      );

      return {
        data: updatedSupplierContact,
        message: "SupplierContact updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteSupplierContact(id: string) {
    try {
      const supplierContact = await this.findUnique(
        (args) => this.db.supplierContact.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!supplierContact) {
        throw new Error("SupplierContact not found.");
      }
      const deletedSupplierContact = await this.delete(
        (args) => this.db.supplierContact.delete(args),
        { where: { id } }
      );
      return {
        data: deletedSupplierContact,
        message: `SupplierContact deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

export const supplierContactService = (): SupplierContactService => {
  return new SupplierContactService(db);
};
