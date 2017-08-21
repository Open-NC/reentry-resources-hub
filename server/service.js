const SES = require('aws-sdk/clients/ses');

function sendEmail(payload) {
  const ses = new SES({
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_DEFAULT_REGION,
  });

  const subject = 'Reentry Resources Contact Form';

  // TODO: Consider using an email templating service like EJS for building a proper email.
  const body = `${payload.name} has the following message for you: <br /> ${payload.message} <br /> - ${payload.email}`;

  // This implementation will send an email from the dedicated Reentry email address to itself.
  const email = {
    Source: process.env.SES_EMAIL,
    Destination: { ToAddresses: ['jason@codeforgreensboro.org', 'eric.jackson@democracyapps.org'] },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
  };

  return ses.sendEmail(email, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  sendEmail,
};
