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
import { generateOrderNumber } from "@/utils/functions";

const createOrder = async (order: CreateOrderInput) => {
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
  } = order;
  try {
    if (
      !customerId ||
      !orderStatus ||
      !orderType ||
      !orderItems ||
      orderItems.length === 0
    ) {
      throw new Error("Missing required fields");
    }

    const order = await db.$transaction(
      async (transaction: Prisma.TransactionClient): Promise<Order> => {
        // Calculate order totals
        let orderAmount = 0;
        let orderTotal = 0;

        const orderNumber = await generateOrderNumber();

        const customer = await transaction.customer.findUnique({
          where: { id: customerId },
        });
        if (!customer) {
          throw new Error(`Customer with id ${customerId} not found`);
        }

        // Create the order first
        const createdOrder = await transaction.salesHeader.create({
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
          const product = await transaction.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with id ${item.productId} not found`);
          }

          const lineTotal = item.quantity * product.unitPrice;
          orderAmount += lineTotal;

          // Create OrderItem
          await transaction.salesLine.create({
            data: {
              salesHeaderId: createdOrder.id,
              productId: product.id,
              productName: product.name,
              productCode: product.productCode,
              productSku: product.sku,
              productImage: item.productImage,
              quantity: item.quantity,
              price: item.price || product.unitPrice,
              lineDiscount: item.lineDiscount || 0,
              lineTax: item.lineTax || 0,
              total: item.quantity * product.unitPrice,
            } as OrderItem,
          });

          // Update product stock
          await transaction.product.update({
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

        // Check if the customer has a credit limit and if the credit limit is less than the orderTotal + customer.balanceAmount
        if (
          customer.maxCreditLimit !== null &&
          customer.balanceAmount !== null
        ) {
          //calculate the total amount including the orderTotal and the customer's balanceAmount
          const totalAmount = orderTotal + customer.balanceAmount;
          if (customer.maxCreditLimit < totalAmount) {
            throw new Error("Customer has exceeded credit limit");
          }
        }

        // Create order payments
        if (orderPayments && orderPayments.length > 0) {
          await transaction.orderPayment.createMany({
            data: orderPayments.map(
              (payment): Prisma.OrderPaymentCreateManyInput => ({
                salesHeaderId: createdOrder.id,
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
        const updatedSalesHeader = await transaction.salesHeader.update({
          where: { id: createdOrder.id },
          data: {
            orderAmount,
            orderTotal,
            orderPaidAmount: paidAmount,
            orderDueAmount: dueAmount,
          },
          include: {
            salesLines: true,
            orderPayments: true,
          },
        });

        // Update the customer's balanceAmount, paidAmount, and salesAmount
        await transaction.customer.update({
          where: { id: customerId },
          data: {
            balanceAmount: customer.balanceAmount
              ? customer.balanceAmount + dueAmount
              : dueAmount,
            paidAmount: customer.paidAmount
              ? customer.paidAmount + paidAmount
              : paidAmount,
            salesAmount: customer.salesAmount
              ? customer.salesAmount + orderAmount
              : orderAmount,
          },
        });

        return updatedSalesHeader;
      },
      {
        timeout: 100000, // Increase timeout to 10 seconds
        maxWait: 105000,
      }
    );

    return { data: order };
  } catch (error: any) {
    console.error("Error creating Order:", error);
    throw new Error(error.message);
  }
};

const getOrders = async () => {
  try {
    const orders = await db.salesHeader.findMany({
      include: {
        salesLines: true,
        orderPayments: true,
      },
    });
    return { data: orders };
  } catch (error: any) {
    console.log(error.message);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

const getOrder = async (id: string) => {
  try {
    const order = await db.salesHeader.findUnique({
      where: { id },
      include: {
        salesLines: true,
        orderPayments: true,
      },
    });

    if (!order) {
      throw new Error(`Order not found`);
    }

    return { data: order };
  } catch (error: any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const updateOrder = async (
  id: string,
  order: Prisma.SalesHeaderUncheckedUpdateInput
) => {
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
    salesLines,
    orderPayments,
  } = order;

  try {
    if (!orderStatus || !orderType || !orderAmount || !orderTotal) {
      throw new Error("Missing required fields");
    }

    const updatedOrder = await db.salesHeader.update({
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
        salesLines: {
          deleteMany: {},
          create: salesLines as any,
        },
        orderPayments: {
          deleteMany: {},
          create: orderPayments as any,
        },
      },
      include: {
        salesLines: true,
        orderPayments: true,
      },
    });

    return { data: updatedOrder };
  } catch (error: any) {
    console.error("Error updating Order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

//delete
const deleteOrder = async (id: string) => {
  try {
    // Check if the order exists
    const order = await db.salesHeader.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!order) {
      throw new Error("Order not found.");
    }
    // Delete the order
    const deletedOrder = await db.salesHeader.delete({
      where: { id },
    });
    return {
      data: deletedOrder,
      message: `Order deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting Order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `The provided ID "${id}" is invalid. It must be a 12-byte hexadecimal string, but it is 25 characters long.`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const orderService = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
