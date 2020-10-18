import React, { ReactElement } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

const DashboardScreen = (): ReactElement => {
  return (
    <View style={styles.container}>
      <Text>Welcome to dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default DashboardScreen;
