import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import Header from './components/Header'
import theme from './configs/theme'
import { Provider as StoreProvider } from 'react-redux';
import { store as mainStore, persistor } from './stores/main';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, Colors } from 'react-native-paper';

const Stack = createStackNavigator();

export default function App() {
  return (
    <StoreProvider store={mainStore}>
      <PaperProvider theme={theme}>
        <PersistGate
          persistor={persistor}
          loading={<ActivityIndicator animating={true} color={Colors.green800} />}
          >
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              headerMode="screen"
              screenOptions={{
                header: ({ scene, previous, navigation }) => (
                  <Header scene={scene} previous={previous} navigation={navigation} />
                ),
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </PaperProvider>
    </StoreProvider>
  );
}
