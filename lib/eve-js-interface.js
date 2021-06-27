'use strict';

var Esii = require('./core/Esii')
var defaults = require('./defaults')
var { extend } = require('./helpers/bind')







/**
 * Create an instance of ESII
 * 
 * @param {Object} configObject The config for creating the instance - { client_id: {clientid}, secret_key: {secret_key}, callback_uri: {callback_uri}, scopes: {}}
 * @return {ESII} A new instance of ESII
 */

function createInstance(configObject) {
    
    var context = new Esii(configObject);
    var instance = extend(context, Esii.prototype)
    return instance;
}

var esii = createInstance(defaults)

esii.create = function create(instanceConfig) {
    return createInstance(instanceConfig)
}

module.exports = esii;
