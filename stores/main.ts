import { createStore, combineReducers } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './reducers/auth';
import { IState as IAuthState, IAction as IAuthAction } from './reducers/auth/types';
import { IRootState, IRootAction } from './reducers/types';

// const rootPersistConfig = {
//   key: 'app_root',
//   storage: AsyncStorage,
//   whitelist: ['']
// }

const authPersistConfig = {
  key: 'app_auth',
  storage: AsyncStorage,
  whitelist: ['accessToken', 'refreshToken']
};

const rootReducer = combineReducers<IRootState>({
  auth: persistReducer<IAuthState, IAuthAction>(authPersistConfig, authReducer)
});

// const store = createStore(persistReducer<IRootState>(rootPersistConfig, rootReducer));
const store = createStore(rootReducer);

const persistor = persistStore(store);

export {
  store,
  persistor
}
