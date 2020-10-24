import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, Colors } from 'react-native-paper';
import { replaceProduct, removeProduct as dataRemoveProduct } from '../../stores/reducers/data/actionCreators';
import { createProduct, updateProduct, removeProduct as apiRemoveProduct } from '../../services/ApiService';
import { parseErrorMessage } from '../../services/UtilsService';
import { IFormDataFile } from '../../services/types';
import ErrorAlert from '../../components/ErrorAlert';
import { connect, ConnectedProps } from 'react-redux';
import { ICategory, IProduct } from '../../stores/reducers/data/types';
import * as ImagePicker from 'expo-image-picker';
import '../../typings/react-native-mime-types/index.d.ts';
import * as mime from 'react-native-mime-types';

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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const image = useMemo<IFormDataFile | null>(() => {
    let name: string | null = null;
    let type: string | null = null;

    if (!imageUri) {
      return null;
    }

    if (/data:image/.test(imageUri)) {
      const match = imageUri.match(/data:(image\/(.+?));/);
      if (match) {
        type = match[1];
        name = 'imagem.' + mime.extension(type);
      } else {
        name = 'ERRO!';
      }
    } else {
      name = imageUri.split(new RegExp('\\\\|/')).pop() || null;
      type = mime.lookup(name || '') || null;
    }

    return {
      uri: imageUri,
      name: name || '',
      type: type || '',
    };
  }, [imageUri]);

  const imageButtonLabel = useMemo(() => {
    if (image) {
      return image.name;
    } else {
      return 'Selecione uma imagem';
    }
  }, [image]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          setErrorMessage('É necessário permitir o acesso a imagens');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      base64: false,
      exif: false,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const onSaveAction = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (name === null || name === '') {
      setErrorMessage('Preencha um nome para categoria');
      return;
    }

    try {
      const newEntity: IProduct = product
        ? await updateProduct(category.id, product.id, { name }, image)
        : await createProduct(category.id, { name }, image);

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
          <Button onPress={pickImage} mode="contained" color={Colors.blue800}>
            {imageButtonLabel}
          </Button>
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
