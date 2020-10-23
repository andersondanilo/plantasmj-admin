import React, { ReactElement, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, Colors } from 'react-native-paper';
import { replaceProduct, removeProduct as dataRemoveProduct } from '../../stores/reducers/data/actionCreators';
import { createProduct, updateProduct, removeProduct as apiRemoveProduct } from '../../services/ApiService';
import { parseErrorMessage } from '../../services/UtilsService';
import ErrorAlert from '../../components/ErrorAlert';
import { connect, ConnectedProps } from 'react-redux';
import { ICategory, IProduct } from '../../stores/reducers/data/types';

const mapDispatchToProps = { replaceProduct, dataRemoveProduct };

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  category: ICategory;
  product?: IProduct;
  visible: boolean;
  onDismiss: () => void;
};

const FormDialog = (props: Props): ReactElement => {
  const { visible, onDismiss, category, product, replaceProduct, dataRemoveProduct } = props;
  const [name, setName] = useState(product ? product.name : '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSaveAction = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (name === null || name === '') {
      setErrorMessage('Preencha um nome para categoria');
      return;
    }

    try {
      const newEntity: IProduct = product
        ? await updateProduct(category.id, product.id, { name })
        : await createProduct(category.id, { name });

      replaceProduct({ categoryId: category.id, product: newEntity });
      setName('');
      onDismiss();
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
      setLoading(false);
    }
  };

  const onDeleteAction = async () => {
    if (!product) {
      return null;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await apiRemoveProduct(category.id, product.id);
      dataRemoveProduct({
        categoryId: category.id,
        id: product.id,
      });

      setLoading(false);
      onDismiss();
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          <Text>{category ? 'Atualizar' : 'Adicionar'} produto</Text>
        </Dialog.Title>
        <Dialog.Content>
          <TextInput style={styles.withMargin} label="Nome" value={name} onChangeText={setName} />
          {errorMessage && <ErrorAlert style={styles.withMargin} message={errorMessage} />}
        </Dialog.Content>
        <Dialog.Actions>
          {category && (
            <Button onPress={onDeleteAction} mode="contained" icon="delete" color={Colors.red800}>
              Remover
            </Button>
          )}
          <Button style={{ marginLeft: 'auto' }} onPress={onDismiss}>
            Cancelar
          </Button>
          <Button loading={loading} onPress={onSaveAction}>
            Salvar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog:
    Platform.OS === 'web'
      ? {
          maxWidth: 500,
          minWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }
      : {},
  withMargin: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default connector(FormDialog);
