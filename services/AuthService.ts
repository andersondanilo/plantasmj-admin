import { oauthToken, getCurrentUser } from './ApiService';
import { store } from '../stores/main';
import { setLogin } from '../stores/reducers/auth/actionCreators';

export async function login(username: string, password: string): Promise<boolean> {
  const { accessToken, refreshToken } = await oauthToken({
    grant_type: 'password',
    username,
    password,
  });

  store.dispatch(
    setLogin({
      accessTokenVerified: true,
      accessToken,
      refreshToken,
    }),
  );

  return true;
}

export async function validateCurrentAccessToken(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
}
