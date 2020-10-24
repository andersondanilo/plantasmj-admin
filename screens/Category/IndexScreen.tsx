import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { IRootState } from '../../stores/reducers/types';
import { ICategory } from '../../stores/reducers/data/types';
import { setCategoriesById } from '../../stores/reducers/data/actionCreators';
import { connect, ConnectedProps } from 'react-redux';
import { listCategories } from '../../services/ApiService';
import { ActivityIndicator, Colors, List, Text, Divider } from 'react-native-paper';
import AddButton from './AddButton';
import FormDialog from './FormDialog';
import { getOrderedCategories } from '../../stores/selectors';
import { indexCategoriesById } from '../../stores/utils';

const mapStateToProps = (state: IRootState) => {
  return {
    orderedCategories: getOrderedCategories(state),
  };
};

const mapDispatchToProps = { setCategoriesById };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const IndexScreen = (props: Props): ReactElement => {
  const { orderedCategories, setCategoriesById } = props;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    listCategories()
      .then((categories) => {
        setLoading(false);
        setCategoriesById({
          categoriesById: indexCategoriesById(categories),
        });
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator animating={true} color={Colors.green800} />}
      {orderedCategories.length == 0 && <Text>Nenhuma categoria cadastrada</Text>}
      <FlatList
        data={orderedCategories}
        renderItem={({ item: category }) => {
          return (
            <React.Fragment key={category.id}>
              <List.Item
                style={styles.listItem}
                title={category.name}
                left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
                onPress={() => setSelectedCategory(category)}
              />
              <Divider />
            </React.Fragment>
          );
        }}
      />
      <AddButton />
      {selectedCategory && (
        <FormDialog category={selectedCategory} visible={true} onDismiss={() => setSelectedCategory(null)} />
      )}
    </View>
  );
};

IndexScreen.navigationOptions = {
  headerTitle: 'Categorias',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
  },
  headerIcon: {},
});

export default connector(IndexScreen);
