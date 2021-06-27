'use strict';

/**
 *  Merges two objects given 
 * 
 *  Target will take precedence.
 * 
 */


function merge(obj, target) {


    var result = {};

    Object.keys(obj).forEach( function (key) {
        if (target[key] !== undefined) {
            result[key] = target[key];
        } else {
            result[key] = obj[key];
        }
    });

    return result;
}

/**
 *  
 *  Builds GET request url using a base and an optional parameters object
 * 
 * @param {string} url - url to build on 
 * @param {Object} params - parameter to build id from e.g.: { character_id: '12345678', datasource: 'tranquility'}
 * 
 * @returns {string} builtUrl - built string
 * 
 * */

function buildGETUrl(url, params) {

    var construct = url + "?"
    var queries = []
    Object.keys(params).forEach((key) => {
        queries.push(key + "=" + params[key])
    })

    return construct + queries.join("&");

}

module.exports = {
    merge: merge,
    buildGETUrl: buildGETUrl
}