import { Prisma, PrismaClient } from "@prisma/client";
import { TenantContextManager } from "./tenantContextManager";

export class MultiTenantService {
  protected db: PrismaClient;
  protected tenantId: string;
  protected companyId: string;

  constructor(db: PrismaClient) {
    this.db = db;
    const context = TenantContextManager.getInstance().getContext();
    if (!context) throw new Error("Tenant context not set");
    this.tenantId = context.tenantId;
    this.companyId = context.companyId;
  }

  protected applyTenantFilter<T extends Record<string, any>>(
    where: T
  ): T & { tenantId: string; companyId: string } {
    return {
      ...where,
      tenantId: this.tenantId,
      companyId: this.companyId,
    };
  }

  protected async findMany<T, A>(
    operation: (args: Prisma.Args<A, "findMany">) => Promise<T[]>,
    args: Prisma.Args<A, "findMany">
  ): Promise<T[]> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where || {}),
    };
    return operation(filteredArgs);
  }

  protected async findUnique<T, A>(
    operation: (args: Prisma.Args<A, "findUnique">) => Promise<T | null>,
    args: Prisma.Args<A, "findUnique">
  ): Promise<T | null> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return operation(filteredArgs);
  }

  protected async create<T, A>(
    operation: (args: Prisma.Args<A, "create">) => Promise<T>,
    args: Prisma.Args<A, "create">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      data: this.applyTenantFilter(args.data),
    };
    return operation(filteredArgs);
  }

  protected async update<T, A>(
    operation: (args: Prisma.Args<A, "update">) => Promise<T>,
    args: Prisma.Args<A, "update">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return operation(filteredArgs);
  }

  protected async delete<T, A>(
    operation: (args: Prisma.Args<A, "delete">) => Promise<T>,
    args: Prisma.Args<A, "delete">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return operation(filteredArgs);
  }
}

export const createMultiTenantService = (
  db: PrismaClient
): MultiTenantService => {
  return new MultiTenantService(db);
};
