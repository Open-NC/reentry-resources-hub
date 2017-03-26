import * as types from './actionTypes';
import fetch from 'isomorphic-fetch';

export function createContent(content) {
  return { type: types.CREATE_CONTENT, content: content };
}

function requestContent(content) {
  return {
    type: REQUEST_CONTENT,
    content
  }
}

function receiveContent(content, json) {
  return {
    type: RECEIVE_CONTENT,
    content
  }
}

//TODO: Create dispatch action for on failure requestContent



// export function loadContent() {
//   return function(dispatch) {
//     return
//   }
// }

// function fetchContent() {
//   return dispatch => {
//     dispatch(createContent())
//     return fetch(`/api/${jurisdiction}/${topic}`)
//       .then((response) => {
//         if (response.status >= 400) {
//           throw new Error('Bad response from server');
//         }
//         console.log('Layout response');
//         console.log(response);
//         return response.json();
//       })
//       .then((content) => {
//         console.log('Layout content');
//         console.log(content);
//         //this.setState({ data: content });
//         this.props.actions.createContent(this.state.content);
//       });
//   }
// }
