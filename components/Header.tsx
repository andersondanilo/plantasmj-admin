import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export default function Header(props: any): JSX.Element {
  const { scene, previous, navigation } = props;
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
      {previous && <Appbar.BackAction onPress={navigation.pop} color={theme.colors.accent} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
