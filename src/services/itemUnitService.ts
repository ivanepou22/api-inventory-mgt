import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";

class ItemUnitService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }
  createItemUnit = async (itemUnit: Prisma.ItemUnitUncheckedCreateInput) => {
    const { productId, unitId, type } = itemUnit;

    try {
      if (!productId) {
        throw new Error("Product Id is Required");
      }
      if (!unitId) {
        throw new Error("Unit Id is Required");
      }
      const itemUnitExists = await this.findUnique(
        (args) => this.db.itemUnit.findUnique(args),
        {
          where: {
            tenantId_companyId_productId_unitId_type: {
              tenantId: this.getTenantId(),
              companyId: this.getCompanyId(),
              productId,
              unitId,
              type,
            },
          },
        }
      );
      if (itemUnitExists) {
        throw new Error("Item Unit already exists.");
      }

      const newItemUnit = await this.create(
        (args) => this.db.itemUnit.create(args),
        {
          data: itemUnit,
          select: {
            id: true,
            itemId: true,
            unitId: true,
          },
        }
      );

      return {
        data: newItemUnit,
        message: "Item Unit created Successfully.",
      };
    } catch (error: any) {
      console.error("Error creating ItemUnit:", error);
      throw new Error(`Failed to create ItemUnit: ${error.message}`);
    }
  };

  getItemUnits = async () => {
    try {
      const itemUnits = await this.findMany(
        (args) => this.db.itemUnit.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
        }
      );

      return {
        data: itemUnits,
        message: "ItemUnits fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching ItemUnits:", error);
      throw new Error(`Failed to fetch ItemUnits: ${error.message}`);
    }
  };

  getItemUnit = async (id: string) => {
    try {
      const itemUnit = await this.findUnique(
        (args) => this.db.itemUnit.findUnique(args),
        {
          where: { id },
          select: {
            id: true,
            itemId: true,
            unitId: true,
          },
        }
      );
      if (!itemUnit) {
        throw new Error("ItemUnit not found.");
      }

      return {
        data: itemUnit,
        message: "ItemUnit fetched successfully",
      };
    } catch (error: any) {
      console.error("Error fetching ItemUnit:", error);
      throw new Error(`Failed to fetch ItemUnit: ${error.message}`);
    }
  };

  updateItemUnit = async (
    id: string,
    itemUnit: Prisma.ItemUnitUncheckedCreateInput
  ) => {
    const { productId, unitId } = itemUnit;

    try {
      const itemUnitExists = await this.findUnique(
        (args) => this.db.itemUnit.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
      if (!itemUnitExists) {
        throw new Error("Item Unit not found.");
      }

      if (productId && unitId) {
        const itemUnitByProductIdUnitId = await this.findUnique(
          (args) => this.db.itemUnit.findUnique(args),
          {
            where: {
              tenantId_companyId_productId_unitId_type: {
                tenantId: itemUnitExists.tenantId,
                companyId: itemUnitExists.companyId,
                type: itemUnitExists.type,
                productId,
                unitId,
              },
            },
          }
        );
        if (itemUnitByProductIdUnitId) {
          throw new Error("Item Unit already exists.");
        }
      } else if (productId) {
        const itemUnitByProductId = await this.findUnique(
          (args) => this.db.itemUnit.findUnique(args),
          {
            where: {
              tenantId_companyId_productId_unitId_type: {
                tenantId: itemUnitExists.tenantId,
                companyId: itemUnitExists.companyId,
                type: itemUnitExists.type,
                productId,
                unitId: itemUnitExists.unitId,
              },
            },
          }
        );
        if (itemUnitByProductId) {
          throw new Error("Item Unit already exists.");
        }
      } else if (unitId) {
        const itemUnitByUnitId = await this.findUnique(
          (args) => this.db.itemUnit.findUnique(args),
          {
            where: {
              tenantId_companyId_productId_unitId_type: {
                tenantId: itemUnitExists.tenantId,
                companyId: itemUnitExists.companyId,
                productId: itemUnitExists.productId,
                type: itemUnitExists.type,
                unitId,
              },
            },
          }
        );
        if (itemUnitByUnitId) {
          throw new Error("Item Unit already exists.");
        }
      }

      const updatedItemUnit = await this.update(
        (args) => this.db.itemUnit.update(args),
        {
          where: { id },
          data: itemUnit,
          select: {
            id: true,
            itemId: true,
            unitId: true,
          },
        }
      );

      return {
        data: updatedItemUnit,
        message: "Item Unit updated successfully",
      };
    } catch (error: any) {
      console.error("Error updating ItemUnit:", error);
      throw new Error(`Failed to update ItemUnit: ${error.message}`);
    }
  };

  deleteItemUnit = async (id: string) => {
    try {
      const itemUnit = await this.findUnique(
        (args) => this.db.itemUnit.findUnique(args),
        {
          where: { id },
          select: {
            id: true,
            itemId: true,
            unitId: true,
          },
        }
      );
      if (!itemUnit) {
        throw new Error("ItemUnit not found.");
      }

      const deletedItemUnit = await this.delete(
        (args) => this.db.itemUnit.delete(args),
        {
          where: { id },
        }
      );

      return {
        data: deletedItemUnit,
        message: "ItemUnit deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting ItemUnit:", error);
      throw new Error(`Failed to delete ItemUnit: ${error.message}`);
    }
  };
}

export const itemUnitService = (): ItemUnitService => {
  return new ItemUnitService(db);
};
