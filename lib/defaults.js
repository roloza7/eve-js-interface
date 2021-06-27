// Fetch client_id, secret_key, callback_uri, scopes
const path = require('path');
require('dotenv').config({
    // going up to root, in the sequence:
    // lib -> eve-js-interface -> node_modules
    path: path.join(__dirname+'../../../.env')
})

var defaults = {
    client_id: process.env.CLIENT_ID,
    secret_key: process.env.SECRET_KEY,
    callback_uri: process.env.CALLBACK_URI,
    scopes: process.env.SCOPES
}

module.exports.default = defaults;