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
    const { customerNos, vendorNos, bankAccountNos, userId } = noSeriesSetup;
    try {
      const newNoSeriesSetup = await this.create(
        (args) => this.db.noSeriesSetup.create(args),
        {
          data: {
            customerNos,
            vendorNos,
            bankAccountNos,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
            userId,
          },
          include: {
            tenant: true,
            company: true,
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
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
            tenant: true,
            company: true,
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
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
            tenant: true,
            company: true,
            bankAccountNo: true,
            vendorNo: true,
            customerNo: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
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
    const { customerNos, vendorNos, bankAccountNos } = noSeriesSetupData;

    try {
      const noSeriesSetupExists = await this.findUnique(
        (args) => this.db.noSeriesSetup.findUnique(args),
        {
          where: { id },
          select: {
            id: true,
            customerNos: true,
            vendorNos: true,
            bankAccountNos: true,
          },
        }
      );
      if (!noSeriesSetupExists) {
        throw new Error("NoSeriesSetup not found.");
      }
      const updatedNoSeriesSetup = await this.update(
        (args) => this.db.noSeriesSetup.update(args),
        {
          where: { id },
          data: {
            customerNos,
            vendorNos,
            bankAccountNos,
          },
          include: {
            tenant: true,
            company: true,
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
