import type { FastifyReply, FastifyRequest } from 'fastify';

import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { FinderIngredientByIdQuery } from '@src/bounded-contexts/ingredients/application/queries/finder-ingredient-by-id/finder-ingredient-by-id.query';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { ResponseBuilder } from '../utils/response.builder';

export class IngredientController {
  constructor(private readonly queryBus: QueryBus) {}

  async findIngredientById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;

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
}
