import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

const IndexScreen = (): ReactElement => {
  return (
    <View style={styles.container}>
      <Text>Test</Text>
    </View>
  );
};

const HeaderRight = (): ReactElement => {
  return <IconButton onPress={() => console.log('testing')} icon="plus-circle-outline" color="#fff" />;
};

IndexScreen.navigationOptions = {
  headerRight: HeaderRight,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
});

export default IndexScreen;
