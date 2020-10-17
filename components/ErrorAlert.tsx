import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from 'react-native-paper';

type IProps = ViewProps & {
  message: string | null;
}

export default function ErrorAlert(props: IProps) {
  const { message } = props;

  props = {
    ...props,
    style: [props.style, styles.container]
  }

  return (
    <View {...props}>
      <MaterialCommunityIcons style={styles.icon} name="alert-box-outline" size={32} color="white" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.red800,
    padding: 10
  },
  icon: {
    width: 32
  },
  text: {
    color: 'white',
    paddingLeft: 10,
    paddingTop: 7
  }
});
