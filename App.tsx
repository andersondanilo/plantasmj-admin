import React from 'react';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './configs/theme';
import { Provider as StoreProvider } from 'react-redux';
import { store as mainStore, persistor } from './stores/main';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigators/AppNavigator';
import LoadingScreen from './screens/LoadingScreen';

export default function App(): JSX.Element {
  return (
    <StoreProvider store={mainStore}>
      <PaperProvider theme={theme}>
        <PersistGate persistor={persistor} loading={LoadingScreen()}>
          <AppNavigator />
        </PersistGate>
      </PaperProvider>
    </StoreProvider>
  );
}
