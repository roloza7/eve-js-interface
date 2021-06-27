'use strict';

var { buildGETUrl } = require('../utils')
const axios = require('axios')
var generateError = require('./generateError')

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
Contracts.prototype.Page = function(page) {

    var url = buildGETUrl("https://esi.evetech.net/latest/characters/" + this.context.character_id + "/contracts", { datasource: 'tranquility', page: page, token: this.context.access_token })

    var requestHeaders = {
        headers: {
            'User-Agent': 'EVE-Novisual-Buyback'
        }
    }

    return new Promise((resolve, reject) => {
        axios
        .get(url, requestHeaders)
        .then((res) => resolve(res.data))
        .catch((err) => {
            if (err.response.status === 500 && err.response.data === 'Undefined 404 response. Original message: Requested page does not exist!') {
                reject(generateError("Nonexistent Page: " + page, "NoSuchPageError"))
            }
        })
    })

}

/**
 * Fetches contract with a given title (up to 30 days)
 * 
 * @param {string} name the name of the contract to fetch (in-game description field)
 * 
 * @return {Promise} Promise containing json list on resolve
 */
Contracts.prototype.getContractByName = function(name, page = 1) {
    /**
     * We need to execute fetches for pages 1, 2, 3, etc until we find the contract with a given name
     * Usually this will get resolved after page 1 or 2
     * Since chaining promises using for loops causes them to execute synchronously we will use recursion
     * This is so we dont overwhelm the server with n page requests given that we'll find the contracts within the first few pages usually
     */

    var fetchPagePromise = new Promise((resolve, reject) => {

        var ESIPageRequestPromise = Contracts.prototype.Page.apply(this, [page])
        ESIPageRequestPromise
            .then((res) => {

                /**
                 * Search contract array for contract with given name
                 */

                res.forEach((element) => {
                    if (element.title === name) {
                        resolve(element)
                    }
                })

                /**
                 * If we got the page succesfully but no such element was found, call the function again
                 */
                Contracts.prototype.getContractByName(name, page + 1)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err))


            })
            .catch((err) => {

                /**
                 * If error, probably we dont have any pages left. Resolve with null.
                 * For all other errors reject and blow up.
                 */

                if (err.name === "NoSuchPageError") {
                    resolve(null)
                } else {
                    reject(err)
                }
            })
    })

    return fetchPagePromise;



}

/**
 * Fetches contract item information with a given title (up to 30 days)
 * 
 * @param {string} name the name of the contract whose items to fetch (in-game description field)
 * 
 * @return {Promise} Promise containing json list of items in the contract
 */
Contracts.prototype.getContractItemsByName = function(name) {

    return new Promise((resolve, reject) => {

        /**
         *  Fetch contract and extract ID
         */
        Contracts.prototype.getContractByName.apply(this, [name])
            .then((res) => {
                /**
                 * Return promise containing json list of items in contract
                 */
                Contracts.prototype.getContractItemsByID.apply(this, [res.contract_id])
                    .then((res) => resolve(res))
                    .catch((err) => reject(err))

            })
            .catch((err) => {
                /**
                 * Failed to get contract by name, blow up error
                 */
                reject(err)
            })

    })

}

/**
 * 
 * @param {integer} id the id of the contract whose items to fetch
 * 
 * @return {Promise} Promise containing json list of items in the contract
 *  
 */
Contracts.prototype.getContractItemsByID = function(id) {

    var url = buildGETUrl("https://esi.evetech.net/latest/characters/" + this.context.character_id + "/contracts/" + id + "/items/",
        { datasource: 'tranquility', token: this.context.access_token })

    
    var requestHeaders = {
        headers: {
            'User-agent': 'EVE Novisual-Buyback'
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