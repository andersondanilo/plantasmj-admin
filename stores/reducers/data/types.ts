export enum ActionType {
  ReplaceCategory = 'REPLACE_CATEGORY',
  SetCategoriesById = 'SET_CATEGORIES_BY_ID',
  RemoveCategory = 'REMOVE_CATEGORY',
}

export interface IState {
  categoriesById: ICategoriesById;
}

export interface ICategoriesById {
  [id: string]: ICategory;
}

export interface ICategory {
  id: string;
  name: string;
  order: number | null;
}

export interface IAddCategoryPayload {
  category: ICategory;
}

export interface ISetCategoriesByIdPayload {
  categoriesById: Record<string, ICategory>;
}

export interface IRemoveCategoryPayload {
  id: string;
}

export interface IAction {
  type: ActionType;
  payload: IAddCategoryPayload | ISetCategoriesByIdPayload | IRemoveCategoryPayload;
}
