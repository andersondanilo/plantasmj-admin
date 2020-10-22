import { IState as IAuthState, IAction as IAuthAction } from './auth/types';
import { IState as IDataState, IAction as IDataAction } from './data/types';
import { PersistPartial } from 'redux-persist/lib/persistReducer';

export interface IRootState {
  auth: IAuthState & PersistPartial;
  data: IDataState;
}

export type IRootAction = IAuthAction | IDataAction;
