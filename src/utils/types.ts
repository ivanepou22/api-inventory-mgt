import { OrderStatus, OrderType } from "@prisma/client";

export type Order = {
  id: string;
  customerId: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  orderDate: Date;
  orderStatus: OrderStatus;
  orderType: OrderType;
  orderNote?: string | null;
  orderAmount: number;
  orderDiscount?: number | null;
  orderTax?: number | null;
  orderTotal: number;
  orderPaidAmount?: number | null;
  orderDueAmount?: number | null;
  shopId?: string | null;
  attendantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: OrderItem[];
  orderPayments?: OrderPayment[];
};

export type OrderItem = {
  id: string;
  salesHeaderId: string;
  productId: string;
  productName: string;
  productCode: string;
  productSku: string;
  productImage: string;
  quantity: number;
  price: number;
  lineDiscount?: number | null;
  lineTax?: number | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderPayment = {
  id: string;
  salesHeaderId: string;
  amount: number;
  paymentMethod: string;
  paymentDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderInput = {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderStatus: OrderStatus;
  orderType: OrderType;
  orderNote?: string;
  orderDiscount?: number;
  orderTax?: number;
  shopId?: string;
  attendantId?: string;
  orderItems: CreateOrderItemInput[];
  orderPayments?: CreateOrderPaymentInput[];
};

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
  price?: number;
  lineDiscount?: number;
  lineTax?: number;
  productImage?: string;
};

export type CreateOrderPaymentInput = {
  amount: number;
  paymentMethod: string;
  paymentDate?: Date;
};

export type OrderPaymentCreateManyInput = {
  salesHeaderId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
