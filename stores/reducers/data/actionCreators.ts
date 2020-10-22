import { ActionType, IAction, IAddCategoryPayload, ISetCategoriesByIdPayload, IRemoveCategoryPayload } from './types';

export function replaceCategory(payload: IAddCategoryPayload): IAction {
  return { type: ActionType.ReplaceCategory, payload };
}

export function setCategoriesById(payload: ISetCategoriesByIdPayload): IAction {
  return { type: ActionType.SetCategoriesById, payload };
}

export function removeCategory(payload: IRemoveCategoryPayload): IAction {
  return { type: ActionType.RemoveCategory, payload };
}
