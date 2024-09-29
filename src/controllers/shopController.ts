import { db } from "@/db/db";
import { shopService } from "@/services/shopService";
import { Request, Response } from "express";

export const createShop = async (req: Request, res: Response) => {
  try {
    const newShop = await shopService.createShop(req.body);
    return res.status(201).json(newShop);
  } catch (error: any) {
    console.error("Error creating Shop:", error);
    return res
      .status(500)
      .json({ error: `Failed to create Shop: ${error.message}` });
  }
};

export const getShops = async (_req: Request, res: Response) => {
  try {
    const shops = await shopService.getShops();
    return res.status(200).json(shops);
  } catch (error: any) {
    console.error("Error fetching Shops:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch Shops: ${error.message}` });
  }
};

export const getShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const shop = await shopService.getShop(id);
    return res.status(200).json(shop);
  } catch (error: any) {
    console.error("Error fetching Shop:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch Shop: ${error.message}` });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedShop = await shopService.updateShop(id, req.body);
    return res.status(200).json(updatedShop);
  } catch (error: any) {
    console.error("Error updating Shop:", error.message);
    return res
      .status(500)
      .json({ error: `Failed to update Shop: ${error.message}` });
  }
};

// Delete Shop
export const deleteShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedShop = await shopService.deleteShop(id);
    return res.status(200).json(deletedShop);
  } catch (error: any) {
    console.error("Error deleting Shop:", error);
    return res
      .status(500)
      .json({ error: `Failed to delete Shop: ${error.message}` });
  }
};

export const getShopAttendants = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const shopAttendants = await shopService.getShopAttendants(id);
    return res.status(200).json(shopAttendants);
  } catch (error: any) {
    console.error("Error fetching Shop Attendants:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch Shop Attendants: ${error.message}` });
  }
};
