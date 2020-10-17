import params from '../configs/parameters';
import axios from 'axios';

interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export function login (username: string, password: string): Promise<LoginResult> {
  return axios.post(params.apiUrl + '/oauth/token', {
    grant_type: 'password',
    username,
    password
  }).then((response: any) => {
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token
    };
  });
}
