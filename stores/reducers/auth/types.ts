export enum ActionType {
  SetTokens = 'AUTH_SET_TOKENS',
  SetLogin = 'AUTH_SET_LOGIN',
}

export interface IState {
  accessTokenVerified: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface ISetTokensPayload {
  accessToken: string;
  refreshToken: string;
}

export type ISetLoginPayload = ISetTokensPayload & {
  accessTokenVerified: boolean;
};

export interface IAction {
  type: ActionType;
  payload: ISetTokensPayload | ISetLoginPayload;
}
