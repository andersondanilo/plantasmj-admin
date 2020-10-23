import { ICategory } from '../stores/reducers/data/types';

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Dashboard: undefined;
  CategoryIndex: undefined;
  ProductCategories: undefined;
  ProductIndex: { category: ICategory };
};
