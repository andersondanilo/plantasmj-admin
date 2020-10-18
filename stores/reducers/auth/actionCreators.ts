import { ActionType, IAction, ISetTokensPayload, ISetLoginPayload } from './types';

export function setTokens(payload: ISetTokensPayload): IAction {
  return { type: ActionType.SetTokens, payload };
}

export function setLogin(payload: ISetLoginPayload): IAction {
  return { type: ActionType.SetLogin, payload };
}
