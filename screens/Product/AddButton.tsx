import React, { ReactElement, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { ICategory } from '../../stores/reducers/data/types';
import FormDialog from './FormDialog';

type Props = {
  category: ICategory;
};

const AddButton = (props: Props): ReactElement => {
  const { category } = props;
  const [showDialog, setShowDialog] = useState(false);

  return (
    <React.Fragment>
      <FAB style={styles.fab} icon="plus" onPress={() => setShowDialog(true)} />
      <FormDialog category={category} visible={showDialog} onDismiss={() => setShowDialog(false)} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AddButton;
