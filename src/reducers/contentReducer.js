import * as types from '../actions/actionTypes';

export default function contentReducer(state = {}, action) {
  switch(action.type) {
    case types.CREATE_CONTENT:
      return Object.assign({}, action.content);
    default:
      return state;
  }
}
