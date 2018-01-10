// const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

module.exports = function generateUUID() {
  return uuidv4();
};
