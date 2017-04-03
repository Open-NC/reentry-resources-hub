import * as types from '../actions/actionTypes';

export default function contentReducer(state = {}, action) {
  switch(action.type) {
    case types.LOAD_CONTENT_SUCCESS:
      return action.content;
    case types.LOAD_SERVER_CONTENT_SUCCESS:
      return action.content;
    default:
      return state;
  }
}
