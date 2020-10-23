import {
  IState,
  IAction,
  ActionType,
  IAddCategoryPayload,
  ISetCategoriesByIdPayload,
  IRemoveCategoryPayload,
  IAddProductPayload,
  ISetProductsByIdPayload,
  IRemoveProductPayload,
} from './types';
import update from 'immutability-helper';

const defaultState: IState = {
  categoriesById: {},
  productsByCategory: {},
};

export default function reducer(state = defaultState, action: IAction): IState {
  const payload = action.payload;

  switch (action.type) {
    case ActionType.SetCategoriesById:
      return update(state, {
        categoriesById: {
          $set: (payload as ISetCategoriesByIdPayload).categoriesById,
        },
      });
    case ActionType.ReplaceCategory:
      return update(state, {
        categoriesById: {
          [(payload as IAddCategoryPayload).category.id]: {
            $set: (payload as IAddCategoryPayload).category,
          },
        },
      });
    case ActionType.RemoveCategory:
      return update(state, {
        categoriesById: {
          $unset: [(payload as IRemoveCategoryPayload).id],
        },
      });
    case ActionType.SetProductsById:
      return update(state, {
        productsByCategory: {
          [(payload as ISetProductsByIdPayload).categoryId]: {
            $set: (payload as ISetProductsByIdPayload).productsById,
          },
        },
      });
    case ActionType.ReplaceProduct:
      return update(state, {
        productsByCategory: {
          [(payload as IAddProductPayload).categoryId]: {
            [(payload as IAddProductPayload).product.id]: {
              $set: (payload as IAddProductPayload).product,
            },
          },
        },
      });
    case ActionType.RemoveProduct:
      return update(state, {
        productsByCategory: {
          [(payload as IRemoveProductPayload).categoryId]: {
            $unset: [(payload as IRemoveProductPayload).id],
          },
        },
      });
    default:
      return state;
  }
}
