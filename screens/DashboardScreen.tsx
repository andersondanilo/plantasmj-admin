import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface IProps {
  navigation: NavigationProp;
}

const DashboardScreen = ({ navigation }: IProps): ReactElement => {
  const onCategoryAction = () => {
    navigation.push('CategoryIndex');
  };

  return (
    <View style={styles.container}>
      <Button style={styles.button} icon="alpha-c-box" mode="contained" onPress={onCategoryAction}>
        Categorias
      </Button>
      <Button style={styles.button} icon="alpha-p-box" mode="contained">
        Produtos
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default DashboardScreen;
