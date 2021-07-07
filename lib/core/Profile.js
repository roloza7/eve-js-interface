'use strict';

const axios = require('axios')
var generateError = require('./generateError')
const ContractsManager = require('./ContractsManager')

function Profile(configs) {

    this.access_token = configs['access_token']
    this.refresh_token = configs['refresh_token']
    this.token_type = configs['token_type']
    this.character_id = configs['character_id']
    this.character_name = configs['character_name']
    this.token_expires = configs['token_expires'] 

    this.interfaces = {}

}


/**
 * Object-like accessor for contract manager of given character profile.
 * 
 * @param {*} identifier - name or id of contract
 * @returns 
 */
Profile.prototype.Contracts = function Contracts(identifier) {
    if (this.interfaces.contracts === undefined) {
        this.interfaces.contracts = new ContractsManager(this)
    }

    return this.interfaces.contracts
}

Profile.prototype.Corporation function 

module.exports = Profile