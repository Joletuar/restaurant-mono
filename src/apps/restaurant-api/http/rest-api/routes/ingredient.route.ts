import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';

import type { IngredientController } from '../controllers/ingredient.controller';
import type { FastifyTypebox } from '../types/fastify-typebox.type';
import type { RouteRegistrar } from './route-registar.interface';

export class IngredientRoute implements RouteRegistrar {
  constructor(private readonly ingredientController: IngredientController) {}

  async registerRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.register(
      async (instance: FastifyTypebox) => {
        instance.get(
          '/',
          this.ingredientController.getAllIngredients.bind(
            this.ingredientController
          )
        );

        instance.get(
          '/:id',
          {
            schema: {
              params: Type.Object({
                id: Type.String(),
              }),
            },
          },
          this.ingredientController.findIngredientById.bind(
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
