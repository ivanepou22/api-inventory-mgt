import { db } from "@/db/db";
import { slugify } from "@/utils/functions";
import { Prisma } from "@prisma/client";

const createUnit = async (unit: Prisma.UnitCreateInput) => {
  const { name, abbreviation } = unit;
  try {
    const slug = await slugify(name);

    const unitExists = await db.unit.findUnique({
      where: {
        slug,
      },
    });

    if (unitExists) {
      throw new Error(`Unit with slug: ${slug} already exists`);
    }

    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
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

const getUnits = async () => {
  try {
    const units = await db.unit.findMany({
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

const getUnit = async (id: string) => {
  try {
    const unit = await db.unit.findUnique({
      where: {
        id,
      },
    });
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

const updateUnit = async (id: string, unit: Prisma.UnitCreateInput) => {
  const { name, abbreviation } = unit;
  try {
    // Find the unit first
    const unitExists = await db.unit.findUnique({
      where: { id },
      select: { id: true, name: true, abbreviation: true, slug: true },
    });

    if (!unitExists) {
      throw new Error("Unit not found.");
    }

    const slug = name ? await slugify(name) : unitExists.slug;

    if (slug && slug !== unitExists.slug) {
      const unitBySlug = await db.unit.findUnique({
        where: {
          slug,
        },
      });
      if (unitBySlug) {
        throw new Error(`Unit with slug: ${slug} already exists`);
      }
    }
    // Perform the update
    const updatedUnit = await db.unit.update({
      where: { id },
      data: { name, abbreviation, slug },
    });

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

const deleteUnit = async (id: string) => {
  try {
    // Check if the unit exists
    const unit = await db.unit.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!unit) {
      throw new Error("Unit not found.");
    }
    // Delete the Unit
    const deletedUnit = await db.unit.delete({
      where: { id },
    });
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

export const unitService = {
  createUnit,
  getUnits,
  getUnit,
  updateUnit,
  deleteUnit,
};
