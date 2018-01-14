const connections = {
  aws: {
    type: 'pg',
    authMethod: 'password',
    host: process.env.dbhost,
    port: process.env.dbport,
    database: process.env.dbdatabase,
    user: process.env.dbuser,
    password: process.env.dbpassword,
  },
};
module.exports = connections;
