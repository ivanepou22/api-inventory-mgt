import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { MultiTenantService } from "@/services/multiTenantService";
import { Prisma, PrismaClient } from "@prisma/client";

export class NoSeriesLineService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }
  createNoSeriesLine = async (
    noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput
  ) => {
    const {
      noSeriesId,
      startingDate,
      endingDate,
      startingNo,
      endingNo,
      lastDateUsed,
      lastNoUsed,
      lastDigitUsed,
      increment,
      userId,
    } = noSeriesLine;
    try {
      //get the noSeries
      const noSeries = await this.findUnique(
        (args) => this.db.noSeries.findUnique(args),
        {
          where: { id: noSeriesId },
        }
      );
      if (!noSeries) {
        throw new Error("No Series not found");
      }

      const noSeriesLineExists = await this.findUnique(
        (args) => this.db.noSeriesLine.findUnique(args),
        {
          where: {
            tenantId_companyId_noSeriesId_startingNo: {
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
              noSeriesId,
              startingNo: await slugify(startingNo),
            },
          },
        }
      );
      if (noSeriesLineExists) {
        throw new Error("No Series Line already exists");
      }

      //the start date should always be less than the ending date and the ending date should be greater than the starting date
      if (startingDate && endingDate) {
        if (startingDate > endingDate) {
          throw new Error(
            "The starting date should be less than the ending date."
          );
        }
        if (endingDate < startingDate) {
          throw new Error(
            "The ending date should be greater than the starting date."
          );
        }
      }
      const noSeriesLine = await this.create(
        (args) => this.db.noSeriesLine.create(args),
        {
          data: {
            noSeriesId,
            startingNo: await slugify(startingNo),
            startingDate,
            endingDate,
            endingNo,
            lastDateUsed,
            lastNoUsed,
            lastDigitUsed,
            increment,
            userId,
            tenantId: this.getTenantId(),
            companyId: this.getCompanyId(),
          },
        }
      );

      return {
        data: noSeriesLine,
        message: "No Series Line created successfully",
      };
    } catch (error: any) {
      console.error("Error creating No Series Line:", error);
      throw new Error("Failed to create No Series Line");
    }
  };

  getNoSeriesLines = async () => {
    try {
      const noSeriesLines = await this.findMany(
        (args) => this.db.noSeriesLine.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            noSeries: {
              select: {
                code: true,
                description: true,
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
            user: {
              select: {
                fullName: true,
              },
            },
          },
        }
      );
      return {
        data: noSeriesLines,
        message: "No Series Lines fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching No Series Lines:", error);
      throw new Error("Failed to fetch No Series Lines");
    }
  };

  getNoSeriesLine = async (id: string) => {
    try {
      const noSeriesLine = await this.findUnique(
        (args) => this.db.noSeriesLine.findUnique(args),
        {
          where: { id },
          include: {
            noSeries: {
              select: {
                code: true,
                description: true,
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
            user: {
              select: {
                fullName: true,
              },
            },
          },
        }
      );

      if (!noSeriesLine) {
        throw new Error("No Series Line not found");
      }

      return {
        data: noSeriesLine,
        message: "No Series Line fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching No Series Line:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  updateNoSeriesLine = async (
    id: string,
    noSeriesLine: Prisma.NoSeriesLineUncheckedCreateInput
  ) => {
    const {
      startingDate,
      endingDate,
      startingNo,
      endingNo,
      lastDateUsed,
      lastNoUsed,
      lastDigitUsed,
      increment,
    } = noSeriesLine;
    try {
      //check if the noSeriesLine exists
      const noSeriesLineExists = await this.findUnique(
        (args) => this.db.noSeriesLine.findUnique(args),
        {
          where: { id },
        }
      );
      if (!noSeriesLineExists) {
        throw new Error("No Series Line not found");
      }

      if (startingDate && endingDate) {
        if (startingDate > endingDate) {
          throw new Error(
            "The starting date should be less than the ending date."
          );
        }
        if (endingDate < startingDate) {
          throw new Error(
            "The ending date should be greater than the starting date."
          );
        }
      } else if (startingDate) {
        if (noSeriesLineExists.endingDate) {
          if (startingDate > noSeriesLineExists.endingDate) {
            throw new Error(
              "The starting date should be less than the ending date."
            );
          }
          if (noSeriesLineExists.endingDate < startingDate) {
            throw new Error(
              "The ending date should be greater than the starting date."
            );
          }
        }
      } else if (endingDate && noSeriesLineExists.startingDate) {
        if (endingDate < noSeriesLineExists.startingDate) {
          throw new Error(
            "The ending date should be greater than the starting date."
          );
        }
      }

      const startingNoUpper = startingNo
        ? await slugify(startingNo)
        : noSeriesLineExists.startingNo;

      if (
        startingNoUpper &&
        startingNoUpper !== noSeriesLineExists.startingNo
      ) {
        const noSeriesLineByStartingNo = await this.findUnique(
          (args) => this.db.noSeriesLine.findUnique(args),
          { where: { startingNo } }
        );
        if (noSeriesLineByStartingNo) {
          throw new Error(
            `No Series Line with startingNo: ${startingNo} already exists`
          );
        }
      }

      const noSeriesLine = await this.update(
        (args) => this.db.noSeriesLine.update(args),
        {
          where: { id },
          data: {
            startingNo: startingNoUpper,
            startingDate,
            endingDate,
            endingNo,
            lastDateUsed,
            lastNoUsed,
            lastDigitUsed,
            increment,
          },
        }
      );
      return {
        data: noSeriesLine,
        message: "No Series Line updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating No Series Line:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
        );
      } else {
        throw new Error(error.message);
      }
    }
  };

  deleteNoSeriesLine = async (id: string) => {
    try {
      //check if the noSeriesLine exists
      const noSeriesLine = await this.findUnique(
        (args) => this.db.noSeriesLine.findUnique(args),
        {
          where: { id },
        }
      );
      if (!noSeriesLine) {
        throw new Error("No Series Line not found.");
      }

      const noSeriesLineDeleted = await this.delete(
        (args) => this.db.noSeriesLine.delete(args),
        {
          where: { id },
        }
      );
      return {
        data: noSeriesLineDeleted,
        message: "No Series Line deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting No Series Line:", error);
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
export const noSeriesLineService = (): NoSeriesLineService => {
  return new NoSeriesLineService(db);
};
