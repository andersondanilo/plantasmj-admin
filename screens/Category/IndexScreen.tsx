import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { IRootState } from '../../stores/reducers/types';
import { ICategory, ICategoriesById } from '../../stores/reducers/data/types';
import { setCategoriesById } from '../../stores/reducers/data/actionCreators';
import { connect, ConnectedProps } from 'react-redux';
import { listCategories } from '../../services/ApiService';
import { ActivityIndicator, Colors, List, Text, Divider } from 'react-native-paper';
import AddButton from './AddButton';
import FormDialog from './FormDialog';

const mapStateToProps = (state: IRootState) => {
  return {
    categoriesById: state.data.categoriesById,
  };
};

const mapDispatchToProps = { setCategoriesById };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const IndexScreen = (props: Props): ReactElement => {
  const { categoriesById, setCategoriesById } = props;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    listCategories()
      .then((categories) => {
        setLoading(false);

        const categoriesById: Record<string, ICategory> = {};

        for (const category of categories) {
          categoriesById[category.id || ''] = category;
        }

        setCategoriesById({
          categoriesById,
        });
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const orderedCategories = useMemo<Array<ICategory>>(() => {
    if (!categoriesById) {
      return [];
    }

    return Object.values(categoriesById as ICategoriesById).sort((a: ICategory, b: ICategory) => {
      const aOrder = a.order || 1000;
      const bOrder = b.order || 1000;

      if (aOrder < bOrder) {
        return -1;
      }

      if (aOrder > bOrder) {
        return 1;
      }

      return 0;
    });
  }, [categoriesById]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator animating={true} color={Colors.green800} />}
      {orderedCategories.length == 0 && <Text>Nenhuma categoria cadastrada</Text>}
      {orderedCategories.map((category: ICategory) => (
        <React.Fragment key={category.id}>
          <List.Item
            style={styles.listItem}
            title={category.name}
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
            onPress={() => setSelectedCategory(category)}
          />
          <Divider style={styles.listItem} />
        </React.Fragment>
      ))}
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
    alignItems: 'center',
  },
  listItem: {
    width: '100%',
  },
  headerIcon: {},
});

export default connector(IndexScreen);
