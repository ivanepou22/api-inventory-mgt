import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { slugify } from "@/utils/functions";

class UnitService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  createUnit = async (unit: Prisma.UnitCreateInput) => {
    const { code } = unit;
    try {
      const codeSlug = await slugify(code);

      const unitExists = await this.findUnique(
        (args) => this.db.unit.findUnique(args),
        {
          where: {
            tenantId_companyId_code: {
              tenantId: this.tenantId,
              companyId: this.companyId,
              code: codeSlug,
            },
          },
        }
      );

      if (unitExists) {
        throw new Error(`Unit with slug: ${codeSlug} already exists`);
      }

      const newUnit = await this.create((args) => this.db.unit.create(args), {
        data: {
          ...unit,
          code: codeSlug,
          companyId: this.getCompanyId(),
          tenantId: this.getTenantId(),
        },
      });

      return {
        data: newUnit,
        message: "Unit created successfully",
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  };

  getUnits = async () => {
    try {
      const units = await this.findMany((args) => this.db.unit.findMany(args), {
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: units,
        message: "Units fetched successfully",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error getting units.");
    }
  };

  getUnit = async (id: string) => {
    try {
      // const unit = await db.unit.findUnique({
      //   where: {
      //     id,
      //   },
      // });
      const unit = await this.findUnique(
        (args) => this.db.unit.findUnique(args),
        {
          where: { id },
          select: { id: true, name: true, abbreviation: true, slug: true },
        }
      );
      if (!unit) {
        throw new Error("Unit not found.");
      }

      return {
        data: unit,
        message: "Unit fetched successfully",
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

  updateUnit = async (id: string, unit: Prisma.UnitCreateInput) => {
    const { code, name, abbreviation } = unit;
    try {
      // Find the unit first
      const unitExists = await this.findUnique(
        (args) => this.db.unit.findUnique(args),
        { where: { id } }
      );

      if (!unitExists) {
        throw new Error("Unit not found.");
      }

      const codeSlug = code ? await slugify(code) : null;

      if (codeSlug && codeSlug !== unitExists.code) {
        const unitBySlug = await this.findUnique(
          (args) => this.db.unit.findUnique(args),
          {
            where: {
              tenantId_companyId_code: {
                tenantId: unitExists.tenantId,
                companyId: unitExists.companyId,
                code: codeSlug,
              },
            },
          }
        );
        if (unitBySlug) {
          throw new Error(`Unit with slug: ${codeSlug} already exists`);
        }
      }
      // Perform the update
      const updatedUnit = await this.update(
        (args) => this.db.unit.update(args),
        { where: { id }, data: { name, abbreviation, code: codeSlug } }
      );

      return { data: updatedUnit, message: "Unit updated successfully" };
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

  deleteUnit = async (id: string) => {
    try {
      // Check if the unit exists
      const unit = await this.findUnique(
        (args) => this.db.unit.findUnique(args),
        {
          where: { id },
          select: { id: true },
        }
      );
      if (!unit) {
        throw new Error("Unit not found.");
      }
      // Delete the Unit
      const deletedUnit = await this.delete(
        (args) => this.db.unit.delete(args),
        {
          where: { id },
        }
      );
      return {
        data: deletedUnit,
        message: `Unit deleted successfully`,
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
export const unitService = (): UnitService => {
  return new UnitService(db);
};
