export enum ActionType {
  ReplaceCategory = 'DATA_REPLACE_CATEGORY',
  SetCategoriesById = 'DATA_SET_CATEGORIES_BY_ID',
  RemoveCategory = 'DATA_REMOVE_CATEGORY',
  ReplaceProduct = 'DATA_REPLACE_PRODUCT',
  SetProductsById = 'DATA_SET_PRODUCTS_BY_ID',
  RemoveProduct = 'DATA_REMOVE_PRODUCT',
}

export interface ICategory {
  id: string;
  name: string;
  order: number | null;
}

export interface ICategoriesById {
  [id: string]: ICategory;
}

export interface IProduct {
  id: string;
  name: string;
  image: string;
}

export interface IProductsById {
  [id: string]: IProduct;
}

export interface IProductsByCategory {
  [categoryId: string]: IProductsById;
}

export interface IState {
  categoriesById: ICategoriesById;
  productsByCategory: IProductsByCategory;
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

export interface IAddProductPayload {
  categoryId: string;
  product: IProduct;
}

export interface ISetProductsByIdPayload {
  categoryId: string;
  productsById: Record<string, IProduct>;
}

export interface IRemoveProductPayload {
  categoryId: string;
  id: string;
}

export interface IAction {
  type: ActionType;
  payload:
    | IAddCategoryPayload
    | ISetCategoriesByIdPayload
    | IRemoveCategoryPayload
    | IAddProductPayload
    | ISetProductsByIdPayload
    | IRemoveProductPayload;
}
