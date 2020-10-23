import { createSelector } from 'reselect';
import { IRootState } from './reducers/types';
import { IProduct, ICategory } from './reducers/data/types';

interface IEntityWithOrder {
  order: number | null;
}

export const getOrderedCategories = createSelector(
  (state: IRootState) => {
    return state.data.categoriesById;
  },
  (entitiesById: Record<string, ICategory>): Array<ICategory> => {
    return getOrderedEntitiesWithId(entitiesById) as Array<ICategory>;
  },
);

type ProductSelector = (state: IRootState) => Array<IProduct>;

export const getOrderedProductsFactory = (categoryId: string): ProductSelector => {
  return createSelector(
    (state: IRootState) => {
      return state.data.productsByCategory[categoryId] || {};
    },
    (entitiesById: Record<string, IProduct>): Array<IProduct> => {
      return getOrderedEntitiesWithId(entitiesById) as Array<IProduct>;
    },
  );
};

function getOrderedEntitiesWithId(entitiesById: Record<string, unknown>): Array<unknown> {
  return Object.values(entitiesById as Record<string, IEntityWithOrder>).sort(
    (a: IEntityWithOrder, b: IEntityWithOrder) => {
      const aOrder = a.order || 1000;
      const bOrder = b.order || 1000;

      if (aOrder < bOrder) {
        return -1;
      }

      if (aOrder > bOrder) {
        return 1;
      }

      return 0;
    },
  );
}
