import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

export class NoSeriesSetupService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createNoSeriesSetup(
    noSeriesSetup: Prisma.NoSeriesSetupUncheckedCreateInput
  ) {
    try {
      const newNoSeriesSetup = await this.create(
        (args) => this.db.noSeriesSetup.create(args),
        {
          data: {
            ...noSeriesSetup,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
          include: {
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
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
        data: newNoSeriesSetup,
        message: "NoSeriesSetup created successfully",
      };
    } catch (error: any) {
      console.error("Error creating NoSeriesSetup:", error);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getNoSeriesSetups() {
    try {
      const noSeriesSetups = await this.findMany(
        (args) => this.db.noSeriesSetup.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
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
        data: noSeriesSetups,
        message: "NoSeriesSetups fetched successfully",
      };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(`An unexpected error occurred. Please try again later.`);
    }
  }

  async getNoSeriesSetup(id: string) {
    try {
      const noSeriesSetup = await this.findUnique(
        (args) => this.db.noSeriesSetup.findUnique(args),
        {
          where: { id },
          include: {
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
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

      if (!noSeriesSetup) {
        throw new Error("NoSeriesSetup not found.");
      }

      return {
        data: noSeriesSetup,
        message: "NoSeriesSetup fetched successfully",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateNoSeriesSetup(
    id: string,
    noSeriesSetupData: Prisma.NoSeriesSetupUncheckedCreateInput
  ) {
    try {
      const noSeriesSetupExists = await this.findUnique(
        (args) => this.db.noSeriesSetup.findUnique(args),
        {
          where: { id },
        }
      );
      if (!noSeriesSetupExists) {
        throw new Error("NoSeriesSetup not found.");
      }
      const updatedNoSeriesSetup = await this.update(
        (args) => this.db.noSeriesSetup.update(args),
        {
          where: { id },
          data: noSeriesSetupData,
          include: {
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
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
        data: updatedNoSeriesSetup,
        message: "NoSeriesSetup updated successfully.",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteNoSeriesSetup(id: string) {
    try {
      const noSeriesSetup = await this.findUnique(
        (args) => this.db.noSeriesSetup.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!noSeriesSetup) {
        throw new Error("NoSeriesSetup not found.");
      }
      const deletedNoSeriesSetup = await this.delete(
        (args) => this.db.noSeriesSetup.delete(args),
        { where: { id } }
      );
      return {
        data: deletedNoSeriesSetup,
        message: `NoSeriesSetup deleted successfully`,
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

// Export the service
export const noSeriesSetupService = (): NoSeriesSetupService => {
  return new NoSeriesSetupService(db);
};
