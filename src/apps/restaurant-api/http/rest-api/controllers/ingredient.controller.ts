import type { FastifyReply } from 'fastify';

import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import { ResponseBuilder } from '../utils/response.builder';

export class IngredientController {
  constructor(private readonly queryBus: QueryBus) {}

  async getAllIngredients(reply: FastifyReply): Promise<FastifyReply> {
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
