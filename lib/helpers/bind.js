'use strict';

/**
 * Binds prototypes to the context of main func
 * 
 * @param {Object} context the main func whose context we want prototypes to be bound to
 * @param {Object} fn prototypes object for mass bind
 * 
 */
function bind(fn, context) {

    return function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i]
        }
        return fn.apply(context, args)
    }

}

/**
 * 
 * Programmatically extends main func by binding its prototypes within functional context
 * 
 * @param {Object} instance The main instance to which we'll add prototypes
 * @param {Object} prototypes The set of prototypes we want to add to the functionality
 * 
 */
function extend(instance, prototypes) {

    Object.keys(prototypes).forEach(function(val) {
        if (instance && typeof prototypes[val] === 'function') {
            instance[val] = prototypes[val].bind(instance)
        } else {
            instance[val] = val
        }
    })

    return instance;
}


module.exports = {
    bind: bind,
    extend: extend
}