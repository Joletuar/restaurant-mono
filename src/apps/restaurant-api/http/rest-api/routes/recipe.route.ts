import type { FastifyInstance } from 'fastify';

import type { RecipeController } from '../controllers/recipe.controller';
import type { RouteRegistrar } from './route-registar.interface';

export class RecipeRouteRegistrar implements RouteRegistrar {
  constructor(private readonly controller: RecipeController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance) => {
        instance.get('/', this.controller.getAllRecipes.bind(this.controller));

        instance.get(
          '/:id',
          this.controller.getRecipeById.bind(this.controller)
        );
      },
      { prefix: '/recipes' }
    );
  }
}
