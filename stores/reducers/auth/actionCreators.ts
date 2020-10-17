import { ActionType, ISetTokensPayload, ISetLoginPayload } from './types';

export function setTokens(payload: ISetTokensPayload) {
  return { type: ActionType.SetTokens, payload };
}

export function setLogin(payload: ISetLoginPayload) {
  return { type: ActionType.SetTokens, payload };
}
