import type { FastifyInstance } from 'fastify';

import type { IngredientController } from '../controllers/ingredient.controller';
import type { RouteRegistrar } from './route-registar.interface';

export class IngredientRouteRegistrar implements RouteRegistrar {
  constructor(private readonly ingredientController: IngredientController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance) => {
        instance.get(
          '/',
          this.ingredientController.getAllIngredients.bind(
            this.ingredientController
          )
        );

        instance.get(
          '/:id',
          this.ingredientController.findIngredientById.bind(
            this.ingredientController
          )
        );

        instance.post(
          '/',
          this.ingredientController.createIngredient.bind(
            this.ingredientController
          )
        );
      },
      {
        prefix: '/ingredients',
      }
    );
  }
}
