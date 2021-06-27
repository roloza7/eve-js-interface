const esii = require('./index.js')

esii.mergeInstanceConfig({
    client_id: "{your client id}",
    callback_uri: "{your callback uri}",
    secret_key: "{your secret key}"
})

console.log(esii.generateSSOUrl())

esii.addProfile('abc')