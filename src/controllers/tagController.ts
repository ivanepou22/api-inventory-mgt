import { Request, Response } from "express";
import { tagService } from "@/services/tagService";

// Create a new tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const newTag = await tagService.createTag(req.body);
    return res.status(201).json(newTag);
  } catch (error: any) {
    console.error("Error creating Tag:", error);
    return res.status(500).json({
      error: `Failed to create Tag: ${error.message}`,
    });
  }
};

// Get all tags
export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await tagService.getTags();
    return res.status(200).json(tags);
  } catch (error: any) {
    console.error("Error fetching Tags:", error);
    return res.status(500).json({
      error: `Failed to fetch Tags: ${error.message}`,
    });
  }
};

// Get a single tag by ID
export const getTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tag = await tagService.getTag(id);
    return res.status(200).json(tag);
  } catch (error: any) {
    console.error("Error fetching Tag:", error);
    return res.status(500).json({
      error: `Failed to fetch Tag: ${error.message}`,
    });
  }
};

// Update a tag
export const updateTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedTag = await tagService.updateTag(id, req.body);
    return res.status(200).json(updatedTag);
  } catch (error: any) {
    console.error("Error updating Tag:", error);
    return res.status(500).json({
      error: `Failed to update Tag: ${error.message}`,
    });
  }
};

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTag = await tagService.deleteTag(id);
    return res.status(200).json(deletedTag);
  } catch (error: any) {
    console.error("Error deleting Tag:", error);
    return res.status(500).json({
      error: `Failed to delete Tag: ${error.message}`,
    });
  }
};
