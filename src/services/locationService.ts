import { db } from "@/db/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { MultiTenantService } from "./multiTenantService";
import { slugify } from "@/utils/functions";

class LocationService extends MultiTenantService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async createLocation(location: Prisma.LocationCreateInput) {
    const { code } = location;
    // Check if location code already exists
    try {
      if (code) {
        const locationCodeExists = await this.db.location.findUnique({
          where: {
            tenantId_companyId_code: {
              code: await slugify(code),
              companyId: this.tenantId,
              tenantId: this.tenantId,
            },
          },
        });
        if (locationCodeExists) {
          throw new Error("Location code already exists");
        }
      }
      // Create location
      const newLocation = await this.create(
        (args) => this.db.location.create(args),
        {
          data: {
            ...location,
            code: await slugify(code),
            tenantId: this.tenantId,
            companyId: this.tenantId,
          },
        }
      );
      return {
        data: newLocation,
        message: "Location created successfully",
      };
    } catch (error: any) {
      console.error("Error creating Location:", error);
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

  async getLocations() {
    try {
      const locations = await this.findMany(
        (args) => this.db.location.findMany(args),
        {
          orderBy: {
            createdAt: "desc",
          },
        }
      );
      return {
        data: locations,
        message: "Locations retrieved successfully",
      };
    } catch (error: any) {
      console.error("Error retrieving Locations:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }

  async getLocation(id: string) {
    try {
      const location = await this.findUnique(
        (args) => this.db.location.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
      return {
        data: location,
        message: "Location retrieved successfully",
      };
    } catch (error: any) {
      console.error("Error retrieving Location:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }

  async updateLocation(
    id: string,
    location: Prisma.LocationUncheckedCreateInput
  ) {
    const { code } = location;
    try {
      //check is the location exists
      const locationExists = await this.findUnique(
        (args) => this.db.location.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
      if (!locationExists) {
        throw new Error("Location not found");
      }

      const codex = code ? await slugify(code) : null;

      if (codex && codex !== locationExists.code) {
        const locationCodeExists = await this.db.location.findUnique({
          where: {
            tenantId_companyId_code: {
              code: await slugify(code),
              companyId: this.tenantId,
              tenantId: this.tenantId,
            },
          },
        });
        if (locationCodeExists) {
          throw new Error("Location code already exists");
        }
      }

      const updatedLocation = await this.update(
        (args) => this.db.location.update(args),
        {
          where: {
            id,
          },
          data: {
            ...location,
            code: codex,
          },
        }
      );

      return {
        data: updatedLocation,
        message: "Location updated successfully",
      };
    } catch (error: any) {
      console.log("Error deleting location", error);
      throw new Error("An unexpected error occurred.");
    }
  }

  async deleteLocation(id: string) {
    try {
      const location = await this.findUnique(
        (args) => this.db.location.findUnique(args),
        {
          where: {
            id,
          },
        }
      );
      if (!location) {
        throw new Error("Location not found");
      }
      const deletedLocation = await this.delete(
        (args) => this.db.location.delete(args),
        {
          where: {
            id,
          },
        }
      );
      return {
        data: deletedLocation,
        message: "Location deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting Location:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
}

export const locationService = (): LocationService => {
  return new LocationService(db);
};
