'use strict';

const axios = require('axios')
var generateErorr = require('./generateError')
const ContractSource = require('./Contracts')

function Profile(configs) {

    this.access_token = configs['access_token']
    this.refresh_token = configs['refresh_token']
    this.token_type = configs['token_type']
    this.character_id = configs['character_id']
    this.character_name = configs['character_name']
    this.token_expires = configs['token_expires'] 

    this.interfaces = {}

}

Profile.prototype.Contracts = function Contracts() {
    if (this.interfaces.contracts === undefined) {
        this.interfaces.contracts = new ContractSource(this)
    }

    return this.interfaces.contracts
}

module.exports = Profile