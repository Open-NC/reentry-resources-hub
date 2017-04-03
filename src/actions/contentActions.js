import * as types from './actionTypes';
import fetch from 'isomorphic-fetch';

export function loadContentSuccess(content) {
  return { type: types.LOAD_CONTENT_SUCCESS, content: content };
}

export function loadServerContentSuccess(content) {
  return { type: LOAD_SERVER_CONTENT_SUCCESS, content: content };
}

export function loadContent(content) {
  return function(dispatch) {
    return fetchContent().then(content => {
      dispatch(loadContentSuccess(content));
    }).catch(error => {
      throw(error);
    });
  }
}

export function loadServerContent(content) {
  return function(dispatch) {
    return (content => {
      dispatch(loadServerContentSuccess(content));
    });
  }
}

//TODO: Create dispatch action for on failure requestContent



// export function loadContent() {
//   return function(dispatch) {
//     return
//   }
// }

function fetchContent() {
  return dispatch => {
    dispatch(createContent())
    return fetch(`/api/${jurisdiction}/${topic}`)
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
        //this.setState({ data: content });
        this.props.actions.createContent(this.state.content);
      });
  }
}
