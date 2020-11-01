import React, { ReactElement, useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { IRootState } from '../../stores/reducers/types';
import { IProduct } from '../../stores/reducers/data/types';
import { setProductsById } from '../../stores/reducers/data/actionCreators';
import { connect, ConnectedProps } from 'react-redux';
import { listProducts } from '../../services/ApiService';
import { ActivityIndicator, Colors, Button, Text, Card, Searchbar } from 'react-native-paper';
import AddButton from './AddButton';
import FormDialog from './FormDialog';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigators/types';
import { getOrderedProductsFactory } from '../../stores/selectors';
import { indexProductsById } from '../../stores/utils';
import { filter, debounce } from 'lodash';

type ComponentRouteProp = RouteProp<RootStackParamList, 'ProductIndex'>;

type PropsWithRoute = {
  route: ComponentRouteProp;
};

const mapStateToProps = (state: IRootState, props: PropsWithRoute) => {
  return {
    orderedProducts: getOrderedProductsFactory(props.route.params.category.id)(state),
  };
};

const mapDispatchToProps = { setProductsById };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  route: ComponentRouteProp;
};

const cardMaxWidth = 400;
const cardMargin = 10;

const IndexScreen = (props: Props): ReactElement => {
  const { route, orderedProducts, setProductsById } = props;
  const { category } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = React.useState('');
  const win = Dimensions.get('window');
  const numberOfColumns = Math.trunc(win.width / (cardMaxWidth + cardMargin * 2));

  const filteredProducts = useMemo<Array<IProduct>>(() => {
    const re = new RegExp(appliedSearchQuery.replace(/ /g, '.+'), 'i');

    return filter(orderedProducts, (product: IProduct) => re.test(product.name));
  }, [orderedProducts, appliedSearchQuery]);

  useEffect(() => {
    listProducts(category.id)
      .then((products) => {
        setLoading(false);
        setProductsById({
          categoryId: category.id,
          productsById: indexProductsById(products),
        });
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const onChangeAppliedSearch = useCallback(
    debounce((text: string) => {
      setAppliedSearchQuery(text);
    }, 1000),
    [setAppliedSearchQuery],
  );

  useEffect(() => {
    onChangeAppliedSearch(searchQuery);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <AddButton category={category} />
      {loading && <ActivityIndicator style={styles.withMargin} animating={true} color={Colors.green800} />}
      <Searchbar style={styles.withMargin} placeholder="Filtrar" onChangeText={setSearchQuery} value={searchQuery} />
      {orderedProducts.length == 0 && <Text style={styles.withMargin}>Nenhum produto nesta categoria</Text>}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          return (
            <View key={item.id} style={styles.itemContainer}>
              <Card style={styles.itemCard}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <Card.Title title={item.name} />
                <Card.Actions>
                  <Button onPress={() => setSelectedProduct(item)}>Editar</Button>
                </Card.Actions>
              </Card>
            </View>
          );
        }}
        numColumns={numberOfColumns}
        key={'list-' + numberOfColumns}
        keyExtractor={(item, index) => `${index}-${item.id}`}
      />
      {selectedProduct && (
        <FormDialog
          category={category}
          product={selectedProduct}
          visible={true}
          onDismiss={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
};

IndexScreen.navigationOptions = (props: PropsWithRoute) => {
  return {
    headerTitle: props.route.params.category.name,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  withMargin: {
    margin: 10,
  },
  itemContainer: {
    margin: 'auto',
    flex: 1,
    flexDirection: 'column',
    maxWidth: cardMaxWidth,
  },
  itemCard: {
    margin: cardMargin,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  headerIcon: {},
});

export default connector(IndexScreen);
