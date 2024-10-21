import {
  AdjustmentActivity,
  AdjustmentItemEntryType,
  AdjustmentItemReason,
  journalTemplateType,
  OrderStatus,
  OrderType,
  Prisma,
} from "@prisma/client";

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

export type Adjustment = {
  id: string;
  referenceNo: string;
  date: Date;
  description: string;
  activity: string;
  createdAt: Date;
  updatedAt: Date;
  AdjustmentLine: AdjustmentLine[];
};

export type AdjustmentInput = {
  date: Date;
  description: string;
  activity: AdjustmentActivity;
  AdjustmentLines: AdjustmentLine[];
};

export type AdjustmentLine = {
  id: string;
  postingDate: Date;
  entryType: AdjustmentItemEntryType;
  documentNo: string;
  adjustmentId: string;
  productId: string;
  productName: string;
  productCode: string;
  productSku: string;
  shopId: string;
  quantity: number;
  unitId: string;
  reason: AdjustmentItemReason;
  unitAmount?: number;
  totalAmount?: number;
  unitCost?: number;
  totalCost?: number;
  entryNo: number;
  createdAt: Date;
  updatedAt: Date;
};

export type JournalTemplateInput = {
  name: string;
  description: string;
  type: journalTemplateType;
  recurring: boolean;
  sourceCode: string;
  reasonCode: string;
};

export interface RequestWithTenant extends Request {
  tenantId?: string;
}
