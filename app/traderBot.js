const helpers = require('../app/helpers');
const defaults = require('../config/options').address;
const methods = require('../config/options').methods;
const getMessageSignature = require('./helpers').messageSignatureBuilder;
const rawRequest = require('./helpers').rawRequest;

class TraderBot {
    constructor(key, secret, options) {
        // Allow passing the OTP as the third argument for backwards compatibility
        if(typeof options === 'string') {
            options = { otp : options };
        }

        this.config = Object.assign({ key, secret }, defaults, options);
    }

    /**
     * This method makes a public or private API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    api(method, params, callback) {
        // Default params to empty object
        if(typeof params === 'function') {
            callback = params;
            params   = {};
        }

        if(methods.public.includes(method)) {
            return this.publicMethod(method, params, callback);
        }
        else if(methods.private.includes(method)) {
            return this.privateMethod(method, params, callback);
        }
        else {
            throw new Error(method + ' is not a valid API method.');
        }
    }

    /**
     * This method makes a public API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    publicMethod(method, params, callback) {
        params = params || {};

        // Default params to empty object
        if(typeof params === 'function') {
            callback = params;
            params   = {};
        }

        const path     = '/' + this.config.version + '/public/' + method;
        const url      = this.config.url + path;
        const response = rawRequest(url, {}, params, this.config.timeout);

        if(typeof callback === 'function') {
            response
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null));
        }

        return response;
    }

    /**
     * This method makes a private API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    privateMethod(method, params, callback) {
        params = params || {};

        // Default params to empty object
        if(typeof params === 'function') {
            callback = params;
            params   = {};
        }

        const path = '/' + this.config.version + '/private/' + method;
        const url  = this.config.url + path;

        if(!params.nonce) {
            params.nonce = new Date() * 1000; // spoof microsecond
        }

        if(this.config.otp !== undefined) {
            params.otp = this.config.otp;
        }

        const signature = getMessageSignature(
            path,
            params,
            this.config.secret,
            params.nonce
        );

        const headers = {
            'API-Key'  : this.config.key,
            'API-Sign' : signature,
        };

        const response = rawRequest(url, headers, params, this.config.timeout);

        if(typeof callback === 'function') {
            response
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null));
        }

        return response;
    }
}

module.exports = TraderBot;