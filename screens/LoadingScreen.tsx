import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { StackNavigationOptions } from '@react-navigation/stack';
import params from '../configs/parameters';

const LoadingScreen = (): JSX.Element => {
  const win = Dimensions.get('window');
  const logoWidth = Math.min(Math.min(win.width, win.height) - 50, 300);

  return (
    <View style={styles.container}>
      <Image
        style={[{ width: logoWidth, height: logoWidth }, styles.logo]}
        source={require('../assets/images/splash.png')}
      />
      <ActivityIndicator style={styles.indicator} animating={true} color={Colors.green800} />
    </View>
  );
};

LoadingScreen.navigationOptions = (): StackNavigationOptions => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: params.splashBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'stretch',
  },
  indicator: {
    marginTop: 10,
    marginBottom: 100,
  },
});

export default LoadingScreen;
