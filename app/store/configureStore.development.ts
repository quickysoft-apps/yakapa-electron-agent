import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, push } from 'react-router-redux';
import { agentMiddleware, listenAgentServer } from './agentMiddleware';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

import { Actions } from '../actions';

import { Store } from 'redux';

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?(a: any): void;
};

declare const module: NodeModule & {
  hot?: {
    accept(...args: any[]): any;
  }
};

const actionCreators = Object.assign({},
  Actions.Agent,
  Actions.App,
  Actions.Chat,
  Actions.Configuration,
  Actions.JobHistory,
  Actions.JobManager,
  Actions.JobRunner, {
    push
  });

const logger = (createLogger as any)({
  level: 'info',
  collapsed: true
});

const history = createHashHistory();
const router = routerMiddleware(history);
const agent = agentMiddleware();

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
    actionCreators
  }) as any :
  compose;
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
  applyMiddleware(thunk, router, logger, agent)
);

export = {
  history,
  configureStore(initialState: object | void): Store<void | object> {
    const store = createStore(rootReducer, initialState, enhancer);

    listenAgentServer(store);

    if (module.hot) {
      module.hot.accept('../reducers', () =>
        store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
      );
    }

    return store;
  }
};
