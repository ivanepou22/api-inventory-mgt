import { Request, Response } from "express";
import { db } from "@/db/db";
import { PaymentMethod, Prisma } from "@prisma/client";
import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  Order,
  OrderItem,
} from "@/utils/types";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";
import { orderService } from "@/services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: `Failed to create order: ${error.message}` });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrders();
    return res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch orders: ${error.message}` });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    return res.status(200).json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch order: ${error.message}` });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await orderService.updateOrder(id, req.body);
    return res.status(200).json(order);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return res
      .status(500)
      .json({ error: `Failed to update order: ${error.message}` });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cancelledOrder = await orderService.cancelOrder(id);
    return res.status(200).json(cancelledOrder);
  } catch (error: any) {
    console.error("Error canceling order:", error);
    return res
      .status(500)
      .json({ error: `Failed to cancel order: ${error.message}` });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOrder = await orderService.deleteOrder(id);
    return res.status(200).json(deletedOrder);
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return res
      .status(500)
      .json({ error: `Failed to delete order: ${error.message}` });
  }
};

export const getShopSales = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  try {
    const shopSales = await orderService.getShopSales(shopId);
    return res.status(200).json(shopSales);
  } catch (error: any) {
    console.error("Error fetching shop sales:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch shop sales: ${error.message}` });
  }
};

export const getShopsSales = async (_req: Request, res: Response) => {
  try {
    const shopsSales = await orderService.getShopsSales();
    return res.status(200).json(shopsSales);
  } catch (error: any) {
    console.error("Error fetching shops sales:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch shops sales: ${error.message}` });
  }
};
