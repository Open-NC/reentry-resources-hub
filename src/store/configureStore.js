import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
  console.log('initialState');
  console.log(initialState);
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, reduxImmutableStateInvariant())
  );
}
