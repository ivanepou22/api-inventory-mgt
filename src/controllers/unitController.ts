import { db } from "@/db/db";
import { Request, Response } from "express";

export const createUnit = async (req: Request, res: Response) => {
  const { name, abbreviation, slug } = req.body;

  const unitExists = await db.unit.findUnique({
    where: {
      slug,
    },
  });

  if (unitExists) {
    return res.status(409).json({
      error: `Unit with slug: ${slug} already exists`,
    });
  }

  try {
    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(201).json({
      data: newUnit,
      error: null,
      message: "Unit created successfully",
    });
  } catch (error) {
    console.error("Error creating Unit:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getUnits = async (_req: Request, res: Response) => {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: units,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const getUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const unit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!unit) {
      return res.status(404).json({
        data: null,
        error: `Unit not found.`,
      });
    }
    return res.status(200).json({
      data: unit,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(201).json({
      error: `An unexpected error occurred. Please try again later.`,
    });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, abbreviation, slug } = req.body;

  try {
    // Find the unit first
    const unitExists = await db.unit.findUnique({
      where: { id },
      select: { id: true, name: true, abbreviation: true, slug: true },
    });

    if (!unitExists) {
      return res.status(404).json({ error: "Unit not found." });
    }

    if (slug && slug !== unitExists.slug) {
      const unitBySlug = await db.unit.findUnique({
        where: {
          slug,
        },
      });
      if (unitBySlug) {
        return res.status(409).json({
          error: `Unit with slug: ${slug} already exists`,
        });
      }
    }
    // Perform the update
    const updatedUnit = await db.unit.update({
      where: { id },
      data: { name, abbreviation, slug },
    });

    return res
      .status(200)
      .json({ data: updatedUnit, message: "Unit updated successfully" });
  } catch (error: any) {
    console.error("Error updating Unit:", error);

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Delete unit
export const deleteUnit = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // Check if the unit exists
    const unit = await db.unit.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!unit) {
      return res.status(404).json({ error: "Unit not found." });
    }
    // Delete the Unit
    const deletedUnit = await db.unit.delete({
      where: { id },
    });
    return res.status(200).json({
      data: deletedUnit,
      message: `Unit deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting Unit:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
