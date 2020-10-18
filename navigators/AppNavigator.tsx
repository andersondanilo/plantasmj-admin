import React, { ReactElement, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import Header from '../components/Header';
import { IRootState } from '../stores/reducers/types';
import { connect } from 'react-redux';
import { validateCurrentAccessToken } from '../services/AuthService';

const Stack = createStackNavigator();

interface IProps {
  accessToken: string;
  accessTokenVerified: string;
}

type LoginState = 'verifying' | 'guest' | 'logged';

const AppNavigator = (props: IProps): ReactElement => {
  const { accessToken, accessTokenVerified } = props;
  const [loginState, setLoginState] = useState<LoginState>(accessToken ? 'verifying' : 'guest');

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

  let initialRouteName = 'Loading';

  if (loginState === 'guest') {
    initialRouteName = 'Login';
  } else if (loginState === 'logged') {
    initialRouteName = 'Dashboard';
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        headerMode="screen"
        screenOptions={{
          header: Header,
        }}
      >
        {loginState === 'verifying' && (
          <Stack.Screen name="Loading" component={LoadingScreen} options={LoadingScreen.navigationOptions} />
        )}
        {loginState === 'guest' && <Stack.Screen name="Login" component={LoginScreen} />}
        {loginState === 'logged' && <Stack.Screen name="Dashboard" component={DashboardScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: IRootState) => {
  return {
    accessToken: state.auth.accessToken,
    accessTokenVerified: state.auth.accessTokenVerified,
  };
};

export default connect(mapStateToProps, null)(AppNavigator);
