import { combineReducers } from 'redux';
import content from './contentReducer';

const rootReducer = combineReducers({
  // ES6 shorthand property name. Could also use long form ie: content: content
  content,
});

export default rootReducer;
