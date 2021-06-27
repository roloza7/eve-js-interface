
/**
 *  Create an Error with a message and error code.
 * 
 *  @param {string} message The error message
 *  @param {string} code The error code
 * 
 *  @returns {Error} The created custom Error
 */

module.exports = function generateError(message, name) {
    var error = new Error(message);
    error.name = name;

    error.toJSON = function toJSON() {
        return {
            
            message: this.message,
            name: this.name,

            description: this.description,
            number: this.number
        }
    }

    return error;
}