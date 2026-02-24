import type { FastifyReply, FastifyRequest } from 'fastify';

import { CreatorRecipeCommand } from '@src/bounded-contexts/recipes/application/commands/creator-recipe/creator-recipe.command';
import { FinderRecipeByIdQuery } from '@src/bounded-contexts/recipes/application/queries/finder-recipe-by-id/finder-recipe-by-id.query';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { InvalidPathParameter } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-path-parameter.error';
import { InvalidRequestBody } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-request-body.error';

import { HttpStatusCode } from '../contracts/api-contracts';
import { ResponseBuilder } from '../utils/response.builder';

export class RecipeController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

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
      data: recipes.data,
    });
  }

  async getRecipeById(
    request: FastifyRequest<{ Params: { id?: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;

    if (id === null || id === undefined || (id && id.length === 0)) {
      throw new InvalidPathParameter('id');
    }

    const query = new FinderRecipeByIdQuery(id, { reqId: request.id });

    const recipe = await this.queryBus.dispatch<
      FinderRecipeByIdQuery,
      RecipeDto
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: recipe.data,
    });
  }

  async createRecipe(
    request: FastifyRequest<{ Body?: { ingredientsIds?: string[] } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const recipeData = request.body;

    if (recipeData === undefined) {
      throw new InfrastructureError(
        'Body has not provided',
        new InvalidRequestBody(['body request is requiered'])
      );
    }

    const { ingredientsIds } = recipeData;

    if (
      ingredientsIds === undefined ||
      !Array.isArray(ingredientsIds) ||
      ingredientsIds.length === 0
    ) {
      throw new InfrastructureError(
        'Body has not correct schema',
        new InvalidRequestBody([
          'ingredientsIds is requiered and must be a non-empty string array',
        ])
      );
    }

    const command = new CreatorRecipeCommand(
      { ingredientsIds },
      { reqId: request.id }
    );

    await this.commandBus.dispatch(command);

    return await ResponseBuilder.successNoContent({
      reply,
      statusCode: HttpStatusCode.CREATED,
    });
  }
}
