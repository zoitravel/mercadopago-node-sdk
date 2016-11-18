require('dotenv').config({silent: true, path: 'sdk-nodejs/.env'});

module.exports.ACCESS_TOKEN = process.env.ACCESS_TOKEN;
module.exports.PUBLIC_KEY = process.env.PUBLIC_KEY;
module.exports.CLIENT_ID = process.env.CLIENT_ID;
module.exports.CLIENT_SECRET = process.env.CLIENT_SECRET;