import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IRootState } from '../../stores/reducers/types';
import { IProduct } from '../../stores/reducers/data/types';
import { setProductsById } from '../../stores/reducers/data/actionCreators';
import { connect, ConnectedProps } from 'react-redux';
import { listProducts } from '../../services/ApiService';
import { ActivityIndicator, Colors, List, Text, Divider } from 'react-native-paper';
import AddButton from './AddButton';
import FormDialog from './FormDialog';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigators/types';
import { getOrderedProductsFactory } from '../../stores/selectors';
import { indexProductsById } from '../../stores/utils';

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

const IndexScreen = (props: Props): ReactElement => {
  const { route, orderedProducts, setProductsById } = props;
  const { category } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

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

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator animating={true} color={Colors.green800} />}
      {orderedProducts.length == 0 && <Text>Nenhum produto nesta categoria</Text>}
      {orderedProducts.map((product: IProduct) => (
        <React.Fragment key={category.id}>
          <List.Item
            style={styles.listItem}
            title={product.name}
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
            onPress={() => setSelectedProduct(product)}
          />
          <Divider style={styles.listItem} />
        </React.Fragment>
      ))}
      <AddButton category={category} />
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
    padding: 10,
    alignItems: 'center',
  },
  listItem: {
    width: '100%',
  },
  headerIcon: {},
});

export default connector(IndexScreen);
