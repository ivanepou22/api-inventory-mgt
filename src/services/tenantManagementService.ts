import { Prisma, PrismaClient } from "@prisma/client";
import { ContextManager } from "@/utils/contextManager";

export class TenantManagementService {
  protected db: PrismaClient;
  protected tenantId: string;

  constructor(db: PrismaClient) {
    this.db = db;
    const context = ContextManager.getInstance().getContext();
    if (!context) throw new Error("Tenant context not set");
    this.tenantId = context.tenantId;
  }

  protected applyTenantFilter<T extends Record<string, any>>(
    where: T
  ): T & { tenantId: string } {
    return {
      ...where,
      tenantId: this.tenantId,
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

  // Add getter methods
  protected getTenantId(): string {
    return this.tenantId;
  }
}

export const createTenantManagementService = (
  db: PrismaClient
): TenantManagementService => {
  return new TenantManagementService(db);
};
