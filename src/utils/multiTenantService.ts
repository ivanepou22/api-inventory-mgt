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

  protected async findMany<T>(
    model: any,
    args: Prisma.Args<T, "findMany">
  ): Promise<T[]> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where || {}),
    };
    return this.db[model].findMany(filteredArgs);
  }

  protected async findUnique<T>(
    model: any,
    args: Prisma.Args<T, "findUnique">
  ): Promise<T | null> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return this.db[model].findUnique(filteredArgs);
  }

  protected async create<T>(
    model: any,
    args: Prisma.Args<T, "create">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      data: this.applyTenantFilter(args.data),
    };
    return this.db[model].create(filteredArgs);
  }

  protected async update<T>(
    model: any,
    args: Prisma.Args<T, "update">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return this.db[model].update(filteredArgs);
  }

  protected async delete<T>(
    model: any,
    args: Prisma.Args<T, "delete">
  ): Promise<T> {
    const filteredArgs = {
      ...args,
      where: this.applyTenantFilter(args.where),
    };
    return this.db[model].delete(filteredArgs);
  }
}
