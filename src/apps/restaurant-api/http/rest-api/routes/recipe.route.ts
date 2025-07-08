import { Type } from '@sinclair/typebox';

import type { RecipeController } from '../controllers/recipe.controller';
import type { FastifyTypebox } from '../types/fastify-typebox.type';
import type { RouteRegistrar } from './route-registar.interface';

export class RecipeRouteRegistrar implements RouteRegistrar {
  constructor(private readonly controller: RecipeController) {}

  async registerRoutes(fastify: FastifyTypebox): Promise<void> {
    fastify.register(
      async (instance) => {
        instance.get('/', this.controller.getAllRecipes.bind(this.controller));

        instance.get(
          '/:id',
          {
            schema: {
              params: Type.Object({
                id: Type.String(),
              }),
            },
          },
          this.controller.getRecipeById.bind(this.controller)
        );
      },
      { prefix: '/recipes' }
    );
  }
}
