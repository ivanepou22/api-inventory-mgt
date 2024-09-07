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

    res.status(201).json({ data: order });
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: `Failed to create order: ${error.message}` });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await db.salesHeader.findMany({
      include: {
        salesLines: true,
        orderPayments: true,
      },
    });
    res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await db.salesHeader.findUnique({
      where: { id },
      include: {
        salesLines: true,
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
          create: orderItems,
        },
        orderPayments: {
          deleteMany: {},
          create: orderPayments,
        },
      },
      include: {
        salesLines: true,
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

    const cancelledOrder = await db.salesHeader.update({
      where: { id },
      data: {
        orderStatus: "CANCELLED",
      },
      include: {
        salesLines: true,
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

    await db.salesHeader.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export async function getShopSales(req: Request, res: Response) {
  const { shopId } = req.params;

  //check if shopId is valid
  const shop = await db.shop.findUnique({
    where: { id: shopId },
  });
  if (!shop) {
    return res.status(404).json({ error: "Shop not found" });
  }

  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        sales,
        salesPaidInCash: sales.filter((sale) => sale.paymentMethod === "CASH"),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILE_MONEY"
        ),
        salesByCheque: sales.filter((sale) => sale.paymentMethod === "CHEQUE"),
        salesByBankTransfer: sales.filter(
          (sale) => sale.paymentMethod === "BANK_TRANSFER"
        ),
        salesByCredit: sales.filter((sale) => sale.paymentMethod === "CREDIT"),
        salesByCard: sales.filter((sale) => sale.paymentMethod === "CARD"),
      };
    };

    const salesToday = await db.salesHeader.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const salesThisWeek = await db.salesHeader.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const salesThisMonth = await db.salesHeader.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const salesAllTime = await db.salesHeader.findMany({
      where: {
        shopId,
      },
    });

    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function getShopsSales(_req: Request, res: Response) {
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    //fetch all sales
    const fetchAllSales = async (startDate: Date, endDate?: Date) => {
      return await db.salesHeader.findMany({
        where: endDate
          ? {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
        select: {
          shopId: true,
          paymentMethod: true,
          orderTotal: true,
          orderPaidAmount: true,
          orderDueAmount: true,
        },
      });
    };

    // Fetch all sales and group by shopId for different periods
    const categorizeSales = (sales: any[]) => {
      return {
        sales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.orderAmount !== 0
        ),
        salesByMobileMoney: sales.filter(
          (sale) =>
            sale.paymentMethod === "MOBILE_MONEY" && sale.orderAmount !== 0
        ),
        salesByCheque: sales.filter(
          (sale) => sale.paymentMethod === "CHEQUE" && sale.orderAmount !== 0
        ),
        salesByBankTransfer: sales.filter(
          (sale) =>
            sale.paymentMethod === "BANK_TRANSFER" && sale.orderAmount !== 0
        ),
        salesByCredit: sales.filter(
          (sale) => sale.paymentMethod === "CREDIT" && sale.orderAmount !== 0
        ),
        salesByCard: sales.filter(
          (sale) => sale.paymentMethod === "CARD" && sale.orderAmount !== 0
        ),
      };
    };

    const getSalesForPeriod = async (startDate: Date, endDate?: Date) => {
      return await fetchAllSales(startDate, endDate);
    };

    const [salesToday, salesThisWeek, salesThisMonth, salesAllTime] =
      await Promise.all([
        getSalesForPeriod(todayStart, todayEnd),
        getSalesForPeriod(weekStart, weekEnd),
        getSalesForPeriod(monthStart, monthEnd),
        getSalesForPeriod(new Date(0)),
      ]);

    res.status(200).json({
      today: categorizeSales(salesToday),
      thisWeek: categorizeSales(salesThisWeek),
      thisMonth: categorizeSales(salesThisMonth),
      allTime: categorizeSales(salesAllTime),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}
