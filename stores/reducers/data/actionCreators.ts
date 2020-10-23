import {
  ActionType,
  IAction,
  IAddCategoryPayload,
  ISetCategoriesByIdPayload,
  IRemoveCategoryPayload,
  IAddProductPayload,
  ISetProductsByIdPayload,
  IRemoveProductPayload,
} from './types';

export function replaceCategory(payload: IAddCategoryPayload): IAction {
  return { type: ActionType.ReplaceCategory, payload };
}

export function setCategoriesById(payload: ISetCategoriesByIdPayload): IAction {
  return { type: ActionType.SetCategoriesById, payload };
}

export function removeCategory(payload: IRemoveCategoryPayload): IAction {
  return { type: ActionType.RemoveCategory, payload };
}

export function replaceProduct(payload: IAddProductPayload): IAction {
  return { type: ActionType.ReplaceProduct, payload };
}

export function setProductsById(payload: ISetProductsByIdPayload): IAction {
  return { type: ActionType.SetProductsById, payload };
}

export function removeProduct(payload: IRemoveProductPayload): IAction {
  return { type: ActionType.RemoveProduct, payload };
}
