'use strict';

var ProfilesManager = require('./ProfilesManager');
var generateError = require('./generateError')
const { merge } = require('../utils')





/**
 * Create new instance of esii
 * 
 * @param {Object} instanceConfig - The config parameters for the instance { client_id, secret_key, callback_uri, scopes, {state} = undefined}
 * 
 *  client_id: the client id
 *  secret_key: secret key
 *  callback_uri: uri users should be directed to after sso authorization
 *  scopes: scopes as copied from your project in https://developers.eveonline.com, space-separated
 *  response_type: "code" for now, but may add support for the implicit procedure later on
 *  state: any state to be returned as a param in your callback uri, optional
 */
function Esii(instanceConfig) {
    const def = instanceConfig['default']
    this.defaults = {
        client_id: def['client_id'],
        secret_key: def['secret_key'],
        callback_uri: def['callback_uri'],
        scopes: def['scopes'],
        scopesObject: (def['scopes'] !== undefined ? def['scopes'].split(" ") : undefined),
        response_type: "code",
        state: def['state']
    }
    this.profiles = new ProfilesManager();
}

/**
 * Generate Url users can follow to begin the auth process
 * 
 * @return {string} - Generated Url
 */
Esii.prototype.generateSSOUrl = function generateSSOUrl() {

    if (this.defaults.client_id === undefined || this.defaults.callback_uri === undefined) {
            throw generateError("Either client_id or callback_uri is missing in your Esii instance", "MissingPropertiesError")
    }

    const baseUrl = "https://login.eveonline.com/oauth/authorize?" +
        "&response_type=" + this.defaults.response_type +
        "&redirect_uri=" + this.defaults.callback_uri +
        "&client_id=" + this.defaults.client_id +
        (this.defaults.scopes ? "&scope=" + this.defaults.scopes : "") +
        (this.defaults.state ? "&state=" + this.defaults.state : "")


    return baseUrl;
}

/**
 * Merges instance config with config specified
 * 
 * @param {Object} instanceConfig - config to be merged.
 * 
 */
Esii.prototype.mergeInstanceConfig = function mergeInstanceConfig(instanceConfig) {
    this.defaults = merge(this.defaults, instanceConfig);
}

Esii.prototype.addProfile = function addProfile(code) {

    if (this.defaults.client_id === undefined || this.defaults.secret_key === undefined) {
        throw generateError("Either client_id or secret_key is missing in your Esii instance", "MissingPropertiesError")
    }

    const encodedClientIdSecret = Buffer.from(this.defaults.client_id + ":" + this.defaults.secret_key).toString('base64');


    return this.profiles.generateProfileFromCode(code, encodedClientIdSecret)

}

Esii.prototype.listProfiles = function listProfiles() {
    return this.profiles.toString()
}


module.exports = Esii