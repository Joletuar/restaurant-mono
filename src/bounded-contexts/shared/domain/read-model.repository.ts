export interface ReadModelRepository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;

  getAll(): Promise<T[]>;

  save(item: T): Promise<void>;

  update(id: string, partial: Partial<T>): Promise<void>;

  delete(id: string): Promise<void>;
}
