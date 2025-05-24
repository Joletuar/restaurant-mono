export interface DependencyLifetime {
  transient: symbol;
  singleton: symbol;
  scoped: symbol;
}

export class DependencyContainer {
  private readonly dependencies: Map<string, any> = new Map();
  private readonly singletons: Map<string, any> = new Map();
  private readonly lifetimes: Map<string, symbol> = new Map();

  static readonly Lifetime: DependencyLifetime = {
    transient: Symbol('transient'),
    singleton: Symbol('singleton'),
    scoped: Symbol('scoped'),
  };

  register<T>(
    key: string,
    factory: () => T,
    lifetime = DependencyContainer.Lifetime.singleton
  ): void {
    if (this.dependencies.has(key)) {
      throw new Error(`Dependency with key "${key}" is already registered.`);
    }

    this.dependencies.set(key, factory);
    this.lifetimes.set(key, lifetime);
  }

  resolve<T>(key: string): T {
    const factory = this.dependencies.get(key);

    if (!factory) {
      throw new Error(`Dependency with key "${key}" is not registered.`);
    }

    const lifetime = this.lifetimes.get(key);

    if (lifetime === DependencyContainer.Lifetime.singleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, factory());
      }
      return this.singletons.get(key);
    }

    // Para transient siempre creamos una instancia nueva
    return factory();
  }
}

export const dependencyContainer = new DependencyContainer();
