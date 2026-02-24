import { CreatorIngredientCommand } from '@src/bounded-contexts/ingredients/application/commands/creator-ingredient/creator-ingredient.command';
import type { IngredientDto } from '@src/bounded-contexts/ingredients/application/ingredient.dto';
import { GetterAllIngredientsQuery } from '@src/bounded-contexts/ingredients/application/queries/getter-all-ingredients/getter-all-ingredients.query';
import { CreatorOrderCommand } from '@src/bounded-contexts/orders/application/commands/creator-order/creator-order.command';
import { OrderStatusEnum } from '@src/bounded-contexts/orders/domain/value-objects/order-status.value-object';
import { CreatorRecipeCommand } from '@src/bounded-contexts/recipes/application/commands/creator-recipe/creator-recipe.command';
import { GetterAllRecipesQuery } from '@src/bounded-contexts/recipes/application/queries/getter-all-recipes/getter-all-recipes.query';
import type { RecipeDto } from '@src/bounded-contexts/recipes/application/recipe.dto';
import type { CommandBus } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { QueryBus } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

import type { DependencyContainer } from '../dependencies/dependency-container';

export async function seedInitialData(
  dependencies: DependencyContainer
): Promise<void> {
  const queryBus = dependencies.resolve<QueryBus>('QueryBus');

  const ingredientsResult = await queryBus.dispatch<
    GetterAllIngredientsQuery,
    IngredientDto[]
  >(new GetterAllIngredientsQuery());

  if (ingredientsResult.data.length > 0) {
    return;
  }

  const commandBus = dependencies.resolve<CommandBus>('CommandBus');

  const seedIngredientNames = ['Tomato', 'Onion', 'Cheese', 'Basil'];

  for (const name of seedIngredientNames) {
    await commandBus.dispatch(
      new CreatorIngredientCommand({ name }, { source: 'seed' })
    );
  }

  const allIngredients = await queryBus.dispatch<
    GetterAllIngredientsQuery,
    IngredientDto[]
  >(new GetterAllIngredientsQuery());

  const selectedIngredientIds = allIngredients.data
    .slice(0, 3)
    .map((item) => item.id);

  await commandBus.dispatch(
    new CreatorRecipeCommand(
      { ingredientsIds: selectedIngredientIds },
      { source: 'seed' }
    )
  );

  const recipesResult = await queryBus.dispatch<
    GetterAllRecipesQuery,
    RecipeDto[]
  >(new GetterAllRecipesQuery({ source: 'seed' }));

  const createdRecipe = recipesResult.data.find((recipe) =>
    selectedIngredientIds.every((id) => recipe.ingredientsIds.includes(id))
  );

  if (!createdRecipe) {
    return;
  }

  await commandBus.dispatch(
    new CreatorOrderCommand(
      {
        recipeId: createdRecipe.id,
        status: OrderStatusEnum.PENDING,
      },
      { source: 'seed' }
    )
  );
}
