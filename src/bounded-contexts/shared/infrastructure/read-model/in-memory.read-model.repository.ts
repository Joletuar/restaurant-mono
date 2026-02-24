import type { ReadModelRepository } from '@src/bounded-contexts/shared/domain/read-model.repository';

export class InMemoryReadModelRepository<T extends { id: string }>
  implements ReadModelRepository<T>
{
  private readonly items = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }

  async update(id: string, partial: Partial<T>): Promise<void> {
    const current = this.items.get(id);

    if (!current) return;

    this.items.set(id, {
      ...current,
      ...partial,
    });
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
