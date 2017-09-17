import { IAction, IActionWithPayload } from '../actions/helpers';
import { Actions } from '../actions';
import { AgentError } from '../actions/agent';

export interface AgentState {
  connected?: boolean;
  connectionError?: AgentError;
  socketError?: AgentError;
  trusted?: boolean;
  pongMs?: number;
  connectionDate?: Date;
}

export function agent(state: AgentState = {}, action: IAction) {

  if (Actions.Agent.pong.test(action)) {
    return {
      ...state,
      pongMs: action.payload,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifySuccessfulConnection.test(action)) {
    return {
      ...state,
      connected: true,
      connectionDate: new Date(Date.now()),
      trusted: false,
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifyReadiness.test(action)) {
    return {
      ...state,
      connected: true,
      trusted: true,      
      socketError: undefined,
      connectionError: undefined
    };
  }

  if (Actions.Agent.notifySocketError.test(action)) {
    const actionWithPayload = action as IActionWithPayload<AgentError>;
    return {
      ...state,
      connected: actionWithPayload.payload.type === 'DiscoverError' ? false : true,
      trusted: false,
      socketError: actionWithPayload.payload,
      connectionError: undefined,
    };
  }

  if (Actions.Agent.notifyConnectionError.test(action)) {
    const actionWithPayload = action as IActionWithPayload<AgentError>;
    return {
      ...state,
      connected: actionWithPayload.payload.type === 'TransportError' ? false : true,
      trusted: false,
      socketError: undefined,
      connectionError: actionWithPayload.payload
    };
  }

  return state;
}

