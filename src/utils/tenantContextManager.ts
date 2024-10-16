import { AsyncLocalStorage } from "async_hooks";

// Tenant Context Manager
interface TenantContext {
  tenantId: string;
  companyId: string;
}

export class TenantContextManager {
  private static instance: TenantContextManager;
  private storage: AsyncLocalStorage<TenantContext>;

  private constructor() {
    this.storage = new AsyncLocalStorage<TenantContext>();
  }

  public static getInstance(): TenantContextManager {
    if (!TenantContextManager.instance) {
      TenantContextManager.instance = new TenantContextManager();
    }
    return TenantContextManager.instance;
  }

  public run(
    context: TenantContext,
    callback: () => Promise<void>
  ): Promise<void> {
    return this.storage.run(context, callback);
  }

  public getContext(): TenantContext | undefined {
    return this.storage.getStore();
  }
}
