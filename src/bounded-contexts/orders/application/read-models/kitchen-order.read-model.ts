export interface KitchenOrderReadModel {
  id: string;
  orderId: string;
  recipeId: string;
  status: string;
  orderedAt: Date;
  startedAt: Date | null;
}
