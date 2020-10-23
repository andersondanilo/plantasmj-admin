import React, { ReactElement, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CategoryIndexScreen from '../screens/Category/IndexScreen';
import ProductCategoriesScreen from '../screens/Product/CategoriesScreen';
import ProductIndexScreen from '../screens/Product/IndexScreen';
import { IRootState } from '../stores/reducers/types';
import { connect, ConnectedProps } from 'react-redux';
import { validateCurrentAccessToken } from '../services/AuthService';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const mapStateToProps = (state: IRootState) => {
  return {
    accessToken: state.auth.accessToken,
    accessTokenVerified: state.auth.accessTokenVerified,
  };
};

const connector = connect(mapStateToProps, null);

type PropsFromRedux = ConnectedProps<typeof connector>;

// type Props = PropsFromRedux & {};
type Props = PropsFromRedux;

type LoginState = 'verifying' | 'guest' | 'logged';

const AppNavigator = (props: Props): ReactElement => {
  const { accessToken, accessTokenVerified } = props;
  const [loginState, setLoginState] = useState<LoginState>(accessToken ? 'verifying' : 'guest');
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (loginState !== 'verifying') {
        return;
      }

      if (await validateCurrentAccessToken()) {
        setLoginState('logged');
      } else {
        setLoginState('guest');
      }
    })();
  }, []);

  useEffect(() => {
    if (accessTokenVerified) {
      setLoginState('logged');
    }
  }, [accessTokenVerified]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        headerMode="screen"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {loginState === 'verifying' && (
          <Stack.Screen name="Loading" component={LoadingScreen} options={LoadingScreen.navigationOptions} />
        )}
        {loginState === 'guest' && <Stack.Screen name="Login" component={LoginScreen} />}
        {loginState === 'logged' && (
          <React.Fragment>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="CategoryIndex"
              component={CategoryIndexScreen}
              options={CategoryIndexScreen.navigationOptions}
            />
            <Stack.Screen
              name="ProductCategories"
              component={ProductCategoriesScreen}
              options={ProductCategoriesScreen.navigationOptions}
            />
            <Stack.Screen
              name="ProductIndex"
              component={ProductIndexScreen}
              options={ProductIndexScreen.navigationOptions}
            />
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default connector(AppNavigator);
