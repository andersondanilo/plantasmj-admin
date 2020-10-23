import { ICategory, IProduct } from './reducers/data/types';

export function indexCategoriesById(entities: Array<ICategory>): Record<string, ICategory> {
  return indexEntityById(entities) as Record<string, ICategory>;
}

export function indexProductsById(entities: Array<IProduct>): Record<string, IProduct> {
  return indexEntityById(entities) as Record<string, IProduct>;
}

interface EntityWithId {
  id: string;
}

function indexEntityById(entities: Array<EntityWithId>): Record<string, EntityWithId> {
  const entitiesById: Record<string, EntityWithId> = {};

  for (const entity of entities) {
    entitiesById[entity.id] = entity;
  }

  return entitiesById;
}
