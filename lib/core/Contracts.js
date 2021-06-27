'use strict';

var { buildGETUrl } = require('../utils')
const axios = require('axios')


function Contracts(context) {
    this.context = context;

}
 
/**
 * Fetches a given page in a character's contract list
 * 
 * @param {integer} page some page
 * 
 * @returns {Promise} Promise containing json list on resolve
 */
Contracts.prototype.fetchPage = function(page) {

    var url = buildGETUrl("https://esi.evetech.net/latest/characters/" + this.context.character_id + "/contracts", { datasource: 'tranquility', page: page, token: this.context.access_token })

    console.log(url)

    var requestHeaders = {
        headers: {
            'User-Agent': 'EVE-Novisual-Buyback'
        }
    }

    return new Promise((resolve, reject) => {
        axios
        .get(url, requestHeaders)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })

}

module.exports = Contracts