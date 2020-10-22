import {
  IState,
  IAction,
  ActionType,
  IAddCategoryPayload,
  ISetCategoriesByIdPayload,
  IRemoveCategoryPayload,
} from './types';
import update from 'immutability-helper';

const defaultState: IState = {
  categoriesById: {},
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
          [(payload as IAddCategoryPayload).category.id as string]: {
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
    default:
      return state;
  }
}
