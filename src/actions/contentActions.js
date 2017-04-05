import * as types from './actionTypes';
import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

export function loadContentSuccess(content) {
  return { type: types.LOAD_CONTENT_SUCCESS, content };
}

// This is a thunk
export function loadContent(jurisdiction, topic) {
  return dispatch => {
    fetch(`/api/${jurisdiction}/${topic}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }
        console.log('Layout response');
        console.log(response);
        return response.json();
      })
      .then((content) => {
        console.log('Layout content');
        console.log(content);
        dispatch(loadContentSuccess(content));
      });
  }
}

//TODO: Create dispatch action for on failure requestContent
