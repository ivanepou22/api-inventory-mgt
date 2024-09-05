import { Request, Response } from "express";
import { db } from "@/db/db";
import { PaymentMethod, Prisma } from "@prisma/client";
import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  Order,
  OrderItem,
} from "@/utils/types";
import { generateOrderNumber } from "@/utils/functions";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      orderStatus,
      orderType,
      orderNote,
      orderDiscount,
      orderTax,
      shopId,
      attendantId,
      orderItems,
      orderPayments,
    }: CreateOrderInput = req.body;

    if (
      !customerId ||
      !orderStatus ||
      !orderType ||
      !orderItems ||
      orderItems.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await db.$transaction(
      async (): Promise<Order> => {
        // Calculate order totals
        let orderAmount = 0;
        let orderTotal = 0;

        const orderNumber = await generateOrderNumber();

        const customer = await db.customer.findUnique({
          where: { id: customerId },
        });
        if (!customer) {
          throw new Error(`Customer with id ${customerId} not found`);
        }
        // Create the order first
        const createdOrder = await db.order.create({
          data: {
            customerId,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            orderNumber,
            orderStatus,
            orderType,
            orderNote,
            orderAmount: 0, // We'll update this later
            orderDiscount: orderDiscount || 0,
            orderTax: orderTax || 0,
            orderTotal: 0, // We'll update this later
            orderPaidAmount: 0, // We'll update this later
            orderDueAmount: 0, // We'll update this later
            shopId,
            attendantId,
          },
        });

        // Create order items and update product stock
        for (const item of orderItems) {
          const product = await db.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with id ${item.productId} not found`);
          }

          const lineTotal = item.quantity * product.unitPrice;
          orderAmount += lineTotal;

          // Create OrderItem
          await db.orderItem.create({
            data: {
              orderId: createdOrder.id,
              productId: product.id,
              productName: product.name,
              productCode: product.productCode,
              productSku: product.sku,
              productImage: item.productImage,
              quantity: item.quantity,
              price: product.unitPrice,
              lineDiscount: item.lineDiscount || 0,
              lineTax: item.lineTax || 0,
              total: item.quantity * product.unitPrice,
            } as OrderItem,
          });

          // Update product stock
          await db.product.update({
            where: { id: product.id },
            data: {
              stockQty: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Apply discount and tax
        const discountAmount = orderDiscount || 0;
        const taxAmount = orderTax || 0;
        orderTotal = orderAmount - discountAmount + taxAmount;

        // Create order payments
        if (orderPayments && orderPayments.length > 0) {
          await db.orderPayment.createMany({
            data: orderPayments.map(
              (payment): Prisma.OrderPaymentCreateManyInput => ({
                orderId: createdOrder.id,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod as PaymentMethod,
                paymentDate: payment.paymentDate || new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            ),
          });
        }

        // Calculate paid amount and due amount
        const paidAmount = orderPayments
          ? orderPayments.reduce(
              (sum: number, payment: CreateOrderPaymentInput) =>
                sum + payment.amount,
              0
            )
          : 0;
        const dueAmount = orderTotal - paidAmount;

        // Update order with final amounts
        const updatedOrder = await db.order.update({
          where: { id: createdOrder.id },
          data: {
            orderAmount,
            orderTotal,
            orderPaidAmount: paidAmount,
            orderDueAmount: dueAmount,
          },
          include: {
            orderItems: true,
            orderPayments: true,
          },
        });

        return updatedOrder;
      },
      {
        timeout: 100000, // Increase timeout to 10 seconds
        maxWait: 105000,
      }
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: true,
        orderPayments: true,
      },
    });
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        orderPayments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      orderStatus,
      orderType,
      orderNote,
      orderAmount,
      orderDiscount,
      orderTax,
      orderTotal,
      orderPaidAmount,
      orderDueAmount,
      shopId,
      attendantId,
      orderItems,
      orderPayments,
    } = req.body;

    if (!orderStatus || !orderType || !orderAmount || !orderTotal) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        orderStatus,
        orderType,
        orderNote,
        orderAmount,
        orderDiscount,
        orderTax,
        orderTotal,
        orderPaidAmount,
        orderDueAmount,
        shopId,
        attendantId,
        orderItems: {
          deleteMany: {},
          create: orderItems,
        },
        orderPayments: {
          deleteMany: {},
          create: orderPayments,
        },
      },
      include: {
        orderItems: true,
        orderPayments: true,
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cancelledOrder = await db.order.update({
      where: { id },
      data: {
        orderStatus: "CANCELLED",
      },
      include: {
        orderItems: true,
        orderPayments: true,
      },
    });

    res.status(200).json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.order.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
