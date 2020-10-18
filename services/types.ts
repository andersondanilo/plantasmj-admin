export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthTokenRequest {
  grant_type: 'password' | 'refresh_token';
  username?: string;
  password?: string;
  refresh_token?: string;
}

export interface IUser {
  name: string;
  email: string;
}
