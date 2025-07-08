import type { FastifyReply, FastifyRequest } from 'fastify';

import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { ResponseBuilder } from '../utils/response.builder';

export class RecipeController {
  constructor(private readonly queryBus: QueryBus) {}

  async getAllRecipes(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const query = new GetterAllRecipesQuery({ reqId: request.id });

    const recipes = await this.queryBus.dispatch<
      GetterAllRecipesQuery,
      RecipeDto[]
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: recipes,
    });
  }

  async getRecipeById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;

    const query = new FinderRecipeByIdQuery(id, { reqId: request.id });

    const recipe = await this.queryBus.dispatch<
      FinderRecipeByIdQuery,
      RecipeDto
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: recipe,
    });
  }
}
