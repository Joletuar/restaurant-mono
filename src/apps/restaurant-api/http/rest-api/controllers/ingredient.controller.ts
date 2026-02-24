import type { FastifyReply, FastifyRequest } from 'fastify';

import { CreatorIngredientCommand } from '@src/bounded-contexts/ingredients/application/commands/creator-ingredient/creator-ingredient.command';
import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { FinderIngredientByIdQuery } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infrastructure.error';
import { InvalidPathParameter } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-path-parameter.error';
import { InvalidRequestBody } from '@src/bounded-contexts/shared/infrastructure/http/errors/invalid-request-body.error';

import { HttpStatusCode } from '../contracts/api-contracts';
import { ResponseBuilder } from '../utils/response.builder';

export class IngredientController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  async findIngredientById(
    request: FastifyRequest<{ Params: { id?: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;

    if (id === null || id === undefined || (id && id.length === 0)) {
      throw new InvalidPathParameter('id');
    }

    const query = new FinderIngredientByIdQuery(id);

    const ingredient = await this.queryBus.dispatch<
      FinderIngredientByIdQuery,
      IngredientDto
    >(query);

    return ResponseBuilder.success({
      reply,
      data: ingredient.data,
    });
  }

  async getAllIngredients(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const query = new GetterAllIngredientsQuery();

    const ingredients = await this.queryBus.dispatch<
      GetterAllIngredientsQuery,
      IngredientDto[]
    >(query);

    return await ResponseBuilder.success({
      reply,
      data: ingredients.data,
    });
  }

  async createIngredient(
    request: FastifyRequest<{ Body?: { name?: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const ingredientData = request.body;

    if (ingredientData === undefined) {
      throw new InfrastructureError(
        'Body has not provided',
        new InvalidRequestBody(['body request is requiered'])
      );
    }

    const { name } = ingredientData;

    if (name === undefined || name.length === 0) {
      throw new InfrastructureError(
        'Body has not correct schema',
        new InvalidRequestBody(['name is requiered and must be a valid string'])
      );
    }

    const command = new CreatorIngredientCommand(
      { name },
      { reqId: request.id }
    );

    await this.commandBus.dispatch(command);

    return await ResponseBuilder.successNoContent({
      reply,
      statusCode: HttpStatusCode.CREATED,
    });
  }
}
