import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header({ scene, previous, navigation } : any) {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;
  const theme = useTheme();

  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.primary } }}>
      {previous && (
        <Appbar.BackAction
          onPress={navigation.pop}
          color={theme.colors.accent}
        />
      )}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};
