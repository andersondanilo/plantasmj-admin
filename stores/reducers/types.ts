import { IState as IAuthState, IAction as IAuthAction } from './auth/types';
import { PersistPartial } from 'redux-persist/lib/persistReducer';

export interface IRootState {
  auth: IAuthState & PersistPartial;
};

export type IRootAction = IAuthAction;

