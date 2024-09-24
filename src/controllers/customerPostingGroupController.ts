import { Request, Response } from "express";
import { customerPostingGroupService } from "@/services/customerPostingGroupService";

export const createCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  try {
    const customerPostingGroup =
      await customerPostingGroupService.createCustomerPostingGroup(req.body);
    return res.status(201).json(customerPostingGroup);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to create customer posting group: ${error.message}`,
    });
  }
};

export const getCustomerPostingGroups = async (
  _req: Request,
  res: Response
) => {
  try {
    const customerPostingGroups =
      await customerPostingGroupService.getCustomerPostingGroups();
    return res.status(200).json(customerPostingGroups);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to get customer posting groups: ${error.message}`,
    });
  }
};

export const getCustomerPostingGroup = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customerPostingGroup =
      await customerPostingGroupService.getCustomerPostingGroup(id);
    return res.status(200).json(customerPostingGroup);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to get customer posting group: ${error.message}`,
    });
  }
};

export const updateCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    const customerPostingGroup =
      await customerPostingGroupService.updateCustomerPostingGroup(
        id,
        req.body
      );
    return res.status(200).json(customerPostingGroup);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to update customer posting group: ${error.message}`,
    });
  }
};

//delete
export const deleteCustomerPostingGroup = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  try {
    const customerPostingGroup =
      await customerPostingGroupService.deleteCustomerPostingGroup(id);
    return res.status(200).json(customerPostingGroup);
  } catch (error: any) {
    return res.status(500).json({
      error: `Failed to delete customer posting group: ${error.message}`,
    });
  }
};
