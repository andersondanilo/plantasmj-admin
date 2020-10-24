import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IRootState } from '../../stores/reducers/types';
import { ICategory } from '../../stores/reducers/data/types';
import { setCategoriesById } from '../../stores/reducers/data/actionCreators';
import { connect, ConnectedProps } from 'react-redux';
import { listCategories } from '../../services/ApiService';
import { ActivityIndicator, Colors, List, Text, Divider } from 'react-native-paper';
import { getOrderedCategories } from '../../stores/selectors';
import { indexCategoriesById } from '../../stores/utils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigators/types';

const mapStateToProps = (state: IRootState) => {
  return {
    orderedCategories: getOrderedCategories(state),
  };
};

const mapDispatchToProps = { setCategoriesById };

const connector = connect(mapStateToProps, mapDispatchToProps);

type NavigationProp = StackNavigationProp<RootStackParamList, 'ProductCategories'>;

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const CategoriesScreen = (props: Props): ReactElement => {
  const { orderedCategories, setCategoriesById } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

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

  const onPressCategory = (category: ICategory): void => {
    navigation.navigate('ProductIndex', {
      category: category,
    });
  };

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
                onPress={() => onPressCategory(category)}
              />
              <Divider />
            </React.Fragment>
          );
        }}
      />
    </View>
  );
};

CategoriesScreen.navigationOptions = {
  headerTitle: 'Selecione a categoria',
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

export default connector(CategoriesScreen);
