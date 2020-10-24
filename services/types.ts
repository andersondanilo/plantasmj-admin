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

export interface IFormDataFile {
  uri: string;
  name: string;
  type: string;
}

export interface HTTPResponse<T> {
  status: number;
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class HTTPError<T = any> extends Error {
  public response: HTTPResponse<T> | null = null;
}
