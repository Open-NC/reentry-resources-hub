const service = require('./service');
const { sendSuccess, sendError } = require('./responses');

function sendEmail(req, res) {
  return Promise.resolve(req)
    .then(request => service.sendEmail(request.body))
    .then(email => email.params) // Return the params from the SES email success.
    .then(sendSuccess(res))
    .catch(sendError(res));
}

module.exports = {
  sendEmail,
};
