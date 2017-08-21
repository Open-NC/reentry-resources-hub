const SES = require('aws-sdk/clients/ses');

function sendEmail(payload) {
  const ses = new SES({
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_DEFAULT_REGION,
  });

  const subject = 'test';
  const body = `${payload.name} has the following message for you: <br /> ${payload.message} <br /> - ${payload.email}`;

  const email = {
    Source: process.env.SES_EMAIL,
    Destination: { ToAddresses: [process.env.SES_EMAIL] },
    Message: {
      Subject: {
        Data: subject || 'Inquiry from reentry resources hub.',
      },
      Body: {
        Html: {
          Data: body || 'Something went wrong in the sending of this email.',
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
