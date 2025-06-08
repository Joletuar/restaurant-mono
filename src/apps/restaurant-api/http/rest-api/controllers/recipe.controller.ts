import type { FastifyReply, FastifyRequest } from 'fastify';

import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { ResponseBuilder } from '../utils/response.builder';

export class RecipeController {
  constructor(private readonly queryBus: QueryBus) {}

  async getAllRecipes(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const query = new GetterAllRecipesQuery({ reqId: request.id });

    const recipes = await this.queryBus.dispatch(query);

    return await ResponseBuilder.success({
      reply,
      data: recipes,
    });
  }

  async getRecipeById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    // TODO: añadir validaciones de esquemas para datos basura y validaciones comunes

    const { id } = request.params;

    const query = new FinderRecipeByIdQuery(id, { reqId: request.id });

    const order = await this.queryBus.dispatch(query);

    return await ResponseBuilder.success({
      reply,
      data: order,
    });
  }
}
