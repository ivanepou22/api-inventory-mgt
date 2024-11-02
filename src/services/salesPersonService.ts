import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

class SalesPersonService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createSalesPerson(salesPerson: Prisma.SalesPersonUncheckedCreateInput) {
    const { code } = salesPerson;
    try {
      const salesPersonExists = await this.findUnique(
        (args) => this.db.salesPerson.findUnique(args),
        {
          where: {
            tenantId_companyId_code: {
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
              code,
            },
          },
        }
      );
      if (salesPersonExists) {
        throw new Error("SalesPerson already exists.");
      }
      const newSalesPerson = await this.create(
        (args) => this.db.salesPerson.create(args),
        {
          data: {
            ...salesPerson,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
            customer: {
              select: {
                id: true,
                no: true,
                name: true,
                email: true,
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
        data: newSalesPerson,
        message: "SalesPerson created successfully",
      };
    } catch (error: any) {
      console.error("Error creating SalesPerson:", error);
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

  async getSalesPersons() {
    try {
      const salesPersons = await this.findMany(
        (args) => this.db.salesPerson.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            customer: {
              select: {
                id: true,
                no: true,
                name: true,
                email: true,
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
        data: salesPersons,
        message: "SalesPersons fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getSalesPerson(id: string) {
    try {
      const salesPerson = await this.findUnique(
        (args) => this.db.salesPerson.findUnique(args),
        {
          where: { id },
          include: {
            customer: {
              select: {
                id: true,
                no: true,
                name: true,
                email: true,
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

      if (!salesPerson) {
        throw new Error("SalesPerson not found.");
      }

      return {
        data: salesPerson,
        message: "SalesPerson fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateSalesPerson(
    id: string,
    salesPersonData: Prisma.SalesPersonUncheckedCreateInput
  ) {
    const { code } = salesPersonData;
    try {
      const salesPersonExists = await this.findUnique(
        (args) => this.db.salesPerson.findUnique(args),
        {
          where: { id },
        }
      );
      if (!salesPersonExists) {
        throw new Error("SalesPerson not found.");
      }
      if (code && code !== salesPersonExists.code) {
        const salesPerson = await this.findUnique(
          (args) => this.db.salesPerson.findUnique(args),
          {
            where: {
              tenantId_companyId_code: {
                tenantId: this.getTenantId(),
                companyId: this.getCompanyId(),
                code,
              },
            },
          }
        );
        if (salesPerson) {
          throw new Error("SalesPerson already exists.");
        }
      }
      const updatedSalesPerson = await this.update(
        (args) => this.db.salesPerson.update(args),
        {
          where: { id },
          data: salesPersonData,
          include: {
            customer: {
              select: {
                id: true,
                no: true,
                name: true,
                email: true,
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
        data: updatedSalesPerson,
        message: "SalesPerson updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteSalesPerson(id: string) {
    try {
      const salesPerson = await this.findUnique(
        (args) => this.db.salesPerson.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!salesPerson) {
        throw new Error("SalesPerson not found.");
      }
      const deletedSalesPerson = await this.delete(
        (args) => this.db.salesPerson.delete(args),
        { where: { id } }
      );
      return {
        data: deletedSalesPerson,
        message: `SalesPerson deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

// Export the service
export const salesPersonService = (): SalesPersonService => {
  return new SalesPersonService(db);
};
