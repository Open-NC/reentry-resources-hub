import React from 'react';
import { Router, browserHistory } from 'react-router';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducers from '../reducers/reducers'
import { routes } from '../routes';
import configureStore from '../store/configureStore';
import { loadContent } from '../actions/contentActions'

//TODO: Check on how to correctly pass initialSates as a parameter here
//const store = configureStore(initialState);

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__
console.log('preloadedState');
console.log(preloadedState);
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
//const store = createStore(reducers, preloadedState)
const store = configureStore(preloadedState);
console.log('store');
console.log(store.getState());
// Load content to store when client loads.
// *** This may need to be handeled by injecting json into index.html head during server render.
//store.dispatch(loadServerContent());

export default class AppRoutes extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    );
  }
}
