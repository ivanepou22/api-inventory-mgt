import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { MultiTenantService } from "@/services/multiTenantService";
import { Prisma, PrismaClient } from "@prisma/client";

export class NoSeriesService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }
  createNoSeries = async (noSeries: Prisma.NoSeriesUncheckedCreateInput) => {
    const { code, description, defaultSeries, manualSeries } = noSeries;
    try {
      const codeUpperCase = await slugify(code);
      //check if the noSeries already exists
      const noSeriesExists = await this.findUnique(
        (args) => this.db.noSeries.findUnique(args),
        { where: { code: codeUpperCase } }
      );
      if (noSeriesExists) {
        throw new Error(`No Series with code: ${code} already exists`);
      }
      const newNoSeries = await this.create(
        (args) => this.db.noSeries.create(args),
        {
          data: {
            code: codeUpperCase,
            description,
            defaultSeries,
            manualSeries,
            companyId: this.getCompanyId(),
            tenantId: this.getTenantId(),
          },
        }
      );
      return {
        data: newNoSeries,
        message: "No Series created successfully",
      };
    } catch (error: any) {
      console.error("Error creating No Series:", error);
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
  };

  getNoSeries = async () => {
    try {
      const noSeries = await this.findMany(
        (args) => this.db.noSeries.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
        }
      );
      return {
        data: noSeries,
        message: "No Series fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching No Series:", error);
      throw new Error(error.message);
    }
  };

  getNoSeriesById = async (id: string) => {
    try {
      const noSeries = await this.findUnique(
        (args) => this.db.noSeries.findUnique(args),
        {
          where: { id },
        }
      );
      if (!noSeries) {
        throw new Error("No Series not found");
      }
      return {
        data: noSeries,
        message: "No Series fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching No Series:", error);
      throw new Error(error.message);
    }
  };

  updateNoSeries = async (
    id: string,
    noSeries: Prisma.NoSeriesUncheckedCreateInput
  ) => {
    const { code, description, defaultSeries, manualSeries } = noSeries;
    try {
      const noSeriesExists = await this.findUnique(
        (args) => this.db.noSeries.findUnique(args),
        {
          where: { id },
          select: { id: true, code: true },
        }
      );
      if (!noSeriesExists) {
        throw new Error("No Series not found");
      }

      const codeUpperCase = code ? await slugify(code) : noSeriesExists.code;
      if (code && codeUpperCase !== noSeriesExists.code) {
        const noSeriesExists = await this.findUnique(
          (args) => this.db.noSeries.findUnique(args),
          { where: { code: codeUpperCase } }
        );
        if (noSeriesExists) {
          throw new Error(`No Series with code: ${code} already exists`);
        }
      }

      // Perform the update
      const updatedNoSeries = await this.update(
        (args) => this.db.noSeries.update(args),
        {
          where: { id },
          data: {
            code: codeUpperCase,
            description,
            defaultSeries,
            manualSeries,
          },
        }
      );
      return {
        data: updatedNoSeries,
        message: "No Series updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating No Series:", error);
      throw new Error(error.message);
    }
  };

  deleteNoSeries = async (id: string) => {
    try {
      // Check if the noSeries exists
      const noSeries = await this.findUnique(
        (args) => this.db.noSeries.findUnique(args),
        {
          where: { id },
        }
      );
      if (!noSeries) {
        throw new Error("No Series not found");
      }

      // Delete the noSeries
      const deletedNoSeries = await this.delete(
        (args) => this.db.noSeries.delete(args),
        { where: { id } }
      );
      return {
        data: deletedNoSeries,
        message: `No Series deleted successfully`,
      };
    } catch (error: any) {
      console.error("Error deleting No Series:", error);
      throw new Error(error.message);
    }
  };
}

export const createNoSeriesService = (): NoSeriesService => {
  return new NoSeriesService(db);
};
