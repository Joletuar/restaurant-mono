export type DependencyLifetime = 'transient' | 'singleton' | 'scoped';

type BaseProps<T> = {
  key: string;
  factory: () => T;
};

type TransientProps<T> = BaseProps<T> & {
  lifetime?: 'transient';
};

type SingletonProps<T> = BaseProps<T> & {
  lifetime: 'singleton';
};

type ScopedProps<T> = BaseProps<T> & {
  lifetime: 'scoped';
  scope: string;
};

type RegisterProps<T> = TransientProps<T> | SingletonProps<T> | ScopedProps<T>;

export class DependencyContainer {
  private readonly factories: Map<string, () => any> = new Map();
  private readonly lifetimes: Map<string, DependencyLifetime> = new Map();
  private readonly singletonCache: Map<string, any> = new Map();
  private readonly scopes: Map<string, Map<string, any>> = new Map();

  register<T>(props: RegisterProps<T>): void {
    const { factory, key, lifetime = 'transient' } = props;

    if (this.factories.has(key)) {
      throw new Error(`Dependency with key "${key}" is already registered.`);
    }

    this.factories.set(key, factory);
    this.lifetimes.set(key, lifetime);

    if (lifetime === 'scoped') {
      const { scope } = props as ScopedProps<T>;

      this.createScope(scope);
    }
  }

  private createScope(scope: string): void {
    if (this.scopes.has(scope)) {
      throw new Error(
        `Dependency with scope "${scope}" is already registered.`
      );
    }

    this.scopes.set(scope, new Map());
  }

  disposeScope(scope: string): void {
    this.scopes.delete(scope);
  }

  resolve<T>(key: string, scope?: string): T {
    const factory = this.factories.get(key);

    if (!factory) {
      throw new Error(`Dependency with key "${key}" is not registered.`);
    }

    const lifetime = this.lifetimes.get(key);

    if (!lifetime) {
      throw new Error(
        `Dependency lifetime with key "${key}" is not registered.`
      );
    }

    if (lifetime === 'singleton') {
      if (!this.singletonCache.has(key)) {
        this.singletonCache.set(key, factory());
      }
      return this.singletonCache.get(key) as T;
    }

    if (lifetime === 'scoped') {
      if (!scope) {
        throw new Error(
          `Scope parameter is required for scoped dependency "${key}."`
        );
      }

      const scopeMap = this.scopes.get(scope);

      if (!scopeMap) {
        throw new Error(`Scope "${scope}" does not exist.`);
      }

      if (!scopeMap.has(key)) {
        scopeMap.set(key, factory());
      }

      return scopeMap.get(key) as T;
    }

    if (lifetime === 'transient') {
      return factory() as T;
    }

    throw new Error(`Unknown lifetime type for dependency "${key}."`);
  }
}
