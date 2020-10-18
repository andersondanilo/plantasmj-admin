import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { login } from '../services/AuthService';
import { parseErrorMessage } from '../services/UtilsService';
import { ActivityIndicator, Colors } from 'react-native-paper';
import ErrorAlert from '../components/ErrorAlert';

const LoginScreen = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const actionLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(email, password);
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/images/logo.png')} />
          </View>
          <TextInput style={styles.withMargin} label="E-mail" value={email} onChangeText={setEmail} />
          <TextInput
            style={styles.withMargin}
            label="Senha"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.green800} />
          ) : (
            <Button mode="contained" style={styles.withMargin} onPress={actionLogin}>
              Entrar
            </Button>
          )}
          {errorMessage && <ErrorAlert style={styles.withMargin} message={errorMessage} />}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // justifyContent: 'center',
  },
  card: {
    maxWidth: 700,
    margin: 'auto',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 300,
    margin: 10,
    resizeMode: 'stretch',
  },
  withMargin: {
    margin: 10,
  },
});

export default LoginScreen;
