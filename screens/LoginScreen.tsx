import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Card, Title, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { login } from '../services/api';
import { parseErrorMessage } from '../services/utils';
import { ActivityIndicator, Colors, Paragraph } from 'react-native-paper';
import ErrorAlert from '../components/ErrorAlert';
import { connect } from 'react-redux';
import { IRootState } from '../stores/reducers/types';
import { setTokens } from '../stores/reducers/auth/actionCreators';

interface IProps {
  setTokens: typeof setTokens;
  accessToken: string | null;
}

const LoginScreen = (props: IProps) => {
  const { setTokens, accessToken } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const actionLogin = async () => {
    setTokens({
      accessToken: (new Date).toString(),
      refreshToken: ''
    });
    
    // setIsLoading(true);

    // try {
    //   const result = await login(email, password);
    //   console.log('success response => ', result);
    // } catch (error) {
    //   setErrorMessage(parseErrorMessage(error));
    //   setIsLoading(false);
    // }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/images/logo.png')} />
          </View>
          <TextInput
            style={styles.withMargin}
            label="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.withMargin}
            label="Senha"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Paragraph>
            My access token is {accessToken}
          </Paragraph>
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.green800} />
          ) : (
            <Button
              mode="contained"
              style={styles.withMargin}
              onPress={actionLogin}
            >
              Entrar
            </Button>
          )}
          {errorMessage && <ErrorAlert style={styles.withMargin} message={errorMessage} />}
        </Card.Content>
      </Card>
    </View>
  );
}

const mapStateToProps = (state: IRootState) => {
  return {
    accessToken: state.auth.accessToken
  }
};

const mapDispatchToProps = { setTokens };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // justifyContent: 'center',
  },
  card: {
    maxWidth: 700,
    margin: 'auto'
  },
  logoContainer: {
    alignItems: 'center'
  },
  logo: {
    height: 100,
    width: 300,
    margin: 10,
    resizeMode: 'stretch'
  },
  withMargin: {
    margin: 10
  }
})
