import { locationService } from "@/services/locationService";
import { Request, Response } from "express";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const newLocation = await locationService().createLocation(req.body);
    return res.status(201).json(newLocation);
  } catch (error: any) {
    console.error("Error creating Location:", error);
    return res
      .status(500)
      .json({ error: `Failed to create Location: ${error.message}` });
  }
};

export const getLocations = async (_req: Request, res: Response) => {
  try {
    const Locations = await locationService().getLocations();
    return res.status(200).json(Locations);
  } catch (error: any) {
    console.error("Error fetching Locations:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch Locations: ${error.message}` });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const Location = await locationService().getLocation(id);
    return res.status(200).json(Location);
  } catch (error: any) {
    console.error("Error fetching Location:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch Location: ${error.message}` });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedLocation = await locationService().updateLocation(
      id,
      req.body
    );
    return res.status(200).json(updatedLocation);
  } catch (error: any) {
    console.error("Error updating Location:", error.message);
    return res
      .status(500)
      .json({ error: `Failed to update Location: ${error.message}` });
  }
};

// Delete Location
export const deleteLocation = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedLocation = await locationService().deleteLocation(id);
    return res.status(200).json(deletedLocation);
  } catch (error: any) {
    console.error("Error deleting Location:", error);
    return res
      .status(500)
      .json({ error: `Failed to delete Location: ${error.message}` });
  }
};
