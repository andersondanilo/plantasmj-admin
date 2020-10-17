import { IState, IAction, ActionType, ISetTokensPayload, ISetLoginPayload } from './types';

const defaultAuthState: IState = {
  accessTokenVerified: false,
  accessToken: null,
  refreshToken: null,
}

export default function reducer (state = defaultAuthState, action: IAction): IState {
  const payload = action.payload;

  switch (action.type) {
    case ActionType.SetTokens:
      return {
        ...state,
        accessToken: (payload as ISetTokensPayload).accessToken,
        refreshToken: (payload as ISetTokensPayload).refreshToken
      }
    case ActionType.SetLogin:
      return {
        ...state,
        accessTokenVerified: (payload as ISetLoginPayload).accessTokenVerified,
        accessToken: (payload as ISetLoginPayload).accessToken,
        refreshToken: (payload as ISetLoginPayload).refreshToken
      }
    default:
      return state
  }
}
